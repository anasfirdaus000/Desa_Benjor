import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Automatic async route error catching patch
const patchMethod = (method) => {
  const original = app[method].bind(app);
  app[method] = (path, ...callbacks) => {
    const wrapped = callbacks.map(cb => {
      if (typeof cb !== 'function') return cb;
      return (req, res, next) => {
        try {
          const result = cb(req, res, next);
          if (result && typeof result.catch === 'function') {
            result.catch(next);
          }
        } catch (err) {
          next(err);
        }
      };
    });
    return original(path, ...wrapped);
  };
};
patchMethod('get');
patchMethod('post');
patchMethod('put');
patchMethod('delete');

app.use(cors());
app.use(express.json());

// Ensure local uploads folder exists for fallback uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Database path
const dbPath = path.join(__dirname, 'db.json');

// --- SUPABASE CLIENT SETUP ---
let supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Sanitize URL by removing /rest/v1 suffix if present
if (supabaseUrl) {
  supabaseUrl = supabaseUrl.trim();
  if (supabaseUrl.endsWith('/rest/v1/')) {
    supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/$/, '');
  } else if (supabaseUrl.endsWith('/rest/v1')) {
    supabaseUrl = supabaseUrl.replace(/\/rest\/v1$/, '');
  }
}

const hasSupabase = 
  supabaseUrl && 
  supabaseUrl !== 'your_supabase_url' && 
  supabaseKey && 
  supabaseKey !== 'your_supabase_key';

const supabase = hasSupabase ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log('⚡ Supabase database connection initialized successfully.');
} else {
  console.log('⚠️ Supabase not configured. Using local fallback database: /backend/db.json');
}

// Local read backup
const readLocalDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json, returning empty structure:', error);
    return { sliderImages: [], sotk: [], umkm: [], berita: [], infografis: {}, villageInfo: {}, wisata: [] };
  }
};

// Local write backup
const writeLocalDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing local db.json:', error);
  }
};

// Unified dynamic read interface (Supabase cloud first, local db.json fallback)
const fetchDb = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('desa_benjor_db')
        .select('data')
        .eq('id', 1)
        .single();

      if (data && data.data) {
        return data.data;
      }
      
      // If table is empty or row does not exist, initialize it
      console.log('Supabase table empty or row not found. Initializing with default local data...');
      const localData = readLocalDb();
      const { error: initError } = await supabase.from('desa_benjor_db').upsert({ id: 1, data: localData });
      if (initError) {
        console.warn('Initial Supabase seed failed, RLS might be active:', initError.message);
      }
      return localData;
    } catch (err) {
      console.warn('Supabase query failed, falling back to local db.json:', err.message);
      return readLocalDb();
    }
  }
  return readLocalDb();
};

// Unified dynamic write interface (writes local backup and syncs to Supabase cloud)
const saveDb = async (newData) => {
  writeLocalDb(newData); // Always update local backup

  if (supabase) {
    const { error: updateError } = await supabase
      .from('desa_benjor_db')
      .update({ data: newData })
      .eq('id', 1);

    if (updateError) {
      console.warn('Supabase update failed, trying upsert...', updateError.message);
      const { error: upsertError } = await supabase
        .from('desa_benjor_db')
        .upsert({ id: 1, data: newData });

      if (upsertError) {
        console.error('Supabase upsert failed too:', upsertError.message);
        throw new Error(`Database Supabase Error: ${upsertError.message}`);
      }
    }
  }
};

// Check if Cloudinary is fully configured
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'your_api_secret'
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('☁️ Cloudinary integration initialized successfully.');
} else {
  console.log('⚠️ Cloudinary not configured. Uploads will fallback to local folder: /backend/uploads/');
}

// Multer configuration for uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- AUTH ROUTE ---
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

// Admin validation helper
const validateAdmin = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  return true;
};

// --- FILE UPLOAD TO CLOUDINARY OR LOCAL FALLBACK ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada berkas yang diunggah!' });
  }

  try {
    if (isCloudinaryConfigured()) {
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'desa_benjor', resource_type: 'auto' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadStream();
      console.log('File successfully uploaded to Cloudinary:', result.secure_url);
      return res.json({ url: result.secure_url });
    } else {
      const ext = path.extname(req.file.originalname);
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, req.file.buffer);
      const fileUrl = `http://localhost:${PORT}/uploads/${filename}`;
      console.log('File successfully saved locally:', fileUrl);
      return res.json({ url: fileUrl });
    }
  } catch (error) {
    console.error('File upload failed:', error);
    return res.status(500).json({ message: 'Gagal mengunggah berkas', error: error.message });
  }
});

// --- VILLAGE INFO API ---
app.get('/api/village-info', async (req, res) => {
  const db = await fetchDb();
  res.json(db.villageInfo);
});

app.put('/api/village-info', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.villageInfo = { ...db.villageInfo, ...req.body };
  await saveDb(db);
  res.json(db.villageInfo);
});

// --- SLIDER IMAGES API ---
app.get('/api/slider', async (req, res) => {
  const db = await fetchDb();
  res.json(db.sliderImages);
});

app.post('/api/slider', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  const newSlide = { id: String(Date.now()), ...req.body };
  db.sliderImages.push(newSlide);
  await saveDb(db);
  res.json(newSlide);
});

app.delete('/api/slider/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.sliderImages = db.sliderImages.filter(s => s.id !== req.params.id);
  await saveDb(db);
  res.json({ message: 'Slide deleted' });
});

// --- BERITA CRUD API ---
app.get('/api/berita', async (req, res) => {
  const db = await fetchDb();
  res.json(db.berita);
});

app.post('/api/berita', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  const newBerita = { id: String(Date.now()), ...req.body };
  db.berita.unshift(newBerita);
  await saveDb(db);
  res.json(newBerita);
});

app.put('/api/berita/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.berita = db.berita.map(item => item.id === req.params.id ? { ...item, ...req.body } : item);
  await saveDb(db);
  res.json({ message: 'Berita updated' });
});

app.delete('/api/berita/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.berita = db.berita.filter(item => item.id !== req.params.id);
  await saveDb(db);
  res.json({ message: 'Berita deleted' });
});

// --- UMKM CRUD API ---
app.get('/api/umkm', async (req, res) => {
  const db = await fetchDb();
  res.json(db.umkm);
});

app.post('/api/umkm', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  const newProduct = { id: String(Date.now()), ...req.body };
  db.umkm.unshift(newProduct);
  await saveDb(db);
  res.json(newProduct);
});

app.put('/api/umkm/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.umkm = db.umkm.map(item => item.id === req.params.id ? { ...item, ...req.body } : item);
  await saveDb(db);
  res.json({ message: 'Product updated' });
});

app.delete('/api/umkm/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.umkm = db.umkm.filter(item => item.id !== req.params.id);
  await saveDb(db);
  res.json({ message: 'Product deleted' });
});

// --- SOTK CRUD API ---
app.get('/api/sotk', async (req, res) => {
  const db = await fetchDb();
  res.json(db.sotk);
});

app.post('/api/sotk', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  const newMember = { id: String(Date.now()), ...req.body };
  db.sotk.push(newMember);
  await saveDb(db);
  res.json(newMember);
});

app.put('/api/sotk/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.sotk = db.sotk.map(member => member.id === req.params.id ? { ...member, ...req.body } : member);
  await saveDb(db);
  res.json({ message: 'SOTK member updated' });
});

app.delete('/api/sotk/:id', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.sotk = db.sotk.filter(member => member.id !== req.params.id);
  await saveDb(db);
  res.json({ message: 'SOTK member deleted' });
});

// --- INFOGRAFIS API ---
app.get('/api/infografis', async (req, res) => {
  const db = await fetchDb();
  res.json(db.infografis);
});

app.put('/api/infografis', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  db.infografis = { ...db.infografis, ...req.body };
  await saveDb(db);
  res.json(db.infografis);
});

// --- WISATA & KOMENTAR API ---
app.get('/api/wisata', async (req, res) => {
  const db = await fetchDb();
  res.json(db.wisata || []);
});

app.post('/api/wisata/:id/comments', async (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) {
    return res.status(400).json({ message: 'Nama dan komentar tidak boleh kosong!' });
  }
  const db = await fetchDb();
  const wisataItem = db.wisata?.find(w => w.id === req.params.id);
  if (!wisataItem) {
    return res.status(404).json({ message: 'Objek wisata tidak ditemukan!' });
  }
  const newComment = {
    id: String(Date.now()),
    name,
    text,
    date: new Date().toISOString().split('T')[0]
  };
  if (!wisataItem.comments) wisataItem.comments = [];
  wisataItem.comments.push(newComment);
  await saveDb(db);
  res.json(newComment);
});

app.delete('/api/wisata/:id/comments/:commentId', async (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = await fetchDb();
  const wisataItem = db.wisata?.find(w => w.id === req.params.id);
  if (!wisataItem) {
    return res.status(404).json({ message: 'Objek wisata tidak ditemukan!' });
  }
  if (!wisataItem.comments) wisataItem.comments = [];
  wisataItem.comments = wisataItem.comments.filter(c => c.id !== req.params.commentId);
  await saveDb(db);
  res.json({ message: 'Komentar berhasil dihapus' });
});

// --- CENTRAL ERROR-HANDLING MIDDLEWARE ---
app.use((err, req, res, next) => {
  console.error('API Server Error:', err);
  res.status(500).json({ message: err.message || 'Terjadi kesalahan internal pada server' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  });
}

export default app;
