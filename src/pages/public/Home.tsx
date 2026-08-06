import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Eye, MessageCircle, MapPin, Camera, Star, Send, Trash2, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { sliderImages, villageInfo, berita, infografis, umkm, wisata, fetchWisata } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedWisataId, setSelectedWisataId] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isAdmin = !!localStorage.getItem('admin_token');

  // Slider timing effect for Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const nextSlide = () => setCurrentSlide(currentSlide === sliderImages.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? sliderImages.length - 1 : currentSlide - 1);

  // Horizontal scroll buttons for Produk Unggulan
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 320;
    }
  };
  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 320;
    }
  };

  // Resolve API Base URL for calls
  const getApiUrl = (path: string) => {
    const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';
    return `${API_BASE}${path}`;
  };

  // Add Comment API call
  const handleAddComment = async (e: React.FormEvent, wisataId: string) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(getApiUrl(`/api/wisata/${wisataId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: commentName, text: commentText })
      });
      if (res.ok) {
        setCommentText('');
        await fetchWisata(); // refresh database state
      } else {
        alert('Gagal mengirimkan komentar.');
      }
    } catch (err) {
      console.error(err);
      alert('Koneksi bermasalah.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Delete Comment API call (admin-only)
  const handleDeleteComment = async (wisataId: string, commentId: string) => {
    if (!window.confirm('Yakin ingin menghapus komentar ini?')) return;
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(getApiUrl(`/api/wisata/${wisataId}/comments/${commentId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        await fetchWisata(); // refresh database state
      } else {
        alert('Gagal menghapus komentar.');
      }
    } catch (err) {
      console.error(err);
      alert('Koneksi bermasalah.');
    }
  };

  const handleBuyWA = (phone: string, productName: string) => {
    const cleanPhone = phone.replace(/^0+/, '62');
    const message = `Halo, saya tertarik untuk membeli produk *${productName}* yang ada di website Desa Benjor. Apakah stoknya masih tersedia?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Demographic stats
  const demografiStats = [
    {
      id: 'total',
      label: 'Total Penduduk',
      value: infografis.penduduk.data.reduce((a, b) => a + b, 0).toLocaleString('id-ID'),
      unit: 'Jiwa',
      icon: '/tamang_files/total-penduduk-CXnnuYJa.png',
      color: 'bg-green-50 dark:bg-green-950/40 text-[#2D5A27] dark:text-green-400'
    },
    {
      id: 'laki',
      label: 'Laki-Laki',
      value: infografis.penduduk.data[0].toLocaleString('id-ID'),
      unit: 'Jiwa',
      icon: '/tamang_files/laki-qsjhxY_S.png',
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'perempuan',
      label: 'Perempuan',
      value: infografis.penduduk.data[1].toLocaleString('id-ID'),
      unit: 'Jiwa',
      icon: '/tamang_files/perempuan-CSZtJeWt.png',
      color: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400'
    },
    {
      id: 'kk',
      label: 'Kepala Keluarga',
      value: '435',
      unit: 'KK',
      icon: '/tamang_files/kepala-keluarga-BcdRTpvQ.png',
      color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
    },
    {
      id: 'sementara',
      label: 'Penduduk Sementara',
      value: '12',
      unit: 'Jiwa',
      icon: '/tamang_files/penduduk-sementara-P644cOda.png',
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
    },
    {
      id: 'mutasi',
      label: 'Mutasi Penduduk',
      value: '5',
      unit: 'Jiwa',
      icon: '/tamang_files/mutasi-penduduk-_1rO7gmp.png',
      color: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
    }
  ];

  const activeWisata = wisata.find(w => w.id === selectedWisataId);
  const activeWisataPhotos = activeWisata ? [activeWisata.image, ...(activeWisata.images || [])] : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      {/* Hero Slider - Cross-fade transition */}
      <section className="relative h-[75vh] md:h-screen w-full overflow-hidden bg-gray-950">
        <AnimatePresence>
          {sliderImages.map((img, index) => (
            index === currentSlide && (
              <motion.div
                key={img.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-black/60 z-10" />
                <motion.img 
                  src={img.url} 
                  alt={`Slide ${index + 1}`} 
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: 6, ease: "easeOut" }}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {/* Caption Card style layout with Framer Motion slide-in */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center items-start md:items-center text-left md:text-center px-6 md:px-12 pb-24 md:pb-0 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start md:items-center"
            >
              <span className="bg-[#2D5A27] text-white px-3.5 py-1.5 rounded-md text-xxs md:text-sm font-bold tracking-wider uppercase mb-5 shadow-sm border border-green-700/10">
                Sistem Informasi Digital
              </span>
              <h1 className="text-3xl md:text-6xl font-black text-white mb-5 md:mb-6 drop-shadow-md leading-tight tracking-tight max-w-5xl">
                Selamat Datang di <br className="hidden md:block"/>Website Resmi Desa Benjor
              </h1>
              <p className="text-sm md:text-xl text-gray-200/90 max-w-3xl drop-shadow-md mb-8 font-light leading-relaxed">
                Mewujudkan tata kelola pemerintahan desa yang mandiri, transparan, sejahtera, dan berbudaya berlandaskan gotong royong.
              </p>
              <div className="flex gap-3 md:gap-4 flex-wrap">
                <Link to="/profil" className="bg-[#2D5A27] hover:bg-green-700 text-white font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Profil Desa
                </Link>
                <Link to="/infografis" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  Data & Infografis
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-black/20 hover:bg-[#2D5A27] rounded-full text-white backdrop-blur-sm transition-all duration-300 shadow-md">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-black/20 hover:bg-[#2D5A27] rounded-full text-white backdrop-blur-sm transition-all duration-300 shadow-md">
          <ChevronRight size={24} />
        </button>

        {/* Carousel indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-[#2D5A27] w-8' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Sambutan Kades Section with premium layout */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800/65">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-52 h-52 md:w-64 md:h-64 flex-shrink-0 rounded-2xl shadow-md border-4 border-white dark:border-gray-850 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300"
          >
            <img 
              src={villageInfo.headImage} 
              alt={villageInfo.headName} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-bold text-[#2D5A27] dark:text-green-400 uppercase tracking-widest px-3 py-1 bg-green-50 dark:bg-green-950/40 rounded-md">
              Sambutan Kepala Desa
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4 mb-2 tracking-tight">
              {villageInfo.headName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">Kepala Desa Benjor, Kecamatan Tumpang</p>
            <div className="relative">
              <span className="absolute -top-6 -left-4 text-7xl text-green-150/40 dark:text-green-900/40 font-serif pointer-events-none">“</span>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic text-lg relative z-10 pl-2">
                {villageInfo.welcomeMessage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Administrasi Penduduk with 3D/Parallax background */}
      <section 
        className="relative py-24 px-4 overflow-hidden bg-cover bg-center bg-fixed bg-no-repeat border-y border-gray-100 dark:border-gray-850"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80')` }}
      >
        {/* Soft background overlay for text readability */}
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-950/92 z-0 backdrop-blur-[1px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2D5A27] dark:text-green-400 font-bold text-sm tracking-wider uppercase bg-green-50/50 dark:bg-green-950/30 px-3 py-1.5 rounded-lg border border-green-100/30">Statistik Kependudukan</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-4 tracking-tight">
              Administrasi Penduduk
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              Sistem pengelolaan data kependudukan digital untuk memberikan pelayanan publik yang efektif, efisien, dan transparan bagi seluruh warga Desa Benjor.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">
            {demografiStats.map((stat, index) => (
              <motion.div 
                key={stat.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white/95 dark:bg-gray-900/95 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 p-2 bg-gray-50 dark:bg-gray-850">
                  <img src={stat.icon} alt={stat.label} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  {stat.label}
                </h3>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="text-gray-400 text-xs font-medium">{stat.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Produk Unggulan Section - Unlocked with horizontal slide-scroll */}
      <section className="py-24 px-4 bg-gray-50/50 dark:bg-gray-950/60 relative overflow-hidden border-b border-gray-100 dark:border-gray-850">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2D5A27] dark:text-green-400 font-bold text-xs tracking-widest uppercase bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-md border border-green-100/50 dark:border-green-900/30">
              Ekonomi Kreatif
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-2 tracking-tight">
              Produk Unggulan Desa
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Geser ke samping untuk melihat produk ekonomi kreatif hasil karya warga Desa Benjor.
            </p>
          </div>

          {/* Cards Slider Wrapper */}
          <div className="relative group w-full px-4 md:px-10">
            {/* Navigation buttons */}
            <button 
              onClick={slideLeft} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button 
              onClick={slideRight} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight size={22} />
            </button>

            {/* Slider cards row */}
            <div 
              ref={sliderRef}
              className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {umkm.map((product) => (
                <div 
                  key={product.id}
                  className="w-[280px] sm:w-[320px] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-md dark:shadow-2xl border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between flex-shrink-0 snap-center transform hover:-translate-y-1.5 transition-all duration-300"
                >
                  <Link to={`/umkm/${product.id}`} className="relative h-44 sm:h-52 overflow-hidden bg-gray-100 dark:bg-gray-800 block flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xxs font-bold text-[#2D5A27] dark:text-green-400 shadow-sm border dark:border-gray-800">
                      {product.category}
                    </div>
                  </Link>
                  <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between overflow-hidden">
                    <div className="overflow-hidden">
                      <Link to={`/umkm/${product.id}`} className="block hover:text-[#2D5A27] dark:hover:text-green-400 transition-colors">
                        <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white mb-1 leading-snug line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-[#2D5A27] dark:text-green-400 font-black text-base sm:text-lg mb-2">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xxs sm:text-xs line-clamp-3 leading-relaxed mb-4">{product.description}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-xxs text-gray-400 dark:text-gray-500 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                        <span>Pemilik: <strong className="text-gray-600 dark:text-gray-300 font-semibold">{product.owner}</strong></span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <Link 
                          to={`/umkm/${product.id}`}
                          className="flex items-center justify-center gap-1 border border-gray-200 dark:border-gray-700 hover:border-[#2D5A27] dark:hover:border-green-500 text-gray-700 dark:text-gray-300 hover:text-[#2D5A27] dark:hover:text-green-400 font-bold py-2 px-3 rounded-xl transition-colors text-xxs"
                        >
                          <Eye size={12} />
                          Detail
                        </Link>
                        <button 
                          onClick={() => handleBuyWA(product.wa, product.name)}
                          className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 px-3 rounded-xl transition-colors text-xxs shadow-sm hover:shadow"
                        >
                          <MessageCircle size={12} />
                          Beli via WA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kabar Berita Section (Animated Cards) */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <span className="text-[#2D5A27] dark:text-green-400 font-semibold text-sm tracking-wider uppercase">Portal Informasi</span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2 mb-2 tracking-tight">Kabar Desa Terbaru</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Berita, kegiatan masyarakat, and pengumuman resmi Desa Benjor.</p>
          </div>
          <Link to="/berita" className="bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-gray-800 text-[#2D5A27] dark:text-green-400 border border-gray-200 dark:border-gray-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-300">
            Lihat Semua Kabar &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {berita.slice(0, 3).map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800/80 hover:shadow-lg transition-all duration-300 group flex flex-col h-full cursor-pointer"
            >
              <div className="h-52 overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-[#2D5A27] dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-md shadow-sm border dark:border-gray-800">
                  {item.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-3">
                  {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white group-hover:text-[#2D5A27] dark:group-hover:text-green-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {item.summary}
                </p>
                <Link to={`/berita/${item.id}`} className="text-[#2D5A27] dark:text-green-400 text-sm font-semibold hover:underline mt-auto flex items-center gap-1.5">
                  Baca Selengkapnya
                  <span className="text-xs group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Wisata Desa Benjor section (previously Galeri) with Parallax background */}
      <section 
        className="relative py-24 px-4 overflow-hidden bg-cover bg-center bg-fixed bg-no-repeat border-t border-gray-100 dark:border-gray-850"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1920&q=80')` }}
      >
        {/* Soft background overlay */}
        <div className="absolute inset-0 bg-white/92 dark:bg-gray-950/93 z-0 backdrop-blur-[1px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <span className="text-[#2D5A27] dark:text-green-400 font-bold text-sm tracking-wider uppercase bg-green-50/50 dark:bg-green-950/30 px-3 py-1.5 rounded-lg border border-green-100/30">Pesona Wisata</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 mb-4 tracking-tight">
                Wisata Desa Benjor
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                Menampilkan keindahan alam, destinasi wisata unggulan, dan keasrian lingkungan di Desa Benjor.
              </p>
            </div>
            <Link to="/galeri" className="bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-gray-850 text-[#2D5A27] dark:text-green-400 border border-gray-200 dark:border-gray-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-300">
              Lihat Lainnya &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {wisata.slice(0, 8).map((spot) => (
              <motion.div 
                key={spot.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  setSelectedWisataId(spot.id);
                  setActivePhotoIdx(0);
                }}
                className="relative h-56 rounded-2xl overflow-hidden group shadow-md border border-gray-150 dark:border-gray-800/80 cursor-pointer"
              >
                <img src={spot.image} alt={spot.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
                  <p className="text-white text-sm font-semibold tracking-wide leading-relaxed">
                    {spot.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Peta Wilayah Desa */}
      <section className="bg-gray-50 dark:bg-gray-950 py-24 px-4 border-t border-gray-100 dark:border-gray-850 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2D5A27] dark:text-green-400 font-semibold text-sm tracking-wider uppercase">Wilayah Geografis</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4 tracking-tight">
              Peta Lokasi Desa Benjor
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Peta batas wilayah administratif Desa Benjor, Kecamatan Tumpang, Kabupaten Malang.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-3 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-[450px] w-full overflow-hidden">
            <iframe 
              src={villageInfo.mapEmbedUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Wisata Detail Popup Modal with comments CRUD */}
      <AnimatePresence>
        {selectedWisataId && activeWisata && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8 relative border dark:border-gray-800"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedWisataId(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-250 dark:hover:bg-gray-700 transition-colors z-20"
              >
                <X size={20} />
              </button>

              {/* Left Side: Photo slideshow gallery */}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative shadow">
                  <img 
                    src={activeWisataPhotos[activePhotoIdx]} 
                    alt={activeWisata.title} 
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>
                {/* Thumbnails row */}
                {activeWisataPhotos.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {activeWisataPhotos.map((photo, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          activePhotoIdx === i 
                            ? 'border-[#2D5A27] dark:border-green-500 scale-95 shadow-sm' 
                            : 'border-transparent opacity-65 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Information & Comments */}
              <div className="w-full md:w-1/2 flex flex-col justify-between max-h-[50vh] md:max-h-full">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-xs text-[#2D5A27] dark:text-green-400 font-bold uppercase tracking-wider">
                    <MapPin size={14} />
                    <span>Wisata Desa Benjor</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                    {activeWisata.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pb-4 border-b border-gray-100 dark:border-gray-800">
                    {activeWisata.desc}
                  </p>
                </div>

                {/* Comments List Section */}
                <div className="flex-grow flex flex-col gap-4 mt-4 overflow-hidden">
                  <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-200">
                    Diskusi / Komentar ({activeWisata.comments?.length || 0})
                  </h4>
                  
                  {/* Comments Scroll area */}
                  <div className="flex-grow overflow-y-auto max-h-56 pr-2 flex flex-col gap-3 scrollbar-thin">
                    {activeWisata.comments && activeWisata.comments.length > 0 ? (
                      activeWisata.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-850 p-3.5 rounded-2xl relative group/item border border-gray-100/50 dark:border-gray-800/40">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-gray-900 dark:text-white">{comment.name}</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{comment.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{comment.text}</p>
                          
                          {/* Admin delete comment option */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteComment(activeWisata.id, comment.id)}
                              className="absolute top-2.5 right-2.5 p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors opacity-0 group-hover/item:opacity-100 cursor-pointer"
                              title="Hapus komentar"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-gray-550 italic py-4 text-center">Belum ada komentar. Jadilah yang pertama memberikan pendapat!</p>
                    )}
                  </div>

                  {/* Add comment Form */}
                  <form onSubmit={(e) => handleAddComment(e, activeWisata.id)} className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nama Anda"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        required
                        className="w-1/3 text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-55 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#2D5A27] dark:focus:border-green-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Tulis pendapat/komentar Anda..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        className="w-2/3 text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-55 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#2D5A27] dark:focus:border-green-500"
                      />
                      <button 
                        type="submit" 
                        disabled={isSubmittingComment}
                        className="bg-[#2D5A27] hover:bg-green-700 text-white font-bold p-2.5 rounded-xl transition-all shadow hover:shadow-md disabled:opacity-50 flex items-center justify-center cursor-pointer"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// SVG static mesh background for maximum scrolling performance (0 FPS drop, 0 repaint cost)
const BubbleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-green-100/10 dark:bg-green-950/10 filter blur-3xl opacity-75" />
    <div className="absolute bottom-[-10%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-green-50/15 dark:bg-green-900/5 filter blur-3xl opacity-80" />
  </div>
);

export default Home;
