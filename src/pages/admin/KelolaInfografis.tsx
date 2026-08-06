import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save } from 'lucide-react';

const KelolaInfografis = () => {
  const { infografis, setInfografis } = useAppContext();
  
  // Local state for forms
  const [penduduk, setPenduduk] = useState({
    laki: infografis.penduduk.data[0] || 0,
    perempuan: infografis.penduduk.data[1] || 0
  });

  const [apbdes, setApbdes] = useState({
    pad: infografis.apbdes.data[0] || 0,
    dd: infografis.apbdes.data[1] || 0,
    bk: infografis.apbdes.data[2] || 0,
    ll: infografis.apbdes.data[3] || 0
  });

  const [bansos, setBansos] = useState({
    pkh: infografis.bansos.data[0] || 0,
    bpnt: infografis.bansos.data[1] || 0,
    blt: infografis.bansos.data[2] || 0
  });

  // Keep state in sync with context when loaded asynchronously
  useEffect(() => {
    if (infografis) {
      setPenduduk({
        laki: infografis.penduduk.data[0] || 0,
        perempuan: infografis.penduduk.data[1] || 0
      });
      setApbdes({
        pad: infografis.apbdes.data[0] || 0,
        dd: infografis.apbdes.data[1] || 0,
        bk: infografis.apbdes.data[2] || 0,
        ll: infografis.apbdes.data[3] || 0
      });
      setBansos({
        pkh: infografis.bansos.data[0] || 0,
        bpnt: infografis.bansos.data[1] || 0,
        blt: infografis.bansos.data[2] || 0
      });
    }
  }, [infografis]);

  const handleSave = () => {
    setInfografis({
      penduduk: {
        labels: ['Laki-laki', 'Perempuan'],
        data: [Number(penduduk.laki), Number(penduduk.perempuan)]
      },
      apbdes: {
        labels: ['Pendapatan Asli Desa', 'Dana Desa', 'Bantuan Kabupaten', 'Lain-lain'],
        data: [Number(apbdes.pad), Number(apbdes.dd), Number(apbdes.bk), Number(apbdes.ll)]
      },
      bansos: {
        labels: ['PKH', 'BPNT', 'BLT DD'],
        data: [Number(bansos.pkh), Number(bansos.bpnt), Number(bansos.blt)]
      }
    });
    alert('Data infografis berhasil diperbarui!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-gray-800 dark:text-gray-250 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8 border-b dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Kelola Data Infografis</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update angka statistik desa untuk grafik publik.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[#2D5A27] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium cursor-pointer"
        >
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Kependudukan */}
        <div className="bg-gray-50 dark:bg-gray-850 p-6 rounded-2xl border border-gray-150 dark:border-gray-800">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-4 pb-2 border-b dark:border-gray-800">Demografi Penduduk</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Penduduk Laki-Laki (Jiwa)</label>
              <input 
                type="number" 
                value={penduduk.laki}
                onChange={(e) => setPenduduk({...penduduk, laki: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Penduduk Perempuan (Jiwa)</label>
              <input 
                type="number" 
                value={penduduk.perempuan}
                onChange={(e) => setPenduduk({...penduduk, perempuan: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-755 bg-white dark:bg-gray-800 text-gray-850 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
            <div className="bg-green-50 dark:bg-green-950/40 p-3 rounded-lg mt-4 border dark:border-green-900/30">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Penduduk Terhitung:</p>
              <p className="text-lg font-black text-[#2D5A27] dark:text-green-400">{(Number(penduduk.laki) + Number(penduduk.perempuan)).toLocaleString('id-ID')} Jiwa</p>
            </div>
          </div>
        </div>

        {/* APBDes */}
        <div className="bg-gray-50 dark:bg-gray-855 p-6 rounded-2xl border border-gray-150 dark:border-gray-800">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-4 pb-2 border-b dark:border-gray-800">Anggaran Desa (APBDes)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Pendapatan Asli Desa (Juta Rp)</label>
              <input 
                type="number" 
                value={apbdes.pad}
                onChange={(e) => setApbdes({...apbdes, pad: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Dana Desa (Juta Rp)</label>
              <input 
                type="number" 
                value={apbdes.dd}
                onChange={(e) => setApbdes({...apbdes, dd: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Bantuan Kabupaten (Juta Rp)</label>
              <input 
                type="number" 
                value={apbdes.bk}
                onChange={(e) => setApbdes({...apbdes, bk: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-355 mb-1">Lain-lain (Juta Rp)</label>
              <input 
                type="number" 
                value={apbdes.ll}
                onChange={(e) => setApbdes({...apbdes, ll: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-755 bg-white dark:bg-gray-800 text-gray-850 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Bansos */}
        <div className="bg-gray-50 dark:bg-gray-855 p-6 rounded-2xl border border-gray-150 dark:border-gray-800">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-4 pb-2 border-b dark:border-gray-800">Penerima Bansos</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Penerima PKH (KK)</label>
              <input 
                type="number" 
                value={bansos.pkh}
                onChange={(e) => setBansos({...bansos, pkh: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Penerima BPNT (KK)</label>
              <input 
                type="number" 
                value={bansos.bpnt}
                onChange={(e) => setBansos({...bansos, bpnt: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-350 mb-1">Penerima BLT DD (KK)</label>
              <input 
                type="number" 
                value={bansos.blt}
                onChange={(e) => setBansos({...bansos, blt: Number(e.target.value)})}
                className="w-full p-2.5 border dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#2D5A27] outline-none"
                min="0"
                required
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default KelolaInfografis;
