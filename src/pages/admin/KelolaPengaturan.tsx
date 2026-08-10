import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save, Upload, Image as ImageIcon, Globe, RefreshCw } from 'lucide-react';

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVillageInfo({
      ...villageInfo,
      history: formData.history,
      vision: formData.vision,
      mission: formData.mission,
      geography: formData.geography,
      mapEmbedUrl: formData.mapEmbedUrl,
      heroTitle: formData.heroTitle,
      heroSubtitle: formData.heroSubtitle,
      footerDescription: formData.footerDescription,
      logoUrl: formData.logoUrl,
      faviconUrl: formData.faviconUrl,
      statsBg: formData.statsBg,
      wisataBg: formData.wisataBg,
      contact: {
        address: formData.contactAddress,
        email: formData.contactEmail,
        phone: formData.contactPhone
      },
      socialMedia: {
        facebook: formData.facebook,
        instagram: formData.instagram,
        youtube: formData.youtube
      },
      stats: {
        area: villageInfo.stats?.area || '450 Ha',
        rt: villageInfo.stats?.rt || '15',
        rw: villageInfo.stats?.rw || '4',
        kk: formData.statsKk,
        sementara: formData.statsSementara,
        mutasi: formData.statsMutasi,
        visitors: formData.statsVisitors,
      }
    });
    setAdminProfile({
      name: formData.adminName,
      email: formData.adminEmail
    });
    alert('Pengaturan berhasil diperbarui!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8 border-b dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pengaturan Umum Website</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update logo, favicon, visi, misi, latar belakang, kontak, dan tautan sosial media desa.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        
        {/* Visual & Media (Logo, Favicon, Backgrounds) */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3 flex items-center gap-2">
            <Globe size={18} /> Media & Tampilan Visual Website
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-850 p-5 rounded-2xl border dark:border-gray-800">
            {/* Logo Website */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Logo Website (.png / .jpg)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center relative shadow-sm">
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
                    className="block w-full text-xs text-gray-505 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Digunakan pada Navbar, Animasi Intro, dan Footer.</p>
                </div>
              </div>
            </div>

            {/* Favicon Website */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Favicon Browser (.ico / .png)</label>
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
                    className="block w-full text-xs text-gray-550 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Ikon tab browser web.</p>
                </div>
              </div>
            </div>

            {/* Background Statistik Kependudukan */}
            <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t dark:border-gray-800">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-350">Latar Belakang (Background) Section 'Statistik Kependudukan'</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-40 h-24 rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-800 relative shadow-inner">
                  {formData.statsBg ? (
                    <img src={formData.statsBg} alt="Stats Background" className="w-full h-full object-cover" />
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
                    className="block w-full text-xs text-gray-550 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Disarankan gambar beresolusi tinggi (min. 1920x1080 px). Gambar akan ditimpa efek overlay transparan demi kontras tulisan.</p>
                </div>
              </div>
            </div>

            {/* Background Pesona Wisata */}
            <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t dark:border-gray-800">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-350">Latar Belakang (Background) Section 'Pesona Wisata'</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-40 h-24 rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-800 relative shadow-inner">
                  {formData.wisataBg ? (
                    <img src={formData.wisataBg} alt="Wisata Background" className="w-full h-full object-cover" />
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
                    className="block w-full text-xs text-gray-550 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Disarankan gambar beresolusi tinggi (min. 1920x1080 px).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Administrator Profile */}
        <div className="pt-6 border-t dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3">Profil Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Nama Administrator</label>
              <input 
                type="text" 
                value={formData.adminName} 
                onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Email Administrator</label>
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

        {/* Hero Section & Footer */}
        <div className="pt-6 border-t dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3">Hero Section & Footer</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Judul Hero Utama (Default - Muncul jika slide tidak memiliki judul)</label>
              <input 
                type="text" 
                value={formData.heroTitle} 
                onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-850 dark:text-white font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Subjudul Hero Utama (Default - Muncul jika slide tidak memiliki subjudul)</label>
              <textarea 
                value={formData.heroSubtitle} 
                onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white h-20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Deskripsi Ringkas Footer</label>
              <textarea 
                value={formData.footerDescription} 
                onChange={(e) => setFormData({...formData, footerDescription: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white h-20"
                required
              />
            </div>
          </div>
        </div>

        {/* Tentang Desa */}
        <div className="pt-6 border-t dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3">Tentang Desa</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Visi Desa</label>
              <textarea 
                value={formData.vision} 
                onChange={(e) => setFormData({...formData, vision: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-20"
                placeholder="Visi desa..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Misi Desa</label>
              <textarea 
                value={formData.mission} 
                onChange={(e) => setFormData({...formData, mission: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-24"
                placeholder="Tuliskan misi desa (gunakan baris baru untuk setiap poin)..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Sejarah Singkat Desa</label>
              <textarea 
                value={formData.history} 
                onChange={(e) => setFormData({...formData, history: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-32"
                placeholder="Sejarah singkat berdirinya desa..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Geografi Wilayah</label>
              <textarea 
                value={formData.geography} 
                onChange={(e) => setFormData({...formData, geography: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-24"
                placeholder="Letak geografis dan batas wilayah..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Link Google Maps (Iframe Src)</label>
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

        {/* Kontak & Sosial Media */}
        <div className="pt-6 border-t dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3">Kontak & Sosial Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Alamat Kantor Desa</label>
              <input 
                type="text" 
                value={formData.contactAddress} 
                onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Email Kontak</label>
              <input 
                type="email" 
                value={formData.contactEmail} 
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Telepon/WhatsApp</label>
              <input 
                type="text" 
                value={formData.contactPhone} 
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Link Facebook</label>
              <input 
                type="text" 
                value={formData.facebook} 
                onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Link Instagram</label>
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

        {/* Statistik Kependudukan */}
        <div className="pt-6 border-t dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4 border-l-4 border-[#2D5A27] pl-3">Statistik Kependudukan (Angka)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Jumlah Kepala Keluarga</label>
              <input 
                type="text" 
                value={formData.statsKk} 
                onChange={(e) => setFormData({...formData, statsKk: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Jumlah Penduduk Sementara</label>
              <input 
                type="text" 
                value={formData.statsSementara} 
                onChange={(e) => setFormData({...formData, statsSementara: e.target.value})}
                className="w-full p-2.5 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-800 text-gray-855 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Jumlah Mutasi Penduduk</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-350">Pengunjung Website (Realtime)</label>
                <span className="text-[10px] bg-green-100 dark:bg-green-950 text-[#2D5A27] dark:text-green-400 font-bold px-2 py-0.5 rounded-full border border-green-200/50">Otomatis</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={formData.statsVisitors} 
                  className="flex-grow p-2.5 border dark:border-gray-750 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
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

        <div className="pt-6 border-t dark:border-gray-800 flex justify-end">
          <button 
            type="submit"
            className="bg-[#2D5A27] hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-semibold cursor-pointer shadow-md"
          >
            <Save size={18} /> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default KelolaPengaturan;
