import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const KelolaUMKM = () => {
  const { umkm, setUmkm } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { previewUrl, handleImageChange, clearImage, setPreviewUrl, isUploading } = useImageUpload();
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    owner: '',
    wa: '',
    category: '',
  });

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ 
        name: item.name, price: item.price, description: item.description, 
        owner: item.owner, wa: item.wa, category: item.category 
      });
      setPreviewUrl(item.image);
    } else {
      setEditingId(null);
      setFormData({ name: '', price: 0, description: '', owner: '', wa: '', category: '' });
      clearImage();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      alert('Gambar sedang diunggah ke Cloudinary. Mohon tunggu...');
      return;
    }

    if (!previewUrl && !editingId) {
      alert('Mohon upload foto produk');
      return;
    }

    if (editingId) {
      setUmkm(umkm.map(item => item.id === editingId ? { ...item, ...formData, image: previewUrl || item.image } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        image: previewUrl as string
      };
      setUmkm([newItem, ...umkm]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      setUmkm(umkm.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-850/50 rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Kelola Produk UMKM</h2>
          <p className="text-sm text-gray-505 dark:text-gray-400">Daftar produk ekonomi kreatif warga Desa Benjor.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium cursor-pointer"
        >
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-855 text-gray-600 dark:text-gray-300 text-sm border-b dark:border-gray-800">
                <th className="p-4 font-medium">Foto</th>
                <th className="p-4 font-medium">Nama Produk</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Pemilik</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {umkm.map(product => (
                <tr key={product.id} className="border-b dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                  <td className="p-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover border dark:border-gray-800" />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-850 dark:text-white line-clamp-1">{product.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.category}</div>
                  </td>
                  <td className="p-4 font-bold text-[#2D5A27] dark:text-green-400 text-sm">
                    Rp {product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 text-sm text-gray-650 dark:text-gray-400">
                    <div>{product.owner}</div>
                    <div className="text-xs text-gray-400">{product.wa}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors cursor-pointer"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"><Trash2 size={16} /></button>
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
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border dark:border-gray-800">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 p-1.5 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto text-gray-800 dark:text-gray-250">
              <form id="umkm-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Nama Produk</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Kategori</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Contoh: Kuliner, Kerajinan" className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Harga (Rupiah)</label>
                    <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Nama Pemilik</label>
                    <input type="text" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">No. WhatsApp</label>
                    <input type="text" value={formData.wa} onChange={e => setFormData({...formData, wa: e.target.value})} placeholder="08123..." className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Deskripsi Singkat</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none h-20" required></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Produk</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border dark:border-gray-750 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-gray-300 cursor-pointer" />
                  
                  {previewUrl && (
                    <div className="relative mt-2">
                      <img src={previewUrl} alt="Preview" className="h-32 w-full object-cover rounded border dark:border-gray-800" />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs text-white font-bold rounded">
                          Mengunggah ke Cloudinary...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="p-4 border-t dark:border-gray-800 bg-gray-55 dark:bg-gray-850 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-650 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors cursor-pointer">Batal</button>
              <button type="submit" form="umkm-form" disabled={isUploading} className="px-4 py-2 bg-[#2D5A27] hover:bg-green-700 text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploading ? 'Mengunggah...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaUMKM;
