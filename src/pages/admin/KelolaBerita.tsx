import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const KelolaBerita = () => {
  const { berita, setBerita } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { previewUrl, handleImageChange, clearImage, setPreviewUrl } = useImageUpload();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    summary: '',
    content: '',
  });

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ 
        title: item.title, category: item.category, summary: item.summary, content: item.content
      });
      setPreviewUrl(item.image);
    } else {
      setEditingId(null);
      setFormData({ title: '', category: '', summary: '', content: '' });
      clearImage();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !editingId) {
      alert('Mohon upload foto/gambar berita');
      return;
    }

    if (editingId) {
      setBerita(berita.map(item => item.id === editingId ? { 
        ...item, ...formData, image: previewUrl || item.image 
      } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        image: previewUrl as string
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Kelola Berita</h2>
          <p className="text-sm text-gray-500">Publikasi informasi dan artikel desa.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <Plus size={18} /> Tulis Berita
        </button>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="p-4 font-medium">Thumbnail</th>
                <th className="p-4 font-medium">Judul Berita</th>
                <th className="p-4 font-medium">Tanggal</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {berita.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <img src={item.image} alt={item.title} className="w-20 h-14 rounded object-cover border" />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800 line-clamp-1">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.category}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
          <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">{editingId ? 'Edit Berita' : 'Tulis Berita'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-200 p-1 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="berita-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none font-medium" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Contoh: Pemerintahan, Kegiatan Warga" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan (Singkat)</label>
                  <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none h-16" required maxLength={150}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Isi Berita Lengkap</label>
                  <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none h-40" required></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Utama</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-lg bg-gray-50" />
                  {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 h-40 w-full object-cover rounded border" />}
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">Batal</button>
              <button type="submit" form="berita-form" className="px-4 py-2 bg-[#2D5A27] hover:bg-green-700 text-white rounded-lg font-medium transition-colors">Simpan Publikasi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaBerita;
