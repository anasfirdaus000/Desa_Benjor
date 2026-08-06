import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Users, Store, Newspaper, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { sotk, umkm, berita, villageInfo } = useAppContext();

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
        <p className="text-gray-650 dark:text-gray-400">Selamat datang di panel admin Sistem Informasi Desa Benjor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Perangkat</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{sotk.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-950/40 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
            <Store size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">UMKM</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{umkm.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950/40 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Newspaper size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Berita</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{berita.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-950/40 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pengunjung</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1,204</p>
          </div>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Shortcuts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/berita" className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 hover:border-green-200 dark:hover:border-gray-700 transition-colors flex flex-col items-center justify-center text-center group">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Newspaper size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tulis Berita</span>
          </Link>
          <Link to="/admin/sotk" className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-gray-700 transition-colors flex flex-col items-center justify-center text-center group">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tambah SOTK</span>
          </Link>
          <Link to="/admin/umkm" className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 hover:border-purple-200 dark:hover:border-gray-700 transition-colors flex flex-col items-center justify-center text-center group">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Store size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kelola UMKM</span>
          </Link>
          <Link to="/admin/pengaturan" className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 hover:border-orange-200 dark:hover:border-gray-700 transition-colors flex flex-col items-center justify-center text-center group">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pengaturan</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-gray-550 dark:text-gray-400" />
            Informasi Desa Saat Ini
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kepala Desa</p>
              <p className="font-semibold text-gray-900 dark:text-white">{villageInfo.headName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visi</p>
              <p className="font-semibold text-gray-700 dark:text-gray-350 text-sm line-clamp-2">{villageInfo.vision}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Misi</p>
              <p className="font-semibold text-gray-700 dark:text-gray-350 text-sm line-clamp-3">{villageInfo.mission}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Berita Terakhir</h2>
           <div className="space-y-4">
             {berita.slice(0, 4).map(b => (
               <div key={b.id} className="flex gap-3 items-start border-b border-gray-55 dark:border-gray-800 pb-3 last:border-0">
                 <img src={b.image} alt="" className="w-16 h-12 object-cover rounded bg-gray-100 dark:bg-gray-800" />
                 <div>
                   <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{b.title}</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-450">{new Date(b.date).toLocaleDateString('id-ID')}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
