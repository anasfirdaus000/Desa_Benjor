import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const KelolaSOTK = () => {
  const { sotk, setSotk } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { previewUrl, handleImageChange, clearImage, setPreviewUrl } = useImageUpload();
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    level: 3,
  });

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ name: item.name, position: item.position, level: item.level });
      setPreviewUrl(item.image);
    } else {
      setEditingId(null);
      setFormData({ name: '', position: '', level: 3 });
      clearImage();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !editingId) {
      alert('Mohon upload foto perangkat desa');
      return;
    }

    if (editingId) {
      setSotk(sotk.map(item => item.id === editingId ? { ...item, ...formData, image: previewUrl || item.image } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        image: previewUrl as string
      };
      setSotk([...sotk, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      setSotk(sotk.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Kelola SOTK</h2>
          <p className="text-sm text-gray-500">Manajemen struktur organisasi perangkat desa.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <Plus size={18} /> Tambah Data
        </button>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="p-4 font-medium">Foto</th>
                <th className="p-4 font-medium">Nama</th>
                <th className="p-4 font-medium">Jabatan</th>
                <th className="p-4 font-medium">Level Hirarki</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sotk.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border" />
                  </td>
                  <td className="p-4 font-bold text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-600">{item.position}</td>
                  <td className="p-4 text-gray-600">Level {item.level}</td>
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
              <h3 className="font-bold text-lg">{editingId ? 'Edit Perangkat Desa' : 'Tambah Perangkat Desa'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-200 p-1 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="sotk-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none uppercase" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                  <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level Hirarki</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none">
                    <option value={1}>Level 1 - Kepala Desa</option>
                    <option value={2}>Level 2 - Sekretaris Desa</option>
                    <option value={3}>Level 3 - Kaur/Kasie</option>
                    <option value={4}>Level 4 - Kepala Dusun</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-lg bg-gray-50" />
                  {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded border" />}
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">Batal</button>
              <button type="submit" form="sotk-form" className="px-4 py-2 bg-[#2D5A27] hover:bg-green-700 text-white rounded-lg font-medium transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaSOTK;
