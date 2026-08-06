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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Berita Desa</h1>
          <p className="text-lg text-gray-600">Kumpulan informasi, pengumuman, dan kegiatan terbaru di Desa Benjor.</p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-[#2D5A27] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#2D5A27] focus:border-[#2D5A27] bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBerita.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Tag size={14} className="text-[#2D5A27]" />
                    <span className="font-medium text-[#2D5A27]">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#2D5A27] transition-colors">{item.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">{item.summary}</p>
                
                <Link to={`/berita/${item.id}`} className="text-[#2D5A27] font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto self-start">
                  Baca Selengkapnya <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {filteredBerita.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Berita tidak ditemukan</h3>
            <p className="text-gray-500">Coba gunakan kata kunci atau kategori yang berbeda.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Berita;
