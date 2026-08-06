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
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Database path
const dbPath = path.join(__dirname, 'db.json');

// Helper to read database
const readDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json, returning empty structure:', error);
    return { sliderImages: [], sotk: [], umkm: [], berita: [], infografis: {}, villageInfo: {} };
  }
};

// Helper to write database
const writeDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
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

// Multer configuration (Memory storage for Cloudinary, Disk storage for local fallback)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- AUTH ROUTE ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const envUser = process.env.ADMIN_USERNAME || 'admin';
  const envPass = process.env.ADMIN_PASSWORD || 'admin';

  if (username === envUser && password === envPass) {
    // Generate a simple token
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    return res.json({ token, username });
  }
  return res.status(401).json({ message: 'Username atau Password salah!' });
});

// Admin validation helper
const validateAdmin = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  return true; // Simple check for bearer token presence
};

// --- FILE UPLOAD TO CLOUDINARY OR LOCAL FALLBACK ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada berkas yang diunggah!' });
  }

  try {
    if (isCloudinaryConfigured()) {
      // Upload to Cloudinary using upload_stream
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
      // Local fallback
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
app.get('/api/village-info', (req, res) => {
  const db = readDb();
  res.json(db.villageInfo);
});

app.put('/api/village-info', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.villageInfo = { ...db.villageInfo, ...req.body };
  writeDb(db);
  res.json(db.villageInfo);
});

// --- SLIDER IMAGES API ---
app.get('/api/slider', (req, res) => {
  const db = readDb();
  res.json(db.sliderImages);
});

app.post('/api/slider', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  const newSlide = { id: String(Date.now()), ...req.body };
  db.sliderImages.push(newSlide);
  writeDb(db);
  res.json(newSlide);
});

app.delete('/api/slider/:id', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.sliderImages = db.sliderImages.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Slide deleted' });
});

// --- BERITA CRUD API ---
app.get('/api/berita', (req, res) => {
  const db = readDb();
  res.json(db.berita);
});

app.post('/api/berita', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  const newBerita = { id: String(Date.now()), ...req.body };
  db.berita.unshift(newBerita);
  writeDb(db);
  res.json(newBerita);
});

app.put('/api/berita/:id', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.berita = db.berita.map(item => item.id === req.params.id ? { ...item, ...req.body } : item);
  writeDb(db);
  res.json({ message: 'Berita updated' });
});

app.delete('/api/berita/:id', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.berita = db.berita.filter(item => item.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Berita deleted' });
});

// --- UMKM CRUD API ---
app.get('/api/umkm', (req, res) => {
  const db = readDb();
  res.json(db.umkm);
});

app.post('/api/umkm', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  const newProduct = { id: String(Date.now()), ...req.body };
  db.umkm.unshift(newProduct);
  writeDb(db);
  res.json(newProduct);
});

app.put('/api/umkm/:id', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.umkm = db.umkm.map(item => item.id === req.params.id ? { ...item, ...req.body } : item);
  writeDb(db);
  res.json({ message: 'Product updated' });
});

app.delete('/api/umkm/:id', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.umkm = db.umkm.filter(item => item.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Product deleted' });
});

// --- SOTK CRUD API ---
app.get('/api/sotk', (req, res) => {
  const db = readDb();
  res.json(db.sotk);
});

app.post('/api/sotk', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  const newMember = { id: String(Date.now()), ...req.body };
  db.sotk.push(newMember);
  writeDb(db);
  res.json(newMember);
});

app.put('/api/sotk/:id', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.sotk = db.sotk.map(member => member.id === req.params.id ? { ...member, ...req.body } : member);
  writeDb(db);
  res.json({ message: 'SOTK member updated' });
});

app.delete('/api/sotk/:id', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.sotk = db.sotk.filter(member => member.id !== req.params.id);
  writeDb(db);
  res.json({ message: 'SOTK member deleted' });
});

// --- INFOGRAFIS API ---
app.get('/api/infografis', (req, res) => {
  const db = readDb();
  res.json(db.infografis);
});

app.put('/api/infografis', (req, res) => {
  if (!validateAdmin(req)) return res.status(401).json({ message: 'Unauthorized' });
  const db = readDb();
  db.infografis = { ...db.infografis, ...req.body };
  writeDb(db);
  res.json(db.infografis);
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  });
}

export default app;
