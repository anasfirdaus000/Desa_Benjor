import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react';

const KelolaMedia = () => {
  const { sliderImages, setSliderImages } = useAppContext();
  const { previewUrl, handleImageChange, clearImage, isUploading } = useImageUpload();

  const handleAddSlider = () => {
    if (!previewUrl || isUploading) return;
    const newImage = {
      id: Date.now().toString(),
      url: previewUrl
    };
    setSliderImages([...sliderImages, newImage]);
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

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-250">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Kelola Media & Slider</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tambahkan atau hapus gambar yang tampil di Banner halaman utama.</p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Upload Section */}
          <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Upload size={18} /> Upload Gambar Baru
            </h3>
            
            <input 
              type="file" 
              id="slider-upload"
              accept="image/*" 
              onChange={handleImageChange} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 mb-4 cursor-pointer"
            />
            
            {previewUrl && (
              <div className="mb-4 relative">
                <p className="text-xs text-gray-505 dark:text-gray-400 mb-2">Pratinjau:</p>
                <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-800" />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg text-xs text-white font-bold">
                    Mengunggah ke Cloudinary...
                  </div>
                )}
              </div>
            )}
            
            <button 
              onClick={handleAddSlider}
              disabled={!previewUrl || isUploading}
              className={`w-full py-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                previewUrl && !isUploading ? 'bg-[#2D5A27] text-white hover:bg-green-700' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              }`}
            >
              {isUploading ? 'Mengunggah...' : 'Tambahkan ke Slider'}
            </button>
          </div>

          {/* List Section */}
          <div className="w-full md:w-2/3">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <ImageIcon size={18} /> Gambar Slider Aktif ({sliderImages.length})
            </h3>
            
            {sliderImages.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-855 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">Belum ada gambar slider.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sliderImages.map((img, index) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img src={img.url} alt={`Slider ${index}`} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleDelete(img.id)}
                        className="bg-red-500 hover:bg-red-650 text-white p-2 rounded-full transform hover:scale-110 transition-all cursor-pointer"
                        title="Hapus gambar"
                      >
                        <Trash2 size={20} />
                      </button>
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
