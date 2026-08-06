import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save } from 'lucide-react';

const KelolaPengaturan = () => {
  const { villageInfo, setVillageInfo, adminProfile, setAdminProfile } = useAppContext();
  
  const [formData, setFormData] = useState({
    adminName: adminProfile.name,
    adminEmail: adminProfile.email,
    history: villageInfo.history,
    vision: villageInfo.vision,
    mission: villageInfo.mission,
    geography: villageInfo.geography,
    mapEmbedUrl: villageInfo.mapEmbedUrl,
    contactAddress: villageInfo.contact.address,
    contactEmail: villageInfo.contact.email,
    contactPhone: villageInfo.contact.phone,
    facebook: villageInfo.socialMedia.facebook,
    instagram: villageInfo.socialMedia.instagram,
    youtube: villageInfo.socialMedia.youtube,
    statsArea: villageInfo.stats.area,
    statsRt: villageInfo.stats.rt,
    statsRw: villageInfo.stats.rw,
  });

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
          <h2 className="text-xl font-bold text-gray-800">Pengaturan Informasi Desa</h2>
          <p className="text-sm text-gray-500">Update profil umum dan identitas Desa Benjor.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        
        {/* Profil Admin Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Profil Admin</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Admin</label>
              <input 
                type="text" 
                value={formData.adminName} 
                onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Admin</label>
              <input 
                type="email" 
                value={formData.adminEmail} 
                onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
                required
              />
            </div>
          </div>
        </div>

        {/* Profil Desa Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Profil & Informasi Desa</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visi Desa</label>
            <textarea 
              value={formData.vision} 
              onChange={(e) => setFormData({...formData, vision: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-20" 
              required
            ></textarea>
          </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Misi Desa</label>
          <textarea 
            value={formData.mission} 
            onChange={(e) => setFormData({...formData, mission: e.target.value})}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-32" 
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sejarah Desa Lengkap</label>
          <textarea 
            value={formData.history} 
            onChange={(e) => setFormData({...formData, history: e.target.value})}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-48" 
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Geografi dan Batas Wilayah</label>
          <textarea 
            value={formData.geography} 
            onChange={(e) => setFormData({...formData, geography: e.target.value})}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-32" 
            required
          ></textarea>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Kantor</label>
            <input 
              type="text" 
              value={formData.contactAddress} 
              onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
            <input 
              type="text" 
              value={formData.mapEmbedUrl} 
              onChange={(e) => setFormData({...formData, mapEmbedUrl: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={formData.contactEmail} 
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
            <input 
              type="text" 
              value={formData.contactPhone} 
              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Luas Wilayah</label>
            <input 
              type="text" 
              value={formData.statsArea} 
              onChange={(e) => setFormData({...formData, statsArea: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah RT</label>
            <input 
              type="text" 
              value={formData.statsRt} 
              onChange={(e) => setFormData({...formData, statsRt: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah RW</label>
            <input 
              type="text" 
              value={formData.statsRw} 
              onChange={(e) => setFormData({...formData, statsRw: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              required
            />
          </div>
        </div>
        </div>

        <div className="pt-4 border-t">
          <button 
            type="submit"
            className="bg-[#2D5A27] hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <Save size={18} /> Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
};

export default KelolaPengaturan;
