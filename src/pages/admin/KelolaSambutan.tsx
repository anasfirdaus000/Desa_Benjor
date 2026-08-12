import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Save, Image as ImageIcon } from 'lucide-react';

const KelolaSambutan = () => {
  const { villageInfo, setVillageInfo } = useAppContext();
  const { previewUrl, handleImageChange, isUploading, setPreviewUrl } = useImageUpload();
  
  const [formData, setFormData] = useState({
    headName: villageInfo.headName || '',
    headImage: villageInfo.headImage || '',
    welcomeMessage: villageInfo.welcomeMessage || '',
    headAlign: villageInfo.headAlign || 'center',
  });

  // Keep state in sync with context when loaded asynchronously
  useEffect(() => {
    if (villageInfo) {
      setFormData({
        headName: villageInfo.headName || '',
        headImage: villageInfo.headImage || '',
        welcomeMessage: villageInfo.welcomeMessage || '',
        headAlign: villageInfo.headAlign || 'center',
      });
      if (villageInfo.headImage) {
        setPreviewUrl(villageInfo.headImage);
      }
    }
  }, [villageInfo, setPreviewUrl]);

  // Keep headImage form field in sync with image upload output URL
  useEffect(() => {
    if (previewUrl) {
      setFormData(prev => ({ ...prev, headImage: previewUrl }));
    }
  }, [previewUrl]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      alert('Gambar sedang diunggah ke server Cloudinary. Mohon tunggu...');
      return;
    }

    setVillageInfo({
      ...villageInfo,
      headName: formData.headName,
      headImage: formData.headImage,
      welcomeMessage: formData.welcomeMessage,
      headAlign: formData.headAlign,
    });
    alert('Sambutan Kepala Desa berhasil diperbarui!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-gray-800 dark:text-gray-250">
      <div className="flex justify-between items-center mb-8 border-b dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Kelola Sambutan Kepala Desa</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update foto, nama, gelar, dan teks kutipan sambutan.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Foto Preview & Upload */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-gray-100 dark:border-gray-800 mb-4 bg-gray-55 dark:bg-gray-800 flex items-center justify-center relative">
              {formData.headImage ? (
                <img 
                  src={formData.headImage} 
                  alt={formData.headName} 
                  className={`w-full h-full object-cover ${
                    formData.headAlign === 'top' ? 'object-top' :
                    formData.headAlign === 'bottom' ? 'object-bottom' : 'object-center'
                  }`}
                />
              ) : (
                <ImageIcon size={48} className="text-gray-300 dark:text-gray-650" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs text-white font-bold">
                  Uploading...
                </div>
              )}
            </div>
            
            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-303 mb-2 text-center">Upload Foto Perangkat (Cloudinary)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-303 mb-1 text-center">Atau Masukkan URL Foto</label>
                <input 
                  type="text" 
                  value={formData.headImage} 
                  onChange={(e) => setFormData({...formData, headImage: e.target.value})}
                  className="w-full p-2 text-sm border dark:border-gray-755 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-850 dark:text-white text-center" 
                  placeholder="https://example.com/foto.jpg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Text Inputs */}
          <div className="w-full md:w-2/3 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-303 mb-1">Nama & Gelar Kepala Desa</label>
              <input 
                type="text" 
                value={formData.headName} 
                onChange={(e) => setFormData({...formData, headName: e.target.value.toUpperCase()})}
                className="w-full p-2 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-850 dark:text-white uppercase font-semibold" 
                placeholder="Contoh: IMAM MUNIR, SH"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-303 mb-1 font-semibold">Focal Point Foto (Fokus Foto Kades)</label>
              <select 
                value={formData.headAlign} 
                onChange={(e) => setFormData({...formData, headAlign: e.target.value})}
                className="w-full p-2 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-850 dark:text-white"
              >
                <option value="top">Atas (Top) - Bagus untuk pas foto kepala</option>
                <option value="center">Tengah (Center)</option>
                <option value="bottom">Bawah (Bottom)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-303 mb-1">Teks Kutipan Sambutan</label>
              <textarea 
                value={formData.welcomeMessage} 
                onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})}
                className="w-full p-2 border dark:border-gray-750 rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white dark:bg-gray-855 dark:text-white h-32" 
                placeholder="Tuliskan kutipan sambutan Kepala Desa..."
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t dark:border-gray-800 flex justify-end">
          <button 
            type="submit"
            disabled={isUploading}
            className={`bg-[#2D5A27] hover:bg-green-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save size={18} /> {isUploading ? 'Mengunggah...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KelolaSambutan;
