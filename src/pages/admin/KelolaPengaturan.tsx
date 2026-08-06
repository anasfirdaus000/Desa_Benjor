import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save } from 'lucide-react';

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
    statsArea: villageInfo.stats?.area || '',
    statsRt: villageInfo.stats?.rt || '',
    statsRw: villageInfo.stats?.rw || '',
  });

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
        statsArea: villageInfo.stats?.area || '',
        statsRt: villageInfo.stats?.rt || '',
        statsRw: villageInfo.stats?.rw || '',
      });
    }
  }, [villageInfo, adminProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVillageInfo({
      ...villageInfo,
      history: formData.history,
      vision: formData.vision,
      mission: formData.mission,
      geography: formData.geography,
      mapEmbedUrl: formData.mapEmbedUrl,
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
        area: formData.statsArea,
        rt: formData.statsRt,
        rw: formData.statsRw
      }
    });
    setAdminProfile({
      name: formData.adminName,
      email: formData.adminEmail
    });
    alert('Pengaturan berhasil diperbarui!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pengaturan Umum Website</h2>
          <p className="text-sm text-gray-500">Update visi, misi, profil sejarah, kontak, dan tautan sosial media desa.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        
        {/* Administrator Profile */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-[#2D5A27] pl-3">Profil Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Administrator</label>
              <input 
                type="text" 
                value={formData.adminName} 
                onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Administrator</label>
              <input 
                type="email" 
                value={formData.adminEmail} 
                onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                required
              />
            </div>
          </div>
        </div>

        {/* Visi Misi & Sejarah */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-[#2D5A27] pl-3">Tentang Desa</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visi Desa</label>
              <textarea 
                value={formData.vision} 
                onChange={(e) => setFormData({...formData, vision: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-20 text-gray-800"
                placeholder="Visi desa..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Misi Desa</label>
              <textarea 
                value={formData.mission} 
                onChange={(e) => setFormData({...formData, mission: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-24 text-gray-800"
                placeholder="Tuliskan misi desa (gunakan baris baru untuk setiap poin)..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sejarah Singkat Desa</label>
              <textarea 
                value={formData.history} 
                onChange={(e) => setFormData({...formData, history: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-32 text-gray-800"
                placeholder="Sejarah singkat berdirinya desa..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Geografi Wilayah</label>
              <textarea 
                value={formData.geography} 
                onChange={(e) => setFormData({...formData, geography: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-24 text-gray-800"
                placeholder="Letak geografis dan batas wilayah..."
                required
              />
            </div>
          </div>
        </div>

        {/* Kontak & Media Sosial */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-[#2D5A27] pl-3">Kontak & Media Sosial</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Kantor Desa</label>
              <input 
                type="text" 
                value={formData.contactAddress} 
                onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Desa</label>
              <input 
                type="email" 
                value={formData.contactEmail} 
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telepon Desa</label>
              <input 
                type="text" 
                value={formData.contactPhone} 
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tautan Facebook</label>
              <input 
                type="text" 
                value={formData.facebook} 
                onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tautan Instagram</label>
              <input 
                type="text" 
                value={formData.instagram} 
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tautan Youtube</label>
              <input 
                type="text" 
                value={formData.youtube} 
                onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Peta & Statistik Fisik */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-[#2D5A27] pl-3">Geografis & Peta</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Maps Embed Frame</label>
              <input 
                type="text" 
                value={formData.mapEmbedUrl} 
                onChange={(e) => setFormData({...formData, mapEmbedUrl: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800 text-xs"
                placeholder="https://google.com/maps/embed?pb=..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Luas Wilayah</label>
              <input 
                type="text" 
                value={formData.statsArea} 
                onChange={(e) => setFormData({...formData, statsArea: e.target.value})}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                required
              />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah RT</label>
                  <input 
                    type="text" 
                    value={formData.statsRt} 
                    onChange={(e) => setFormData({...formData, statsRt: e.target.value})}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah RW</label>
                  <input 
                    type="text" 
                    value={formData.statsRw} 
                    onChange={(e) => setFormData({...formData, statsRw: e.target.value})}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-gray-800"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end">
          <button 
            type="submit"
            className="bg-[#2D5A27] hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium cursor-pointer"
          >
            <Save size={18} /> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default KelolaPengaturan;
