import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const KelolaSOTK = () => {
  const { sotk, setSotk } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { previewUrl, handleImageChange, clearImage, setPreviewUrl, isUploading } = useImageUpload();
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    level: 3,
    align: 'center'
  });

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ 
        name: item.name, 
        position: item.position, 
        level: item.level,
        align: item.align || 'center'
      });
      setPreviewUrl(item.image);
    } else {
      setEditingId(null);
      setFormData({ name: '', position: '', level: 3, align: 'center' });
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
      alert('Mohon upload foto perangkat desa');
      return;
    }

    if (editingId) {
      setSotk(sotk.map(member => member.id === editingId ? { 
        ...member, ...formData, name: formData.name.toUpperCase(), image: previewUrl || member.image 
      } : member));
    } else {
      const newMember = {
        id: Date.now().toString(),
        name: formData.name.toUpperCase(),
        position: formData.position,
        level: formData.level,
        image: previewUrl as string,
        align: formData.align
      };
      setSotk([...sotk, newMember]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus perangkat desa ini?')) {
      setSotk(sotk.filter(member => member.id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-55 dark:bg-gray-850/50 rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Kelola SOTK</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Daftar Struktur Organisasi & Tata Kerja perangkat Desa Benjor.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-semibold cursor-pointer shadow-sm"
        >
          <Plus size={18} /> Tambah Anggota
        </button>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-855 text-gray-605 dark:text-gray-300 text-sm border-b dark:border-gray-800">
                <th className="p-4 font-medium">Foto</th>
                <th className="p-4 font-medium">Nama Perangkat</th>
                <th className="p-4 font-medium">Jabatan</th>
                <th className="p-4 font-medium">Tingkat Struktur</th>
                <th className="p-4 font-medium">Focal Point</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sotk.map(member => (
                <tr key={member.id} className="border-b dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                  <td className="p-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className={`w-12 h-12 rounded-full object-cover border dark:border-gray-800 bg-gray-100 ${
                        member.align === 'top' ? 'object-top' :
                        member.align === 'bottom' ? 'object-bottom' : 'object-center'
                      }`} 
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white uppercase">{member.name}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-650 dark:text-gray-400">{member.position}</td>
                  <td className="p-4 text-sm text-gray-650 dark:text-gray-400">
                    {member.level === 1 && 'Level 1 (Kades)'}
                    {member.level === 2 && 'Level 2 (Sekdes)'}
                    {member.level === 3 && 'Level 3 (Kaur/Kasi)'}
                    {member.level === 4 && 'Level 4 (Kepala Dusun)'}
                  </td>
                  <td className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-450 uppercase">
                    {member.align || 'center'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(member)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors cursor-pointer"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(member.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border dark:border-gray-800">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-850">
              <h3 className="font-bold text-base text-gray-905 dark:text-white">{editingId ? 'Edit Anggota SOTK' : 'Tambah Perangkat Desa'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            <div className="p-5 overflow-y-auto text-gray-800 dark:text-gray-250">
              <form id="sotk-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Nama Lengkap</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none uppercase font-semibold" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Jabatan</label>
                  <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1">Tingkatan Level Struktur</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: Number(e.target.value)})} className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none">
                    <option value={1}>Level 1 - Kepala Desa</option>
                    <option value={2}>Level 2 - Sekretaris Desa</option>
                    <option value={3}>Level 3 - Kaur / Kasi</option>
                    <option value={4}>Level 4 - Kepala Dusun</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-305 mb-1 font-semibold">Focal Point (Posisi Fokus Foto)</label>
                  <select value={formData.align} onChange={e => setFormData({...formData, align: e.target.value})} className="w-full p-2 border dark:border-gray-750 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none">
                    <option value="top">Atas (Top) - Bagus untuk pas foto kepala</option>
                    <option value="center">Tengah (Center)</option>
                    <option value="bottom">Bawah (Bottom)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Perangkat</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border dark:border-gray-750 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-gray-300 cursor-pointer" />
                  
                  {previewUrl && (
                    <div className="relative mt-2">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className={`h-40 w-full object-cover rounded border dark:border-gray-800 bg-gray-900 ${
                          formData.align === 'top' ? 'object-top' :
                          formData.align === 'bottom' ? 'object-bottom' : 'object-center'
                        }`} 
                      />
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
            <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-850 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-650 dark:text-gray-300 hover:bg-gray-250 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors cursor-pointer text-xs">Batal</button>
              <button type="submit" form="sotk-form" disabled={isUploading} className="px-5 py-2 bg-[#2D5A27] hover:bg-green-700 text-white rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs shadow-sm">
                {isUploading ? 'Mengunggah...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaSOTK;
