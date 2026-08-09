import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface SliderImage {
  id: string;
  url: string;
}

export interface SOTK {
  id: string;
  name: string;
  position: string;
  level: number;
  image: string;
}

export interface UMKM {
  id: string;
  name: string;
  price: number;
  description: string;
  owner: string;
  wa: string;
  category: string;
  image: string;
}

export interface Berita {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  image: string;
}

export interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

export interface Wisata {
  id: string;
  title: string;
  image: string;
  images?: string[];
  desc: string;
  comments: Comment[];
}

export interface InfografisData {
  penduduk: {
    labels: string[];
    data: number[];
  };
  apbdes: {
    labels: string[];
    data: number[];
  };
  bansos: {
    labels: string[];
    data: number[];
  };
}

export interface VillageInfo {
  headName: string;
  headImage: string;
  welcomeMessage: string;
  heroTitle?: string;
  heroSubtitle?: string;
  footerDescription?: string;
  history: string;
  vision: string;
  mission: string;
  geography: string;
  mapEmbedUrl: string;
  contact: {
    address: string;
    email: string;
    phone: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  stats: {
    area: string;
    rt: string;
    rw: string;
    kk?: string;
    sementara?: string;
    mutasi?: string;
    visitors?: string;
  };
}

export interface AdminProfile {
  name: string;
  email: string;
}

export interface AppState {
  sliderImages: SliderImage[];
  sotk: SOTK[];
  umkm: UMKM[];
  berita: Berita[];
  infografis: InfografisData;
  villageInfo: VillageInfo;
  adminProfile: AdminProfile;
  wisata: Wisata[];
  fetchWisata: () => Promise<void>;
  setSliderImages: React.Dispatch<React.SetStateAction<SliderImage[]>>;
  setSotk: React.Dispatch<React.SetStateAction<SOTK[]>>;
  setUmkm: React.Dispatch<React.SetStateAction<UMKM[]>>;
  setBerita: React.Dispatch<React.SetStateAction<Berita[]>>;
  setInfografis: React.Dispatch<React.SetStateAction<InfografisData>>;
  setVillageInfo: React.Dispatch<React.SetStateAction<VillageInfo>>;
  setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile>>;
  setWisata: React.Dispatch<React.SetStateAction<Wisata[]>>;
}

const initialSliderImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80' },
  { id: '2', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80' }
];

const initialSOTK = [
  { id: '1', name: 'IMAM MUNIR, SH', position: 'Kepala Desa', level: 1, image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: '2', name: 'BUDI SANTOSO', position: 'Sekretaris Desa', level: 2, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: '3', name: 'SITI AMINAH', position: 'Kaur Keuangan', level: 3, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: '4', name: 'AHMAD FAUZI', position: 'Kasie Pemerintahan', level: 3, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: '5', name: 'JOKO WIDODO', position: 'Kepala Dusun I', level: 4, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200' }
];

const initialUMKM = [
  { id: '1', name: 'Kripik Singkong Benjor', price: 15000, description: 'Kripik singkong renyah khas desa', owner: 'Bu Ningsih', wa: '6281234567890', category: 'Kuliner', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80' },
  { id: '2', name: 'Kerajinan Anyaman Bambu', price: 50000, description: 'Anyaman bambu berkualitas tinggi', owner: 'Pak Tarno', wa: '6281234567891', category: 'Kerajinan', image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80' },
  { id: '3', name: 'Kopi Bubuk Asli', price: 35000, description: 'Kopi bubuk robusta dari petani lokal', owner: 'Cak Nur', wa: '6281234567892', category: 'Hasil Tani', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80' }
];

const initialBerita = [
  { id: '1', title: 'Penyaluran BLT Dana Desa Tahap I', summary: 'Pemerintah Desa Benjor telah menyalurkan Bantuan Langsung Tunai (BLT)...', content: 'Konten lengkap...', category: 'Pemerintahan', date: '2023-10-01', image: 'https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&q=80' },
  { id: '2', title: 'Kerja Bakti Membersihkan Saluran Air', summary: 'Warga desa antusias mengikuti kerja bakti dalam rangka persiapan musim hujan...', content: 'Konten lengkap...', category: 'Kegiatan Warga', date: '2023-10-05', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80' }
];

const initialInfografis = {
  penduduk: { labels: ['Laki-laki', 'Perempuan'], data: [1500, 1600] },
  apbdes: { labels: ['Pendapatan Asli Desa', 'Dana Desa', 'Bantuan Kabupaten', 'Lain-lain'], data: [50, 800, 200, 50] }, // in millions
  bansos: { labels: ['PKH', 'BPNT', 'BLT DD'], data: [200, 350, 150] }
};

const initialVillageInfo: VillageInfo = {
  headName: 'IMAM MUNIR, SH',
  headImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400',
  welcomeMessage: 'Selamat datang di website resmi Desa Benjor. Kami berkomitmen untuk mewujudkan desa yang mandiri, sejahtera, dan religius melalui transparansi dan pelayanan prima.',
  heroTitle: 'Selamat Datang di Website Resmi Desa Benjor',
  heroSubtitle: 'Mewujudkan tata kelola pemerintahan desa yang mandiri, transparan, sejahtera, dan berbudaya berlandaskan gotong royong.',
  footerDescription: 'Sistem Informasi Desa Benjor, Kecamatan Tumpang, Kabupaten Malang. Mewujudkan pelayanan desa digital yang efisien, transparan, dan terpercaya.',
  history: 'Desa Benjor memiliki sejarah panjang yang erat kaitannya dengan perjuangan masyarakat lokal...',
  vision: 'Mewujudkan Desa Benjor yang Mandiri, Sejahtera, dan Berbudaya Berlandaskan Gotong Royong.',
  mission: '1. Meningkatkan kualitas pelayanan publik.\n2. Mengembangkan potensi ekonomi kerakyatan melalui UMKM.\n3. Melestarikan budaya dan lingkungan hidup.',
  geography: 'Desa Benjor terletak di dataran tinggi dengan luas wilayah 450 Ha. Berbatasan dengan Desa X di utara, Desa Y di selatan.',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31610.9996772702!2d112.78436814999999!3d-8.013146449999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6242377a3dcd7%3A0x6b97eb943c2fa572!2sBenjor%2C%20Tumpang%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  contact: {
    address: 'Jl. Raya Benjor No. 1, Tumpang, Malang',
    email: 'info@benjor.desa.id',
    phone: '(0341) 123456'
  },
  socialMedia: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com'
  },
  stats: {
    area: '450 Ha',
    rt: '15',
    rw: '4',
    kk: '435',
    sementara: '12',
    mutasi: '5',
    visitors: '1204'
  }
};

const initialAdminProfile = {
  name: 'Admin Utama',
  email: 'admin@benjor.desa.id'
};

const initialWisata: Wisata[] = [
  { id: '1', title: 'Wisata Siling Kanu - Air Terjun Utama', image: '/tamang_files/000eb415acb85e5560517e3dc2775072.jpg', desc: 'Pesona air terjun tersembunyi dengan alam yang asri.', comments: [] },
  { id: '2', title: 'Wisata Bukit Bongku - Spot Foto Awan', image: '/tamang_files/f26e073b8124a077d194a810e3f2f3a1.jpg', desc: 'Keindahan pemandangan dari puncak bukit di pagi hari.', comments: [] }
];

// Dynamic helper to resolve localhost vs production base endpoint
const getApiUrl = (path: string) => {
  const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';
  return `${API_BASE}${path}`;
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>(initialSliderImages);
  const [sotk, setSotk] = useState<SOTK[]>(initialSOTK);
  const [umkm, setUmkm] = useState<UMKM[]>(initialUMKM);
  const [berita, setBerita] = useState<Berita[]>(initialBerita);
  const [infografis, setInfografis] = useState<InfografisData>(initialInfografis);
  const [villageInfo, setVillageInfo] = useState<VillageInfo>(initialVillageInfo);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(initialAdminProfile);
  const [wisata, setWisata] = useState<Wisata[]>(initialWisata);

  const fetchWisata = async () => {
    try {
      const res = await fetch(getApiUrl('/api/wisata'));
      if (res.ok) setWisata(await res.json());
    } catch (e) {
      console.warn('Gagal mengambil data wisata dari backend', e);
    }
  };

  // 1. Fetch data from backend on mount, falling back gracefully to initial static mock data
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const infoRes = await fetch(getApiUrl('/api/village-info'));
        if (infoRes.ok) setVillageInfo(await infoRes.json());
        
        const sliderRes = await fetch(getApiUrl('/api/slider'));
        if (sliderRes.ok) setSliderImages(await sliderRes.json());

        const beritaRes = await fetch(getApiUrl('/api/berita'));
        if (beritaRes.ok) setBerita(await beritaRes.json());

        const umkmRes = await fetch(getApiUrl('/api/umkm'));
        if (umkmRes.ok) setUmkm(await umkmRes.json());

        const sotkRes = await fetch(getApiUrl('/api/sotk'));
        if (sotkRes.ok) setSotk(await sotkRes.json());

        const infoGRes = await fetch(getApiUrl('/api/infografis'));
        if (infoGRes.ok) setInfografis(await infoGRes.json());

        await fetchWisata();
      } catch (err) {
        console.warn('Backend API is offline or not set up. Falling back to local static mock data.', err);
      }
    };
    fetchBackendData();
  }, []);

  // 2. Custom sync helper for backend APIs
  const syncWithBackend = async (url: string, method: string, body: any) => {
    const token = localStorage.getItem('admin_token');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!res.ok) {
        let errMsg = '';
        try {
          const errData = await res.json();
          errMsg = errData.message || res.statusText || 'Gagal menyimpan perubahan';
        } catch {
          const textData = await res.text().catch(() => '');
          errMsg = textData.substring(0, 200) || res.statusText || 'Gagal menyimpan perubahan';
        }
        console.error(`Sync failed for ${url}:`, errMsg);
        // Only show blocking alert for critical failures (auth errors, server crash)
        // For Supabase DB errors, data is already saved locally so just log
        if (res.status === 401) {
          alert('Sesi login Anda telah berakhir. Silakan login ulang.');
        } else if (res.status >= 500) {
          alert(`Peringatan: ${errMsg}`);
        }
      }
      return res.ok;
    } catch (e) {
      console.error(`Error syncing with ${url}:`, e);
      return false;
    }
  };

  // 3. Custom wrappers for state updates to execute automatic delta sync with backend APIs
  const handleSetBerita = async (value: React.SetStateAction<Berita[]>) => {
    setBerita((prev) => {
      const nextList = typeof value === 'function' ? (value as Function)(prev) : value;
      (async () => {
        // Deletions
        const deleted = prev.filter(p => !nextList.some(n => n.id === p.id));
        for (const item of deleted) {
          await syncWithBackend(getApiUrl(`/api/berita/${item.id}`), 'DELETE', null);
        }
        // Additions
        const added = nextList.filter(n => !prev.some(p => p.id === n.id));
        for (const item of added) {
          await syncWithBackend(getApiUrl('/api/berita'), 'POST', item);
        }
        // Updates
        const updated = nextList.filter(n => {
          const old = prev.find(p => p.id === n.id);
          return old && JSON.stringify(old) !== JSON.stringify(n);
        });
        for (const item of updated) {
          await syncWithBackend(getApiUrl(`/api/berita/${item.id}`), 'PUT', item);
        }
      })();
      return nextList;
    });
  };

  const handleSetUmkm = async (value: React.SetStateAction<UMKM[]>) => {
    setUmkm((prev) => {
      const nextList = typeof value === 'function' ? (value as Function)(prev) : value;
      (async () => {
        // Deletions
        const deleted = prev.filter(p => !nextList.some(n => n.id === p.id));
        for (const item of deleted) {
          await syncWithBackend(getApiUrl(`/api/umkm/${item.id}`), 'DELETE', null);
        }
        // Additions
        const added = nextList.filter(n => !prev.some(p => p.id === n.id));
        for (const item of added) {
          await syncWithBackend(getApiUrl('/api/umkm'), 'POST', item);
        }
        // Updates
        const updated = nextList.filter(n => {
          const old = prev.find(p => p.id === n.id);
          return old && JSON.stringify(old) !== JSON.stringify(n);
        });
        for (const item of updated) {
          await syncWithBackend(getApiUrl(`/api/umkm/${item.id}`), 'PUT', item);
        }
      })();
      return nextList;
    });
  };

  const handleSetSotk = async (value: React.SetStateAction<SOTK[]>) => {
    setSotk((prev) => {
      const nextList = typeof value === 'function' ? (value as Function)(prev) : value;
      (async () => {
        // Deletions
        const deleted = prev.filter(p => !nextList.some(n => n.id === p.id));
        for (const item of deleted) {
          await syncWithBackend(getApiUrl(`/api/sotk/${item.id}`), 'DELETE', null);
        }
        // Additions
        const added = nextList.filter(n => !prev.some(p => p.id === n.id));
        for (const item of added) {
          await syncWithBackend(getApiUrl('/api/sotk'), 'POST', item);
        }
        // Updates
        const updated = nextList.filter(n => {
          const old = prev.find(p => p.id === n.id);
          return old && JSON.stringify(old) !== JSON.stringify(n);
        });
        for (const item of updated) {
          await syncWithBackend(getApiUrl(`/api/sotk/${item.id}`), 'PUT', item);
        }
      })();
      return nextList;
    });
  };

  const handleSetSliderImages = async (value: React.SetStateAction<SliderImage[]>) => {
    setSliderImages((prev) => {
      const nextList = typeof value === 'function' ? (value as Function)(prev) : value;
      (async () => {
        // Deletions
        const deleted = prev.filter(p => !nextList.some(n => n.id === p.id));
        for (const item of deleted) {
          await syncWithBackend(getApiUrl(`/api/slider/${item.id}`), 'DELETE', null);
        }
        // Additions
        const added = nextList.filter(n => !prev.some(p => p.id === n.id));
        for (const item of added) {
          await syncWithBackend(getApiUrl('/api/slider'), 'POST', item);
        }
      })();
      return nextList;
    });
  };

  const handleSetVillageInfo = async (value: React.SetStateAction<VillageInfo>) => {
    setVillageInfo((prev) => {
      const nextVal = typeof value === 'function' ? (value as Function)(prev) : value;
      syncWithBackend(getApiUrl('/api/village-info'), 'PUT', nextVal);
      return nextVal;
    });
  };

  const handleSetInfografis = async (value: React.SetStateAction<InfografisData>) => {
    setInfografis((prev) => {
      const nextVal = typeof value === 'function' ? (value as Function)(prev) : value;
      syncWithBackend(getApiUrl('/api/infografis'), 'PUT', nextVal);
      return nextVal;
    });
  };

  const handleSetWisata = async (value: React.SetStateAction<Wisata[]>) => {
    setWisata((prev) => {
      const nextList = typeof value === 'function' ? (value as Function)(prev) : value;
      (async () => {
        // Deletions
        const deleted = prev.filter(p => !nextList.some(n => n.id === p.id));
        for (const item of deleted) {
          await syncWithBackend(getApiUrl(`/api/wisata/${item.id}`), 'DELETE', null);
        }
        // Additions
        const added = nextList.filter(n => !prev.some(p => p.id === n.id));
        for (const item of added) {
          await syncWithBackend(getApiUrl('/api/wisata'), 'POST', item);
        }
        // Updates
        const updated = nextList.filter(n => {
          const old = prev.find(p => p.id === n.id);
          return old && JSON.stringify(old) !== JSON.stringify(n);
        });
        for (const item of updated) {
          await syncWithBackend(getApiUrl(`/api/wisata/${item.id}`), 'PUT', item);
        }
      })();
      return nextList;
    });
  };

  return (
    <AppContext.Provider value={{
      sliderImages, sotk, umkm, berita, infografis, villageInfo, adminProfile, wisata,
      fetchWisata,
      setSliderImages: handleSetSliderImages,
      setSotk: handleSetSotk,
      setUmkm: handleSetUmkm,
      setBerita: handleSetBerita,
      setInfografis: handleSetInfografis,
      setVillageInfo: handleSetVillageInfo,
      setAdminProfile,
      setWisata: handleSetWisata
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
