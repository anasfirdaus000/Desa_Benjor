import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

const KelolaBerita = () => {
  const { berita, setBerita } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'photos'>('info');
  
  const { previewUrl, handleImageChange, clearImage, setPreviewUrl, isUploading } = useImageUpload();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    summary: '',
    content: '',
  });

  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleOpenModal = (item: any = null) => {
    setActiveTab('info');
    if (item) {
      setEditingId(item.id);
      setFormData({ 
        title: item.title, category: item.category, summary: item.summary, content: item.content
      });
      setPreviewUrl(item.image);
      setAdditionalPhotos(item.images || []);
    } else {
      setEditingId(null);
      setFormData({ title: '', category: '', summary: '', content: '' });
      setAdditionalPhotos([]);
      clearImage();
    }
    setIsModalOpen(true);
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
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
        setAdditionalPhotos([...additionalPhotos, data.url]);
      } else {
        alert('Gagal mengunggah foto tambahan.');
      }
    } catch (err) {
      alert('Gagal menghubungi server.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setAdditionalPhotos(additionalPhotos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      alert('Gambar utama sedang diunggah. Mohon tunggu...');
      return;
    }

    if (!previewUrl && !editingId) {
      alert('Mohon upload foto/gambar utama berita');
      return;
    }

    if (editingId) {
      setBerita(berita.map(item => item.id === editingId ? { 
        ...item, ...formData, image: previewUrl || item.image, images: additionalPhotos
      } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        image: previewUrl as string,
        images: additionalPhotos
      };
      setBerita([newItem, ...berita]); // add to top
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus berita ini?')) {
      setBerita(berita.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-850/50 rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Kelola Berita</h2>
          <p className="text-sm text-gray-505 dark:text-gray-400">Publikasi informasi dan artikel berita desa.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium cursor-pointer"
        >
          <Plus size={18} /> Tulis Berita
        </button>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-855 text-gray-600 dark:text-gray-300 text-sm border-b dark:border-gray-800">
                <th className="p-4 font-medium">Thumbnail</th>
                <th className="p-4 font-medium">Judul Berita</th>
                <th className="p-4 font-medium">Foto Tambahan</th>
                <th className="p-4 font-medium">Tanggal</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {berita.map(item => (
                <tr key={item.id} className="border-b dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-855/30 transition-colors">
                  <td className="p-4">
                    <img src={item.image} alt={item.title} className="w-20 h-14 rounded object-cover border dark:border-gray-850 bg-gray-105" />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800 dark:text-white line-clamp-1">{item.title}</div>
                    <div className="text-xs text-gray-505 dark:text-gray-400 mt-1">{item.category}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    {(item.images || []).length} Foto
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors cursor-pointer"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/55 dark:bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border dark:border-gray-800">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{editingId ? 'Edit Berita' : 'Tulis Berita'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-550 hover:bg-gray-205 dark:hover:bg-gray-800 p-1.5 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b dark:border-gray-850 px-4 bg-gray-50 dark:bg-gray-850/30">
              <button 
                onClick={() => setActiveTab('info')}
                className={`py-2.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'info' ? 'border-[#2D5A27] text-[#2D5A27] dark:text-green-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Informasi Utama
              </button>
              <button 
                onClick={() => setActiveTab('photos')}
                className={`py-2.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'photos' ? 'border-[#2D5A27] text-[#2D5A27] dark:text-green-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Galeri Foto Tambahan ({(additionalPhotos || []).length})
              </button>
            </div>

            <div className="p-5 overflow-y-auto text-gray-800 dark:text-gray-250 flex-grow">
              {activeTab === 'info' ? (
                <form id="berita-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Judul Berita</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none font-bold" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Contoh: Pemerintahan, Kegiatan Warga" className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Ringkasan Singkat</label>
                    <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none h-16" required maxLength={150}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Isi Berita Lengkap</label>
                    <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none h-44" required></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Gambar Utama (Sampul)</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border dark:border-gray-750 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-gray-300 cursor-pointer text-xs" />
                    
                    {previewUrl && (
                      <div className="relative mt-3 h-44 rounded-lg overflow-hidden border dark:border-gray-800 shadow-inner">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-gray-100 dark:bg-gray-905" />
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs text-white font-bold">
                            Mengunggah ke Cloudinary...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border dark:border-gray-800">
                    <label className="block text-sm font-bold text-gray-750 dark:text-gray-300 mb-2">Upload Foto Tambahan</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAddPhoto}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2D5A27] file:text-white hover:file:bg-green-700 cursor-pointer"
                      disabled={isUploadingPhoto}
                    />
                    {isUploadingPhoto && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-semibold animate-pulse">Mengunggah berkas ke Cloudinary...</p>
                    )}
                  </div>

                  <h4 className="font-semibold text-sm border-b dark:border-gray-800 pb-1 flex items-center gap-1.5"><ImageIcon size={16} /> Daftar Galeri Foto ({additionalPhotos.length})</h4>
                  
                  {additionalPhotos.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-450 italic py-4 text-center">Belum ada foto tambahan yang diunggah.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {additionalPhotos.map((photo, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border dark:border-gray-800 bg-gray-105 h-28 shadow-sm">
                          <img src={photo} alt={`Galeri ${index + 1}`} className="w-full h-full object-contain bg-gray-50 dark:bg-gray-900" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button" 
                              onClick={() => handleRemovePhoto(index)}
                              className="bg-red-650 hover:bg-red-750 text-white p-1.5 rounded-full transition-colors cursor-pointer shadow"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-850 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors cursor-pointer text-sm">Batal</button>
              {activeTab === 'info' ? (
                <button type="submit" form="berita-form" disabled={isUploading} className="px-5 py-2 bg-[#2D5A27] hover:bg-green-700 text-white rounded-lg font-semibold transition-colors cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow">
                  {isUploading ? 'Mengunggah...' : 'Simpan Publikasi'}
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isUploading || isUploadingPhoto} className="px-5 py-2 bg-[#2D5A27] hover:bg-green-700 text-white rounded-lg font-semibold transition-colors cursor-pointer text-sm shadow">
                  Simpan Publikasi
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaBerita;
