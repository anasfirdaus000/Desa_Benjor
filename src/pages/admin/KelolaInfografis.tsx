import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save } from 'lucide-react';

const KelolaInfografis = () => {
  const { infografis, setInfografis } = useAppContext();
  
  // Local state for forms
  const [penduduk, setPenduduk] = useState({
    laki: infografis.penduduk.data[0],
    perempuan: infografis.penduduk.data[1]
  });

  const [apbdes, setApbdes] = useState({
    pad: infografis.apbdes.data[0],
    dd: infografis.apbdes.data[1],
    bk: infografis.apbdes.data[2],
    ll: infografis.apbdes.data[3]
  });

  const [bansos, setBansos] = useState({
    pkh: infografis.bansos.data[0],
    bpnt: infografis.bansos.data[1],
    blt: infografis.bansos.data[2]
  });

  const handleSave = () => {
    setInfografis({
      penduduk: {
        labels: ['Laki-laki', 'Perempuan'],
        data: [penduduk.laki, penduduk.perempuan]
      },
      apbdes: {
        labels: ['Pendapatan Asli Desa', 'Dana Desa', 'Bantuan Kabupaten', 'Lain-lain'],
        data: [apbdes.pad, apbdes.dd, apbdes.bk, apbdes.ll]
      },
      bansos: {
        labels: ['PKH', 'BPNT', 'BLT DD'],
        data: [bansos.pkh, bansos.bpnt, bansos.blt]
      }
    });
    alert('Data infografis berhasil diperbarui!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Kelola Data Infografis</h2>
          <p className="text-sm text-gray-500">Update angka statistik desa untuk grafik publik.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Demografi Penduduk */}
        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">Data Demografi Penduduk</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Laki-laki (Jiwa)</label>
              <input 
                type="number" 
                value={penduduk.laki} 
                onChange={(e) => setPenduduk({...penduduk, laki: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perempuan (Jiwa)</label>
              <input 
                type="number" 
                value={penduduk.perempuan} 
                onChange={(e) => setPenduduk({...penduduk, perempuan: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
              />
            </div>
            <div className="pt-2">
              <p className="text-sm font-bold text-gray-700">Total: {penduduk.laki + penduduk.perempuan} Jiwa</p>
            </div>
          </div>
        </div>

        {/* Bantuan Sosial */}
        <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
          <h3 className="font-bold text-orange-900 mb-4 border-b border-orange-200 pb-2">Penerima Bansos (KK)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PKH</label>
              <input 
                type="number" 
                value={bansos.pkh} 
                onChange={(e) => setBansos({...bansos, pkh: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BPNT</label>
              <input 
                type="number" 
                value={bansos.bpnt} 
                onChange={(e) => setBansos({...bansos, bpnt: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BLT Dana Desa</label>
              <input 
                type="number" 
                value={bansos.blt} 
                onChange={(e) => setBansos({...bansos, blt: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white" 
              />
            </div>
          </div>
        </div>

        {/* APBDes */}
        <div className="bg-green-50/50 p-5 rounded-xl border border-green-100 lg:col-span-1 md:col-span-2 lg:row-span-2">
          <h3 className="font-bold text-[#2D5A27] mb-4 border-b border-green-200 pb-2">Transparansi APBDes (Juta Rupiah)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pendapatan Asli Desa (PADes)</label>
              <input 
                type="number" 
                value={apbdes.pad} 
                onChange={(e) => setApbdes({...apbdes, pad: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dana Desa (DD)</label>
              <input 
                type="number" 
                value={apbdes.dd} 
                onChange={(e) => setApbdes({...apbdes, dd: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bantuan Kabupaten</label>
              <input 
                type="number" 
                value={apbdes.bk} 
                onChange={(e) => setApbdes({...apbdes, bk: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lain-lain</label>
              <input 
                type="number" 
                value={apbdes.ll} 
                onChange={(e) => setApbdes({...apbdes, ll: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none bg-white" 
              />
            </div>
             <div className="pt-2">
              <p className="text-sm font-bold text-gray-700">Total Anggaran: Rp {(apbdes.pad + apbdes.dd + apbdes.bk + apbdes.ll).toLocaleString('id-ID')} Juta</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default KelolaInfografis;
