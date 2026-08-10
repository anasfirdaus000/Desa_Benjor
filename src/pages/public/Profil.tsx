import React from 'react';
import { useAppContext } from '../../context/AppContext';

const Profil = () => {
  const { villageInfo, sotk } = useAppContext();

  // Sort SOTK by level (hierarchy)
  const kades = sotk.find(s => s.level === 1);
  const sekdes = sotk.find(s => s.level === 2);
  const kaurKasie = sotk.filter(s => s.level === 3);
  const kasun = sotk.filter(s => s.level === 4);

  const SotkCard = ({ item }: { item: any }) => {
    if (!item) return null;
    return (
      <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all w-48 mx-auto">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-800">
          <img src={item.image} alt={item.name} className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800 p-1" />
        </div>
        <div className="w-full text-center">
          <div className="bg-[#2D5A27] dark:bg-gray-950 text-white font-bold py-2 px-2 text-sm uppercase tracking-wider">
            {item.name}
          </div>
          <div className="py-3 px-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
            {item.position}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 text-gray-850 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Profil Desa Benjor</h1>
          <p className="text-lg text-gray-650 dark:text-gray-400">Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan Desa Benjor.</p>
        </div>

        {/* Visi Misi */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-[#2D5A27] dark:text-green-400 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-green-100 dark:bg-green-950/40 flex items-center justify-center">🎯</span>
              Visi
            </h2>
            <p className="text-gray-750 dark:text-gray-300 text-lg leading-relaxed">{villageInfo.vision}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-[#2D5A27] dark:text-green-400 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-green-100 dark:bg-green-950/40 flex items-center justify-center">🚀</span>
              Misi
            </h2>
            <p className="text-gray-750 dark:text-gray-300 leading-relaxed whitespace-pre-line">{villageInfo.mission}</p>
          </div>
        </div>

        {/* Sejarah & Geografis */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-lg">📖</span>
              Sejarah Desa
            </h2>
            <div className="prose max-w-none text-gray-750 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line">
              {villageInfo.history}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-lg">🗺️</span>
              Detail Geografis
            </h2>
            <div className="prose max-w-none text-gray-750 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line mb-6">
              {villageInfo.geography}
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-t dark:border-gray-800 pt-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-850 rounded-xl border dark:border-gray-800">
                <span className="block text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Luas Wilayah</span>
                <span className="text-xs sm:text-base font-extrabold text-[#2D5A27] dark:text-green-400 mt-1 block">{villageInfo.stats?.area || '450 Ha'}</span>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-850 rounded-xl border dark:border-gray-800">
                <span className="block text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Jumlah RT</span>
                <span className="text-xs sm:text-base font-extrabold text-[#2D5A27] dark:text-green-400 mt-1 block">{villageInfo.stats?.rt || '15'}</span>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-850 rounded-xl border dark:border-gray-800">
                <span className="block text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Jumlah RW</span>
                <span className="text-xs sm:text-base font-extrabold text-[#2D5A27] dark:text-green-400 mt-1 block">{villageInfo.stats?.rw || '4'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SOTK Hierarchy */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Struktur Organisasi (SOTK)</h2>
          
          <div className="flex flex-col items-center relative overflow-x-auto pb-8">
            {/* Level 1: Kades */}
            <div className="relative z-10 mb-8">
              <SotkCard item={kades} />
              <div className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gray-300 dark:bg-gray-800"></div>
            </div>

            {/* Level 2: Sekdes */}
            <div className="relative z-10 mb-8 w-full flex justify-center">
              <div className="relative">
                <SotkCard item={sekdes} />
                <div className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gray-300 dark:bg-gray-800"></div>
                {/* Horizontal line connector from Sekdes to Kaur/Kasie */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[60%] sm:w-[80%] md:w-full max-w-3xl h-0.5 bg-gray-300 dark:bg-gray-800"></div>
              </div>
            </div>

            {/* Level 3: Kaur/Kasie */}
            <div className="relative z-10 mb-12 w-full flex justify-center gap-4 sm:gap-8 flex-wrap px-4">
              {kaurKasie.map((item) => (
                <div key={item.id} className="relative mt-8">
                   <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-gray-300 dark:bg-gray-800"></div>
                  <SotkCard item={item} />
                </div>
              ))}
            </div>

            {/* Level 4: Kasun */}
            <div className="w-full mt-8">
              <h3 className="text-xl font-bold text-center text-gray-500 dark:text-gray-400 mb-6 border-t dark:border-gray-800 pt-8">Kepala Dusun (Pelaksana Kewilayahan)</h3>
              <div className="flex justify-center gap-4 sm:gap-8 flex-wrap px-4">
                {kasun.map((item) => (
                  <div key={item.id}>
                    <SotkCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profil;
