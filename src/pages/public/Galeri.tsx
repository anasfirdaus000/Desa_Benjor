import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Galeri = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const galeriWisata = [
    { title: 'Wisata Siling Kanu - Air Terjun Utama', image: '/tamang_files/000eb415acb85e5560517e3dc2775072.jpg', desc: 'Pesona air terjun tersembunyi dengan alam yang asri.' },
    { title: 'Wisata Bukit Bongku - Spot Foto Awan', image: '/tamang_files/f26e073b8124a077d194a810e3f2f3a1.jpg', desc: 'Keindahan pemandangan dari puncak bukit di pagi hari.' },
    { title: 'Pesona Lembah Benjor - Lanskap Hijau', image: '/tamang_files/25305b13929576d65d9296b09ddb4b2c.jpg', desc: 'Hamparan lembah hijau yang menenangkan jiwa.' },
    { title: 'Keasrian Hutan Desa - Flora Lokal', image: '/tamang_files/aaf8b88f7a33350eaa289c6ed07d0bc1.jpeg', desc: 'Hutan desa rimbun penunjang ekosistem mata air.' },
    { title: 'Sungai Bersih - Aliran Benjor', image: '/tamang_files/1f8fa6396f6bd336ad793a4c88e37e18.jpeg', desc: 'Aliran sungai jernih dari pegunungan Malang.' },
    { title: 'Rimbun Pinus - Area Camping', image: '/tamang_files/2536e945bc9b6bde053777264de2b75f.jpeg', desc: 'Camping ground asri di bawah pohon pinus.' },
    { title: 'Pertanian Terpadu - Hasil Tani', image: '/tamang_files/a6085185b28d0ded30d077c9c80e27f7.jpg', desc: 'Perkebunan lokal penghasil produk organik.' },
    { title: 'Pesona Air Terjun Mini', image: '/tamang_files/8d94257a2f2d6703d03fb0385cb775e0.jpeg', desc: 'Aliran jeram kecil di sepanjang tracking wisata.' },
    { title: 'Sunset Lembah Benjor', image: '/tamang_files/29ce51f1e4ff8000b7b5e586ee73672a.jpeg', desc: 'Pemandangan matahari terbenam yang memukau.' },
    { title: 'Pesona Hutan Bambu Desa', image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80', desc: 'Hutan bambu alami penghasil anyaman khas.' },
    { title: 'Perkebunan Kopi Lereng Gunung', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80', desc: 'Tanaman kopi robusta unggulan petani Benjor.' },
    { title: 'Pesona Jalur Ekspedisi Hutan', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80', desc: 'Jalur tracking pendakian asri menembus hutan pinus.' },
    { title: 'Pagi Hari Lembah Benjor', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80', desc: 'Udara berkabut yang menyejukkan di lereng bukit.' },
    { title: 'Pertanian Singkong Desa', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80', desc: 'Lahan singkong luas sebagai bahan baku kripik.' },
    { title: 'Wisata Budaya - Bersih Desa', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80', desc: 'Upacara adat bersih desa yang diwariskan leluhur.' }
  ];

  // Pagination calculation
  const totalPages = Math.ceil(galeriWisata.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWisata = galeriWisata.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#2D5A27] transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2D5A27] border border-green-100">
            <Camera size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Galeri Wisata Desa Benjor</h1>
          <p className="text-lg text-gray-500">Menjelajahi pesona keindahan alam, potensi wisata, dan dokumentasi keasrian Desa Benjor.</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paginatedWisata.map((spot, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/80 group cursor-pointer flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden relative bg-gray-100">
                <img 
                  src={spot.image} 
                  alt={spot.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#2D5A27] transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {spot.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#2D5A27] font-semibold mt-auto">
                  <MapPin size={14} />
                  <span>Desa Benjor, Malang</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Pagination Control */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200/60 pt-8 gap-4">
            <p className="text-sm text-gray-500 font-medium">
              Menampilkan <span className="font-bold text-gray-800">{startIndex + 1}</span> - <span className="font-bold text-gray-800">{Math.min(startIndex + itemsPerPage, galeriWisata.length)}</span> dari <span className="font-bold text-gray-800">{galeriWisata.length}</span> objek wisata
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-[#2D5A27] hover:text-[#2D5A27] disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-11 h-11 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                    currentPage === i + 1
                      ? 'bg-[#2D5A27] border-[#2D5A27] text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#2D5A27] hover:text-[#2D5A27]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-[#2D5A27] hover:text-[#2D5A27] disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Galeri;
