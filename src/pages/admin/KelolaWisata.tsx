import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Plus, Edit2, Trash2, X, MessageSquare, Image as ImageIcon } from 'lucide-react';

const KelolaWisata = () => {
  const { wisata, setWisata } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Custom states for modal and form
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
  });

  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'comments'>('info');
  const [selectedComments, setSelectedComments] = useState<any[]>([]);

  // Main Image Upload hook
  const { 
    previewUrl: mainPreviewUrl, 
    handleImageChange: handleMainImageChange, 
    clearImage: clearMainImage, 
    setPreviewUrl: setMainPreviewUrl, 
    isUploading: isMainUploading 
  } = useImageUpload();

  // Additional Image Upload hook
  const { 
    previewUrl: addPreviewUrl, 
    handleImageChange: handleAddImageChange, 
    clearImage: clearAddImage, 
    isUploading: isAddUploading 
  } = useImageUpload();

  const handleOpenModal = (item: any = null) => {
    setActiveTab('info');
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        desc: item.desc || '',
      });
      setMainPreviewUrl(item.image);
      setAdditionalPhotos(item.photos || []);
      setSelectedComments(item.comments || []);
    } else {
      setEditingId(null);
      setFormData({ title: '', desc: '' });
      clearMainImage();
      setAdditionalPhotos([]);
      setSelectedComments([]);
    }
    clearAddImage();
    setIsModalOpen(true);
  };

  const handleAddAdditionalPhoto = () => {
    if (addPreviewUrl) {
      setAdditionalPhotos([...additionalPhotos, addPreviewUrl]);
      clearAddImage();
    }
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setAdditionalPhotos(additionalPhotos.filter((_, idx) => idx !== index));
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Yakin ingin menghapus komentar ini?')) {
      setSelectedComments(selectedComments.filter(c => c.id !== commentId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMainUploading || isAddUploading) {
      alert('Gambar sedang diunggah ke Cloudinary. Mohon tunggu...');
      return;
    }

    if (!mainPreviewUrl && !editingId) {
      alert('Mohon upload foto utama wisata');
      return;
    }

    const wisataData = {
      title: formData.title,
      desc: formData.desc,
      image: mainPreviewUrl || '',
      photos: additionalPhotos,
      comments: selectedComments,
    };

    if (editingId) {
      setWisata(wisata.map(item => item.id === editingId ? { ...item, ...wisataData } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...wisataData,
      };
      setWisata([newItem, ...wisata]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus objek wisata ini?')) {
      setWisata(wisata.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-850/50 rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Kelola Wisata Desa Benjor</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Daftar objek wisata, galeri tambahan, dan ulasan pengunjung.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium cursor-pointer"
        >
          <Plus size={18} /> Tambah Destinasi
        </button>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-855 text-gray-600 dark:text-gray-300 text-sm border-b dark:border-gray-800">
                <th className="p-4 font-medium">Foto Utama</th>
                <th className="p-4 font-medium">Nama Wisata</th>
                <th className="p-4 font-medium">Jumlah Foto Galeri</th>
                <th className="p-4 font-medium">Komentar</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {wisata.map(spot => (
                <tr key={spot.id} className="border-b dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                  <td className="p-4">
                    <img src={spot.image} alt={spot.title} className="w-20 h-14 rounded-lg object-cover border dark:border-gray-800" />
                  </td>
                  <td className="p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">{spot.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-sm mt-0.5">{spot.desc}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {(spot.photos || []).length} Foto
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {(spot.comments || []).length} Ulasan
                  </td>
                  <td className="p-4 flex gap-2 h-20 items-center">
                    <button 
                      onClick={() => handleOpenModal(spot)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(spot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {wisata.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada destinasi wisata yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-850/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Destinasi Wisata' : 'Tambah Destinasi Wisata'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>

            {/* Tab Buttons */}
            {editingId && (
              <div className="flex border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-850">
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 flex items-center justify-center gap-1.5 ${
                    activeTab === 'info' ? 'border-[#2D5A27] text-[#2D5A27] dark:text-green-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Edit2 size={16} /> Info Utama
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 flex items-center justify-center gap-1.5 ${
                    activeTab === 'photos' ? 'border-[#2D5A27] text-[#2D5A27] dark:text-green-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <ImageIcon size={16} /> Galeri Foto
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 flex items-center justify-center gap-1.5 ${
                    activeTab === 'comments' ? 'border-[#2D5A27] text-[#2D5A27] dark:text-green-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <MessageSquare size={16} /> Komentar ({selectedComments.length})
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                {activeTab === 'info' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Wisata</label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                        placeholder="Contoh: Air Terjun Siling Kanu"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                      <textarea 
                        value={formData.desc} 
                        onChange={(e) => setFormData({...formData, desc: e.target.value})}
                        className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none h-28"
                        placeholder="Deskripsi objek wisata..."
                        required
                      />
                    </div>

                    {/* Main Image upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Utama</label>
                      {mainPreviewUrl ? (
                        <div className="relative w-full h-44 rounded-xl overflow-hidden group border dark:border-gray-800">
                          <img src={mainPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={clearMainImage}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow transition-all cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center hover:border-[#2D5A27] transition-colors bg-gray-50 dark:bg-gray-850">
                          <ImageIcon size={32} className="text-gray-400 mb-2" />
                          <label className="bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer font-medium">
                            Upload Foto
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleMainImageChange} 
                            />
                          </label>
                          <span className="text-xs text-gray-500 mt-2">Ukuran berkas maksimal 5MB</span>
                        </div>
                      )}
                      {isMainUploading && <p className="text-xs text-[#2D5A27] font-semibold mt-1 animate-pulse">Mengunggah ke Cloudinary...</p>}
                    </div>
                  </>
                )}

                {activeTab === 'photos' && (
                  <div className="space-y-4">
                    {/* Add Additional Photo control */}
                    <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border dark:border-gray-800">
                      <p className="text-sm font-bold text-gray-700 dark:text-white mb-2">Unggah Foto Tambahan ke Galeri</p>
                      
                      {addPreviewUrl ? (
                        <div className="space-y-3">
                          <div className="relative w-40 h-28 rounded-lg overflow-hidden border dark:border-gray-800">
                            <img src={addPreviewUrl} alt="Preview tambahan" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={clearAddImage}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddAdditionalPhoto}
                            className="bg-[#2D5A27] hover:bg-green-750 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Tambahkan ke Galeri
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <label className="bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-xs shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer font-bold">
                            Pilih Foto Tambahan
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleAddImageChange} 
                            />
                          </label>
                          {isAddUploading && <p className="text-xs text-[#2D5A27] font-semibold animate-pulse">Mengunggah...</p>}
                        </div>
                      )}
                    </div>

                    {/* Current Additional Photos list */}
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-white mb-3">Koleksi Foto Galeri ({additionalPhotos.length})</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {additionalPhotos.map((photo, idx) => (
                          <div key={idx} className="relative h-20 rounded-lg overflow-hidden group border dark:border-gray-800">
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => handleRemoveAdditionalPhoto(idx)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 shadow transition-opacity cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        {additionalPhotos.length === 0 && (
                          <p className="text-xs text-gray-500 col-span-3">Belum ada foto tambahan.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-700 dark:text-white mb-1">Daftar Ulasan Pengunjung ({selectedComments.length})</p>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {selectedComments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-850 p-3.5 rounded-xl border dark:border-gray-800 flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-xs text-gray-850 dark:text-white">{comment.name}</span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">{comment.date}</span>
                            </div>
                            <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed">{comment.text}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {selectedComments.length === 0 && (
                        <p className="text-xs text-gray-550 text-center py-6">Belum ada komentar untuk destinasi wisata ini.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 border-t dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-850/50">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isMainUploading || isAddUploading}
                  className="bg-[#2D5A27] hover:bg-green-700 disabled:bg-gray-350 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  {isMainUploading || isAddUploading ? 'Mengunggah...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaWisata;
