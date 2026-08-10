import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Trash2, Upload, Image as ImageIcon, Check } from 'lucide-react';

const KelolaMedia = () => {
  const { sliderImages, setSliderImages } = useAppContext();
  const { previewUrl, handleImageChange, clearImage, isUploading } = useImageUpload();
  
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');

  const handleAddSlider = () => {
    if (!previewUrl || isUploading) return;
    const newImage = {
      id: Date.now().toString(),
      url: previewUrl,
      title: newTitle.trim() || undefined,
      subtitle: newSubtitle.trim() || undefined
    };
    setSliderImages([...sliderImages, newImage]);
    setNewTitle('');
    setNewSubtitle('');
    clearImage();
    // Reset file input
    const fileInput = document.getElementById('slider-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus gambar ini dari slider?')) {
      setSliderImages(sliderImages.filter(img => img.id !== id));
    }
  };

  const handleUpdateText = (id: string, field: 'title' | 'subtitle', val: string) => {
    setSliderImages(sliderImages.map(img => img.id === id ? { ...img, [field]: val } : img));
  };

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-250">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Kelola Media & Slider Hero</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tambahkan gambar banner slider halaman utama dan atur judul/subjudul per slide.</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Upload Section */}
          <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-4 self-start">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 border-b dark:border-gray-800 pb-2">
              <Upload size={18} className="text-[#2D5A27]" /> Upload Slider Baru
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-450 mb-1">Pilih File Gambar</label>
              <input 
                type="file" 
                id="slider-upload"
                accept="image/*" 
                onChange={handleImageChange} 
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
              />
            </div>
            
            {previewUrl && (
              <div className="relative">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">Pratinjau Gambar:</p>
                <div className="relative h-40 rounded-lg overflow-hidden border dark:border-gray-800">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-xs text-white font-bold">
                      Mengunggah ke Cloudinary...
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-650 dark:text-gray-400 mb-1">Judul Slide (Opsional)</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Selamat Datang di Benjor"
                className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white text-xs rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-655 dark:text-gray-400 mb-1">Subjudul Slide (Opsional)</label>
              <textarea 
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="Deskripsi singkat untuk slide ini..."
                className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white text-xs rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none h-16 resize-none"
              />
            </div>
            
            <button 
              onClick={handleAddSlider}
              disabled={!previewUrl || isUploading}
              className={`w-full py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                previewUrl && !isUploading ? 'bg-[#2D5A27] text-white hover:bg-green-700' : 'bg-gray-200 dark:bg-gray-800 text-gray-450 dark:text-gray-500'
              }`}
            >
              {isUploading ? 'Mengunggah...' : 'Tambahkan ke Slider'}
            </button>
          </div>

          {/* List Section */}
          <div className="w-full lg:w-2/3">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2 border-b dark:border-gray-800 pb-2">
              <ImageIcon size={18} className="text-[#2D5A27]" /> Gambar Slider Aktif ({sliderImages.length})
            </h3>
            
            {sliderImages.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-855 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">Belum ada gambar slider.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sliderImages.map((img, index) => (
                  <div key={img.id} className="bg-white dark:bg-gray-850 rounded-xl overflow-hidden border border-gray-150 dark:border-gray-800 shadow-sm flex flex-col">
                    {/* Image Area with delete button on hover */}
                    <div className="relative group h-40">
                      <img src={img.url} alt={`Slider ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => handleDelete(img.id)}
                          className="bg-red-650 hover:bg-red-750 text-white p-2 rounded-full transform hover:scale-110 transition-all cursor-pointer shadow-md"
                          title="Hapus gambar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                        Slide {index + 1}
                      </span>
                    </div>
                    {/* Text Inputs */}
                    <div className="p-3 space-y-2 flex-grow bg-gray-50/50 dark:bg-gray-900/40 border-t dark:border-gray-800">
                      <div>
                        <input 
                          type="text" 
                          value={img.title || ''}
                          onChange={(e) => handleUpdateText(img.id, 'title', e.target.value)}
                          placeholder="Judul khusus slide ini..."
                          className="w-full px-2 py-1 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white text-xs rounded-md focus:ring-1 focus:ring-[#2D5A27] outline-none font-bold"
                        />
                      </div>
                      <div>
                        <textarea 
                          value={img.subtitle || ''}
                          onChange={(e) => handleUpdateText(img.id, 'subtitle', e.target.value)}
                          placeholder="Subjudul khusus slide ini..."
                          className="w-full px-2 py-1 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white text-[11px] rounded-md focus:ring-1 focus:ring-[#2D5A27] outline-none h-12 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaMedia;
