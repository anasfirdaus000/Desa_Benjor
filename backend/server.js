import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure local uploads folder exists for fallback uploads
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));
} catch (e) {
  console.warn('Could not setup local uploads dir:', e.message);
}

// Database path
const dbPath = path.join(__dirname, 'db.json');

// --- SUPABASE CREDENTIALS ---
let supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_KEY || '').trim();

// Strip any /rest/v1 suffix from URL
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

const hasSupabase =
  supabaseUrl &&
  supabaseUrl !== 'your_supabase_url' &&
  supabaseKey &&
  supabaseKey !== 'your_supabase_key';

if (hasSupabase) {
  console.log('⚡ Supabase credentials loaded for project:', supabaseUrl.split('.')[0].split('//')[1]);
} else {
  console.log('⚠️ Supabase not configured. Using local fallback db.json');
}

// --- SUPABASE REST HELPERS (raw fetch, avoids @supabase/supabase-js ECONNRESET bug) ---
const supabaseHeaders = () => ({
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
});

const supabaseSelect = async () => {
  const url = `${supabaseUrl}/rest/v1/desa_benjor_db?id=eq.1&select=data`;
  const res = await fetch(url, { headers: supabaseHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase SELECT error ${res.status}: ${text}`);
  }
  const rows = await res.json();
  return rows[0]?.data || null;
};

const supabaseUpsert = async (data) => {
  const url = `${supabaseUrl}/rest/v1/desa_benjor_db`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...supabaseHeaders(), 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: 1, data })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase UPSERT error ${res.status}: ${text}`);
  }
  return true;
};

// --- LOCAL FILE HELPERS ---
const readLocalDb = () => {
  // Try /tmp first (Vercel serverless writeable dir)
  const tmpPath = '/tmp/db.json';
  try {
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf8');
      const parsed = JSON.parse(raw);
      // Only use if it has actual content
      if (parsed && Object.keys(parsed).length > 2) return parsed;
    }
  } catch (e) {
    console.warn('Could not read /tmp/db.json:', e.message);
  }
  // Fallback to packaged db.json
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Could not read db.json:', e.message);
    return { sliderImages: [], sotk: [], umkm: [], berita: [], infografis: {}, villageInfo: {}, wisata: [] };
  }
};

const writeLocalDb = (data) => {
  // Try writing to packaged path first
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return;
  } catch (e) {
    // Read-only filesystem (Vercel), fall back to /tmp
  }
  try {
    fs.writeFileSync('/tmp/db.json', JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Could not write to /tmp/db.json:', e.message);
  }
};

// --- UNIFIED DB READ ---
const fetchDb = async () => {
  if (hasSupabase) {
    try {
      const cloudData = await supabaseSelect();
      if (cloudData) return cloudData;
      // Row not found, seed with local data
      const localData = readLocalDb();
      try {
        await supabaseUpsert(localData);
        console.log('Database seeded to Supabase from local db.json');
      } catch (seedErr) {
        console.warn('Could not seed Supabase (check RLS settings):', seedErr.message);
      }
      return localData;
    } catch (err) {
      console.warn('Supabase read failed, using local fallback:', err.message);
    }
  }
  return readLocalDb();
};

// --- UNIFIED DB WRITE ---
// Never throws — saves locally first, then attempts cloud sync
const saveDb = async (newData) => {
  writeLocalDb(newData);
  if (hasSupabase) {
    try {
      await supabaseUpsert(newData);
    } catch (err) {
      // Log but don't crash — local write was already successful
      console.warn('Supabase write skipped (check RLS):', err.message);
      throw err; // Re-throw so routes can return error info to client
    }
  }
};

// --- CLOUDINARY SETUP ---
const isCloudinaryConfigured = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('☁️ Cloudinary integration initialized.');
} else {
  console.log('⚠️ Cloudinary not configured. Image uploads will use local storage.');
}

// Multer
const upload = multer({ storage: multer.memoryStorage() });

// --- ADMIN VALIDATION ---
const validateAdmin = (req) => {
  const auth = req.headers.authorization;
  return auth && auth.startsWith('Bearer ');
};

// --- SAVE HELPER (catches & returns error to client) ---
const trySave = async (res, data, successBody) => {
  try {
    await saveDb(data);
    return res.json(successBody);
  } catch (err) {
    console.error('Save failed:', err.message);
    return res.status(500).json({ message: err.message || 'Gagal menyimpan perubahan ke database' });
  }
};

// ========================
//   R O U T E S
// ========================

// --- AUTH ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const envUser = process.env.ADMIN_USERNAME || 'admin';
  const envPass = process.env.ADMIN_PASSWORD || 'admin';
  if (username === envUser && password === envPass) {
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    return res.json({ token, username });
  }
  return res.status(401).json({ message: 'Username atau Password salah!' });
});

// --- FILE UPLOAD ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Tidak ada berkas yang diunggah!' });
  try {
    if (isCloudinaryConfigured()) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'desa_benjor', resource_type: 'auto' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      return res.json({ url: result.secure_url });
    } else {
      const ext = path.extname(req.file.originalname);
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      return res.json({ url: `http://localhost:${PORT}/uploads/${filename}` });
    }
  } catch (error) {
    console.error('Upload failed:', error);
    return res.status(500).json({ message: 'Gagal mengunggah berkas', error: error.message });
  }
});

// --- VILLAGE INFO ---
app.get('/api/village-info', async (req, res) => {
  try { const db = await fetchDb(); res.json(db.villageInfo || {}); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/village-info', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.villageInfo = { ...db.villageInfo, ...req.body };
    await trySave(res, db, db.villageInfo);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- SLIDER IMAGES ---
app.get('/api/slider', async (req, res) => {
  try { const db = await fetchDb(); res.json(db.sliderImages || []); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/slider', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    const newSlide = { id: String(Date.now()), ...req.body };
    db.sliderImages = [...(db.sliderImages || []), newSlide];
    await trySave(res, db, newSlide);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/slider/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.sliderImages = (db.sliderImages || []).filter(s => s.id !== req.params.id);
    await trySave(res, db, { message: 'Slide deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- BERITA ---
app.get('/api/berita', async (req, res) => {
  try { const db = await fetchDb(); res.json(db.berita || []); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/berita', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    const newBerita = { id: String(Date.now()), ...req.body };
    db.berita = [newBerita, ...(db.berita || [])];
    await trySave(res, db, newBerita);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/berita/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.berita = (db.berita || []).map(item => item.id === req.params.id ? { ...item, ...req.body } : item);
    await trySave(res, db, { message: 'Berita updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/berita/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.berita = (db.berita || []).filter(item => item.id !== req.params.id);
    await trySave(res, db, { message: 'Berita deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- UMKM ---
app.get('/api/umkm', async (req, res) => {
  try { const db = await fetchDb(); res.json(db.umkm || []); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/umkm', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    const newProduct = { id: String(Date.now()), ...req.body };
    db.umkm = [newProduct, ...(db.umkm || [])];
    await trySave(res, db, newProduct);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/umkm/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.umkm = (db.umkm || []).map(item => item.id === req.params.id ? { ...item, ...req.body } : item);
    await trySave(res, db, { message: 'Product updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/umkm/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.umkm = (db.umkm || []).filter(item => item.id !== req.params.id);
    await trySave(res, db, { message: 'Product deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- SOTK ---
app.get('/api/sotk', async (req, res) => {
  try { const db = await fetchDb(); res.json(db.sotk || []); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/sotk', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    const newMember = { id: String(Date.now()), ...req.body };
    db.sotk = [...(db.sotk || []), newMember];
    await trySave(res, db, newMember);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/sotk/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.sotk = (db.sotk || []).map(m => m.id === req.params.id ? { ...m, ...req.body } : m);
    await trySave(res, db, { message: 'SOTK member updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/sotk/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.sotk = (db.sotk || []).filter(m => m.id !== req.params.id);
    await trySave(res, db, { message: 'SOTK member deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- INFOGRAFIS ---
app.get('/api/infografis', async (req, res) => {
  try { const db = await fetchDb(); res.json(db.infografis || {}); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/infografis', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.infografis = { ...db.infografis, ...req.body };
    await trySave(res, db, db.infografis);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- WISATA ---
app.get('/api/wisata', async (req, res) => {
  try { const db = await fetchDb(); res.json(db.wisata || []); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/wisata', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    const newWisata = { id: String(Date.now()), comments: [], photos: [], ...req.body };
    db.wisata = [newWisata, ...(db.wisata || [])];
    await trySave(res, db, newWisata);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/wisata/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.wisata = (db.wisata || []).map(w => w.id === req.params.id ? { ...w, ...req.body } : w);
    await trySave(res, db, { message: 'Wisata updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/wisata/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    db.wisata = (db.wisata || []).filter(w => w.id !== req.params.id);
    await trySave(res, db, { message: 'Wisata deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- WISATA KOMENTAR ---
app.post('/api/wisata/:id/comments', async (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) return res.status(400).json({ message: 'Nama dan komentar tidak boleh kosong!' });
  try {
    const db = await fetchDb();
    const wisataItem = (db.wisata || []).find(w => w.id === req.params.id);
    if (!wisataItem) return res.status(404).json({ message: 'Objek wisata tidak ditemukan!' });
    if (!wisataItem.comments) wisataItem.comments = [];
    const newComment = { id: String(Date.now()), name, text, date: new Date().toISOString().split('T')[0] };
    wisataItem.comments.push(newComment);
    await trySave(res, db, newComment);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/wisata/:id/comments/:commentId', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const db = await fetchDb();
    const wisataItem = (db.wisata || []).find(w => w.id === req.params.id);
    if (!wisataItem) return res.status(404).json({ message: 'Objek wisata tidak ditemukan!' });
    wisataItem.comments = (wisataItem.comments || []).filter(c => c.id !== req.params.commentId);
    await trySave(res, db, { message: 'Komentar berhasil dihapus' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// --- DB HEALTH CHECK (useful for Vercel log debugging) ---
app.get('/api/health', async (req, res) => {
  const status = { supabase: hasSupabase, cloudinary: isCloudinaryConfigured(), localDb: fs.existsSync(dbPath) };
  if (hasSupabase) {
    try {
      await supabaseSelect();
      status.supabaseReachable = true;
    } catch (e) {
      status.supabaseReachable = false;
      status.supabaseError = e.message;
    }
  }
  res.json(status);
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
