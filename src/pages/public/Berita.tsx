import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Calendar, Tag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Berita = () => {
  const { berita } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', ...Array.from(new Set(berita.map(item => item.category)))];

  const filteredBerita = berita.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-850 dark:text-gray-100 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Berita Desa</h1>
          <p className="text-lg text-gray-650 dark:text-gray-400">Kumpulan informasi, pengumuman, dan kegiatan terbaru di Desa Benjor.</p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  activeCategory === category 
                    ? 'bg-[#2D5A27] dark:bg-green-650 text-white' 
                    : 'bg-gray-100 dark:bg-gray-805 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#2D5A27] focus:border-[#2D5A27] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBerita.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    item.align === 'top' ? 'object-top' :
                    item.align === 'bottom' ? 'object-bottom' : 'object-center'
                  }`}
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-450 mb-3">
                  <div className="flex items-center gap-1">
                    <Tag size={14} className="text-[#2D5A27] dark:text-green-400" />
                    <span className="font-medium text-[#2D5A27] dark:text-green-400">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#2D5A27] dark:group-hover:text-green-400 transition-colors">{item.title}</h2>
                <p className="text-gray-650 dark:text-gray-400 mb-4 line-clamp-3 flex-grow leading-relaxed">{item.summary}</p>
                
                <Link to={`/berita/${item.id}`} className="text-[#2D5A27] dark:text-green-400 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto self-start">
                  Baca Selengkapnya <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {filteredBerita.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Berita tidak ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400">Coba gunakan kata kunci atau kategori yang berbeda.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Berita;
