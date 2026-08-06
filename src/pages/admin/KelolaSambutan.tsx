import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save, Image as ImageIcon } from 'lucide-react';

const KelolaSambutan = () => {
  const { villageInfo, setVillageInfo } = useAppContext();
  
  const [formData, setFormData] = useState({
    headName: villageInfo.headName || '',
    headImage: villageInfo.headImage || '',
    welcomeMessage: villageInfo.welcomeMessage || '',
  });

  // Keep state in sync with context when it fetches asynchronously
  useEffect(() => {
    if (villageInfo) {
      setFormData({
        headName: villageInfo.headName || '',
        headImage: villageInfo.headImage || '',
        welcomeMessage: villageInfo.welcomeMessage || '',
      });
    }
  }, [villageInfo]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVillageInfo({
      ...villageInfo,
      headName: formData.headName,
      headImage: formData.headImage,
      welcomeMessage: formData.welcomeMessage,
    });
    alert('Sambutan Kepala Desa berhasil diperbarui!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Kelola Sambutan Kepala Desa</h2>
          <p className="text-sm text-gray-500">Update foto, nama, gelar, dan teks kutipan sambutan.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Foto Preview & Upload */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-gray-100 mb-4 bg-gray-50 flex items-center justify-center">
              {formData.headImage ? (
                <img 
                  src={formData.headImage} 
                  alt={formData.headName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={48} className="text-gray-300" />
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center">URL Foto Kepala Desa</label>
              <input 
                type="text" 
                value={formData.headImage} 
                onChange={(e) => setFormData({...formData, headImage: e.target.value})}
                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white text-center" 
                placeholder="https://example.com/foto.jpg"
                required
              />
              <p className="text-xs text-gray-500 text-center mt-2">Masukkan URL gambar (format persegi/avatar disarankan).</p>
            </div>
          </div>

          {/* Text Inputs */}
          <div className="w-full md:w-2/3 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama & Gelar Kepala Desa</label>
              <input 
                type="text" 
                value={formData.headName} 
                onChange={(e) => setFormData({...formData, headName: e.target.value.toUpperCase()})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white uppercase" 
                placeholder="Contoh: IMAM MUNIR, SH"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teks Kutipan Sambutan</label>
              <textarea 
                value={formData.welcomeMessage} 
                onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white h-32" 
                placeholder="Tuliskan kutipan sambutan Kepala Desa..."
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
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

export default KelolaSambutan;
