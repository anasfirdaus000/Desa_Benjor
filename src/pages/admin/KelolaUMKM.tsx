import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const KelolaUMKM = () => {
  const { umkm, setUmkm } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { previewUrl, handleImageChange, clearImage, setPreviewUrl } = useImageUpload();
  
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
      setUmkm([...umkm, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      setUmkm(umkm.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Kelola UMKM</h2>
          <p className="text-sm text-gray-500">Manajemen katalog produk unggulan desa.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="p-4 font-medium">Foto</th>
                <th className="p-4 font-medium">Produk & Kategori</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Pemilik & Kontak</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {umkm.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover border" />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{item.name}</div>
                    <div className="text-xs text-green-600 font-medium bg-green-50 inline-block px-2 py-0.5 rounded mt-1">{item.category}</div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">Rp {item.price.toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <div className="text-gray-800">{item.owner}</div>
                    <div className="text-sm text-gray-500">{item.wa}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-200 p-1 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="umkm-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Contoh: Kuliner" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
                    <input type="text" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                    <input type="text" value={formData.wa} onChange={e => setFormData({...formData, wa: e.target.value})} placeholder="08123..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none h-20" required></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto Produk</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-lg bg-gray-50" />
                  {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded border" />}
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">Batal</button>
              <button type="submit" form="umkm-form" className="px-4 py-2 bg-[#2D5A27] hover:bg-green-700 text-white rounded-lg font-medium transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaUMKM;
