import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save, Upload, Image as ImageIcon, Globe, RefreshCw, Phone, Landmark } from 'lucide-react';

const KelolaPengaturan = () => {
  const { villageInfo, setVillageInfo, adminProfile, setAdminProfile } = useAppContext();
  
  const [formData, setFormData] = useState({
    adminName: adminProfile.name || '',
    adminEmail: adminProfile.email || '',
    history: villageInfo.history || '',
    vision: villageInfo.vision || '',
    mission: villageInfo.mission || '',
    geography: villageInfo.geography || '',
    mapEmbedUrl: villageInfo.mapEmbedUrl || '',
    contactAddress: villageInfo.contact?.address || '',
    contactEmail: villageInfo.contact?.email || '',
    contactPhone: villageInfo.contact?.phone || '',
    facebook: villageInfo.socialMedia?.facebook || '',
    instagram: villageInfo.socialMedia?.instagram || '',
    youtube: villageInfo.socialMedia?.youtube || '',
    heroTitle: villageInfo.heroTitle || '',
    heroSubtitle: villageInfo.heroSubtitle || '',
    footerDescription: villageInfo.footerDescription || '',
    statsKk: villageInfo.stats?.kk || '',
    statsSementara: villageInfo.stats?.sementara || '',
    statsMutasi: villageInfo.stats?.mutasi || '',
    statsVisitors: villageInfo.stats?.visitors || '',
    logoUrl: villageInfo.logoUrl || '',
    faviconUrl: villageInfo.faviconUrl || '',
    statsBg: villageInfo.statsBg || '',
    wisataBg: villageInfo.wisataBg || '',
  });

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Keep state in sync with context when loaded asynchronously
  useEffect(() => {
    if (villageInfo && adminProfile) {
      setFormData({
        adminName: adminProfile.name || '',
        adminEmail: adminProfile.email || '',
        history: villageInfo.history || '',
        vision: villageInfo.vision || '',
        mission: villageInfo.mission || '',
        geography: villageInfo.geography || '',
        mapEmbedUrl: villageInfo.mapEmbedUrl || '',
        contactAddress: villageInfo.contact?.address || '',
        contactEmail: villageInfo.contact?.email || '',
        contactPhone: villageInfo.contact?.phone || '',
        facebook: villageInfo.socialMedia?.facebook || '',
        instagram: villageInfo.socialMedia?.instagram || '',
        youtube: villageInfo.socialMedia?.youtube || '',
        heroTitle: villageInfo.heroTitle || '',
        heroSubtitle: villageInfo.heroSubtitle || '',
        footerDescription: villageInfo.footerDescription || '',
        statsKk: villageInfo.stats?.kk || '',
        statsSementara: villageInfo.stats?.sementara || '',
        statsMutasi: villageInfo.stats?.mutasi || '',
        statsVisitors: villageInfo.stats?.visitors || '',
        logoUrl: villageInfo.logoUrl || '',
        faviconUrl: villageInfo.faviconUrl || '',
        statsBg: villageInfo.statsBg || '',
        wisataBg: villageInfo.wisataBg || '',
      });
    }
  }, [villageInfo, adminProfile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    const apiData = new FormData();
    apiData.append('file', file);

    const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: apiData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, [fieldName]: data.url }));
        console.log(`${fieldName} uploaded:`, data.url);
      } else {
        alert('Gagal mengunggah gambar.');
      }
    } catch (err) {
      alert('Gagal menghubungi server.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleResetVisitors = async () => {
    if (!window.confirm('Yakin ingin meriset jumlah pengunjung website ke 0?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/village-info/reset-visitors`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setFormData(prev => ({ ...prev, statsVisitors: '0' }));
        setVillageInfo(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            visitors: '0'
          }
        }));
        alert('Jumlah pengunjung berhasil di-reset ke 0!');
      } else {
        alert('Gagal meriset jumlah pengunjung.');
      }
    } catch (e) {
      alert('Gagal menyambungkan ke server.');
    }
  };

  const handleSaveSection = (e: React.FormEvent, section: string) => {
    e.preventDefault();
    
    let updatedInfo = { ...villageInfo };
    let updatedAdmin = { ...adminProfile };

    if (section === 'visual') {
      updatedInfo.logoUrl = formData.logoUrl;
      updatedInfo.faviconUrl = formData.faviconUrl;
      updatedInfo.statsBg = formData.statsBg;
      updatedInfo.wisataBg = formData.wisataBg;
    } else if (section === 'admin') {
      updatedAdmin.name = formData.adminName;
      updatedAdmin.email = formData.adminEmail;
      setAdminProfile(updatedAdmin);
    } else if (section === 'banner') {
      updatedInfo.heroTitle = formData.heroTitle;
      updatedInfo.heroSubtitle = formData.heroSubtitle;
      updatedInfo.footerDescription = formData.footerDescription;
    } else if (section === 'about') {
      updatedInfo.history = formData.history;
      updatedInfo.vision = formData.vision;
      updatedInfo.mission = formData.mission;
      updatedInfo.geography = formData.geography;
      updatedInfo.mapEmbedUrl = formData.mapEmbedUrl;
    } else if (section === 'contact') {
      updatedInfo.contact = {
        address: formData.contactAddress,
        email: formData.contactEmail,
        phone: formData.contactPhone
      };
      updatedInfo.socialMedia = {
        facebook: formData.facebook,
        instagram: formData.instagram,
        youtube: formData.youtube
      };
    } else if (section === 'stats') {
      updatedInfo.stats = {
        ...villageInfo.stats,
        kk: formData.statsKk,
        sementara: formData.statsSementara,
        mutasi: formData.statsMutasi,
        visitors: formData.statsVisitors,
      };
    }

    if (section !== 'admin') {
      setVillageInfo(updatedInfo);
    }
    
    alert('Perubahan untuk bagian ini berhasil disimpan!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8 border-b dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pengaturan Umum Website</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update logo, favicon, visi, misi, latar belakang, kontak, dan tautan sosial media secara terpisah.</p>
        </div>
      </div>

      <div className="space-y-12 max-w-4xl">
        
        {/* Section 1: Visual & Media */}
        <form onSubmit={(e) => handleSaveSection(e, 'visual')} className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3 flex items-center gap-2">
              <Globe size={18} /> Media & Tampilan Visual Website
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-850/50 p-5 rounded-2xl border dark:border-gray-800">
              
              {/* Logo Website */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-305">Logo Website (Bebas ukuran, adaptif)</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center relative shadow-sm">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-gray-400 font-bold text-lg">B</span>
                    )}
                    {uploadingField === 'logoUrl' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white">Uploading</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'logoUrl')} 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Logo akan otomatis menyesuaikan dengan ukuran aslinya di web.</p>
                  </div>
                </div>
              </div>

              {/* Favicon Website */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-305">Favicon Browser (.ico / .png)</label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded border bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center relative shadow-sm">
                    {formData.faviconUrl ? (
                      <img src={formData.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-gray-400 text-xs">Fav</span>
                    )}
                    {uploadingField === 'faviconUrl' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[8px] text-white">...</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'faviconUrl')} 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Ikon tab browser web.</p>
                  </div>
                </div>
              </div>

              {/* Background Statistik Kependudukan */}
              <div className="flex flex-col gap-2 md:col-span-2 pt-4 border-t dark:border-gray-800">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-305">Latar Belakang (Background) Section 'Statistik Kependudukan'</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-full sm:w-40 h-24 rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-800 relative shadow-inner">
                    {formData.statsBg ? (
                      <img src={formData.statsBg} alt="Stats Background" className="w-full h-full object-contain bg-gray-50 dark:bg-gray-900" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">Belum ada foto</div>
                    )}
                    {uploadingField === 'statsBg' && (
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-xs text-white font-bold">Mengunggah...</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'statsBg')} 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Disarankan gambar berkualitas tinggi. Ditampilkan utuh tanpa crop di semua layar.</p>
                  </div>
                </div>
              </div>

              {/* Background Pesona Wisata */}
              <div className="flex flex-col gap-2 md:col-span-2 pt-4 border-t dark:border-gray-800">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-305">Latar Belakang (Background) Section 'Pesona Wisata'</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-full sm:w-40 h-24 rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-800 relative shadow-inner">
                    {formData.wisataBg ? (
                      <img src={formData.wisataBg} alt="Wisata Background" className="w-full h-full object-contain bg-gray-50 dark:bg-gray-900" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">Belum ada foto</div>
                    )}
                    {uploadingField === 'wisataBg' && (
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-xs text-white font-bold">Mengunggah...</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'wisataBg')} 
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Latar belakang untuk section Pesona Wisata desa.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#2D5A27] hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
              <Save size={14} /> Simpan Tampilan & Media
            </button>
          </div>
        </form>

        {/* Section 2: Profil Administrator */}
        <form onSubmit={(e) => handleSaveSection(e, 'admin')} className="space-y-6 pt-8 border-t dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3">Profil Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-855/30 p-5 rounded-2xl border dark:border-gray-800">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Nama Administrator</label>
                <input 
                  type="text" 
                  value={formData.adminName} 
                  onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Email Administrator</label>
                <input 
                  type="email" 
                  value={formData.adminEmail} 
                  onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#2D5A27] hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
              <Save size={14} /> Simpan Profil Admin
            </button>
          </div>
        </form>

        {/* Section 3: Hero Section Banner & Footer */}
        <form onSubmit={(e) => handleSaveSection(e, 'banner')} className="space-y-6 pt-8 border-t dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3">Hero Section & Footer</h3>
            <div className="space-y-5 bg-gray-50 dark:bg-gray-855/30 p-5 rounded-2xl border dark:border-gray-800">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Judul Hero Utama (Default - jika slide tidak diatur judulnya)</label>
                <input 
                  type="text" 
                  value={formData.heroTitle} 
                  onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-850 dark:text-white font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Subjudul Hero Utama (Default - jika slide tidak diatur subjudulnya)</label>
                <textarea 
                  value={formData.heroSubtitle} 
                  onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white h-20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Deskripsi Ringkas Footer</label>
                <textarea 
                  value={formData.footerDescription} 
                  onChange={(e) => setFormData({...formData, footerDescription: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white h-20"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#2D5A27] hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
              <Save size={14} /> Simpan Banner & Footer
            </button>
          </div>
        </form>

        {/* Section 4: Tentang Desa (Visi, Misi, Sejarah, Geografi) */}
        <form onSubmit={(e) => handleSaveSection(e, 'about')} className="space-y-6 pt-8 border-t dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3">Tentang Desa (Profil Desa)</h3>
            <div className="space-y-5 bg-gray-50 dark:bg-gray-855/30 p-5 rounded-2xl border dark:border-gray-800">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Visi Desa</label>
                <textarea 
                  value={formData.vision} 
                  onChange={(e) => setFormData({...formData, vision: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-20"
                  placeholder="Visi desa..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Misi Desa (Gunakan baris baru untuk setiap misi)</label>
                <textarea 
                  value={formData.mission} 
                  onChange={(e) => setFormData({...formData, mission: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-24"
                  placeholder="Misi desa..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Sejarah Singkat Desa</label>
                <textarea 
                  value={formData.history} 
                  onChange={(e) => setFormData({...formData, history: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-32"
                  placeholder="Sejarah singkat..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Geografi Wilayah</label>
                <textarea 
                  value={formData.geography} 
                  onChange={(e) => setFormData({...formData, geography: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-24"
                  placeholder="Letak geografis..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Link Google Maps (Iframe Embed Src)</label>
                <input 
                  type="text" 
                  value={formData.mapEmbedUrl} 
                  onChange={(e) => setFormData({...formData, mapEmbedUrl: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#2D5A27] hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
              <Save size={14} /> Simpan Tentang Desa
            </button>
          </div>
        </form>

        {/* Section 5: Kontak & Sosial Media Desa */}
        <form onSubmit={(e) => handleSaveSection(e, 'contact')} className="space-y-6 pt-8 border-t dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3 flex items-center gap-2">
              <Phone size={18} /> Kontak & Sosial Media Desa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-855/30 p-5 rounded-2xl border dark:border-gray-800">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Alamat Kantor Desa</label>
                <input 
                  type="text" 
                  value={formData.contactAddress} 
                  onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Email Kontak</label>
                <input 
                  type="email" 
                  value={formData.contactEmail} 
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Telepon/WhatsApp</label>
                <input 
                  type="text" 
                  value={formData.contactPhone} 
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Link Facebook</label>
                <input 
                  type="text" 
                  value={formData.facebook} 
                  onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Link Instagram</label>
                <input 
                  type="text" 
                  value={formData.instagram} 
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Link Youtube Channel</label>
                <input 
                  type="text" 
                  value={formData.youtube} 
                  onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#2D5A27] hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
              <Save size={14} /> Simpan Kontak & Medsos
            </button>
          </div>
        </form>

        {/* Section 6: Statistik Kependudukan (Angka) */}
        <form onSubmit={(e) => handleSaveSection(e, 'stats')} className="space-y-6 pt-8 border-t dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3 flex items-center gap-2">
              <Landmark size={18} /> Statistik Kependudukan (Angka)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 dark:bg-gray-855/30 p-5 rounded-2xl border dark:border-gray-800">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Jumlah Kepala Keluarga</label>
                <input 
                  type="text" 
                  value={formData.statsKk} 
                  onChange={(e) => setFormData({...formData, statsKk: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Jumlah Penduduk Sementara</label>
                <input 
                  type="text" 
                  value={formData.statsSementara} 
                  onChange={(e) => setFormData({...formData, statsSementara: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Jumlah Mutasi Penduduk</label>
                <input 
                  type="text" 
                  value={formData.statsMutasi} 
                  onChange={(e) => setFormData({...formData, statsMutasi: e.target.value})}
                  className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-305">Pengunjung Website (Realtime)</label>
                  <span className="text-[10px] bg-green-100 dark:bg-green-955 text-[#2D5A27] dark:text-green-400 font-bold px-2 py-0.5 rounded-full border border-green-200/50">Otomatis</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.statsVisitors} 
                    className="flex-grow p-2.5 border dark:border-gray-750 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed text-sm"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={handleResetVisitors}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center cursor-pointer shadow-sm border border-red-700/10 animate-pulse"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#2D5A27] hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
              <Save size={14} /> Simpan Statistik
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default KelolaPengaturan;
