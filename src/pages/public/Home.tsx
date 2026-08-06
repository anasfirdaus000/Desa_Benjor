import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, BookOpen, Heart, TrendingUp, Sparkles, ShoppingBag, ArrowRight, MessageCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// Floating animated background elements
const BubbleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-green-50/20 via-white to-green-100/10">
    {/* Static mesh gradients optimized for 60fps rendering without expensive runtime recalculations */}
    <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-green-100/20 filter blur-3xl opacity-75" />
    <div className="absolute bottom-[-10%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-green-50/30 filter blur-3xl opacity-80" />
    <div className="absolute top-1/3 left-1/4 w-[50vw] h-[50vw] rounded-full bg-green-100/10 filter blur-3xl opacity-40" />
  </div>
);

const Home = () => {
  const { sliderImages, villageInfo, berita, infografis, umkm } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Screen size checker for responsive animation configurations
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Setup scroll-lock effect for vertical stacking of Produk Unggulan
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // --- MOTION TRANSFORMS DEFINITIONS ---

  // 1. Mobile Motion Transforms (Clean slide-out to top, slide-in from bottom to avoid stacking clutter)
  // Card 0 (First product): active initially, slides out to top on scroll down
  const mY0 = useTransform(scrollYProgress, [0.15, 0.45], [0, -600]);
  const mOpacity0 = useTransform(scrollYProgress, [0.15, 0.45], [1, 0]);

  // Card 1 (Second product): slides in from bottom, active, slides out to top on scroll down
  const mY1 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [600, 0, 0, -600]);
  const mOpacity1 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [0, 1, 1, 0]);

  // Card 2 (Third product): slides in from bottom, active, stays centered
  const mY2 = useTransform(scrollYProgress, [0.55, 0.85], [600, 0]);
  const mOpacity2 = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);

  // 2. Desktop Motion Transforms (Fanned out card deck sliding using vw units to prevent screen edge overflow)
  // Card 0: starts in center, slides left-down out of view
  const dX0 = useTransform(scrollYProgress, [0.15, 0.45], ["0vw", "-50vw"]);
  const dY0 = useTransform(scrollYProgress, [0.15, 0.45], [0, 30]);
  const dRotate0 = useTransform(scrollYProgress, [0.15, 0.45], [0, -10]);
  const dOpacity0 = useTransform(scrollYProgress, [0.15, 0.45], [1, 0]);

  // Card 1: starts in mid-right fanned position, slides to center, slides left-down out of view
  const dX1 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], ["22vw", "0vw", "0vw", "-50vw"]);
  const dY1 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [30, 0, 0, 30]);
  const dRotate1 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [5, 0, 0, -10]);
  const dOpacity1 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [0.65, 1, 1, 0]);

  // Card 2: starts in far-right fanned position, slides to mid-right, slides to center
  const dX2 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], ["44vw", "22vw", "22vw", "0vw"]);
  const dY2 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [60, 30, 30, 0]);
  const dRotate2 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [10, 5, 5, 0]);
  const dOpacity2 = useTransform(scrollYProgress, [0.15, 0.45, 0.55, 0.85], [0.35, 0.65, 0.65, 1]);

  // Sync scroll progress with indicator dots
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.4) {
      setActiveCard(0);
    } else if (latest >= 0.4 && latest < 0.75) {
      setActiveCard(1);
    } else {
      setActiveCard(2);
    }
  });

  // Slider timing effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const nextSlide = () => setCurrentSlide(currentSlide === sliderImages.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? sliderImages.length - 1 : currentSlide - 1);

  // Demographic stats based on the Tamang DIGIDES card layout
  const demografiStats = [
    {
      id: 'total',
      label: 'Total Penduduk',
      value: infografis.penduduk.data.reduce((a, b) => a + b, 0).toLocaleString('id-ID'),
      unit: 'Jiwa',
      icon: '/tamang_files/total-penduduk-CXnnuYJa.png',
      color: 'bg-green-50 text-[#2D5A27]'
    },
    {
      id: 'laki',
      label: 'Laki-Laki',
      value: infografis.penduduk.data[0].toLocaleString('id-ID'),
      unit: 'Jiwa',
      icon: '/tamang_files/laki-qsjhxY_S.png',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'perempuan',
      label: 'Perempuan',
      value: infografis.penduduk.data[1].toLocaleString('id-ID'),
      unit: 'Jiwa',
      icon: '/tamang_files/perempuan-CSZtJeWt.png',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      id: 'kk',
      label: 'Kepala Keluarga',
      value: '435',
      unit: 'KK',
      icon: '/tamang_files/kepala-keluarga-BcdRTpvQ.png',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 'sementara',
      label: 'Penduduk Sementara',
      value: '12',
      unit: 'Jiwa',
      icon: '/tamang_files/penduduk-sementara-P644cOda.png',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'mutasi',
      label: 'Mutasi Penduduk',
      value: '5',
      unit: 'Jiwa',
      icon: '/tamang_files/mutasi-penduduk-_1rO7gmp.png',
      color: 'bg-red-50 text-red-600'
    }
  ];

  // 8 Tourism Images for the Home section
  const galeriWisata = [
    { title: 'Wisata Siling Kanu - Air Terjun', image: '/tamang_files/000eb415acb85e5560517e3dc2775072.jpg' },
    { title: 'Wisata Bukit Bongku - Puncak Awan', image: '/tamang_files/f26e073b8124a077d194a810e3f2f3a1.jpg' },
    { title: 'Lembah Benjor - Panorama Hijau', image: '/tamang_files/25305b13929576d65d9296b09ddb4b2c.jpg' },
    { title: 'Hutan Lindung Desa - Keasrian Alami', image: '/tamang_files/aaf8b88f7a33350eaa289c6ed07d0bc1.jpeg' },
    { title: 'Sungai Bersih - Hulu Air Pegunungan', image: '/tamang_files/1f8fa6396f6bd336ad793a4c88e37e18.jpeg' },
    { title: 'Area Camping Ground Pinus', image: '/tamang_files/2536e945bc9b6bde053777264de2b75f.jpeg' },
    { title: 'Agrowisata Pertanian Terpadu', image: '/tamang_files/a6085185b28d0ded30d077c9c80e27f7.jpg' },
    { title: 'Pesona Jeram Air Terjun Mini', image: '/tamang_files/8d94257a2f2d6703d03fb0385cb775e0.jpeg' }
  ];

  // Helper to fetch responsive motion styles for product cards
  const getCardStyle = (index: number) => {
    if (isMobile) {
      if (index === 0) return { y: mY0, opacity: mOpacity0, zIndex: 10 };
      if (index === 1) return { y: mY1, opacity: mOpacity1, zIndex: 20 };
      return { y: mY2, opacity: mOpacity2, zIndex: 30 };
    } else {
      if (index === 0) return { x: dX0, y: dY0, rotate: dRotate0, opacity: dOpacity0, zIndex: 10 };
      if (index === 1) return { x: dX1, y: dY1, rotate: dRotate1, opacity: dOpacity1, zIndex: 20 };
      return { x: dX2, y: dY2, rotate: dRotate2, opacity: dOpacity2, zIndex: 30 };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
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
        <div className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100/80">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-52 h-52 md:w-64 md:h-64 flex-shrink-0 rounded-2xl shadow-md border-4 border-white overflow-hidden transform hover:scale-[1.02] transition-transform duration-300"
          >
            <img 
              src={villageInfo.headImage} 
              alt={villageInfo.headName} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-bold text-[#2D5A27] uppercase tracking-widest px-3 py-1 bg-green-50 rounded-md">
              Sambutan Kepala Desa
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2 tracking-tight">
              {villageInfo.headName}
            </h2>
            <p className="text-sm text-gray-500 font-medium mb-6">Kepala Desa Benjor, Kecamatan Tumpang</p>
            <div className="relative">
              <span className="absolute -top-6 -left-4 text-7xl text-green-100 font-serif pointer-events-none">“</span>
              <p className="text-gray-600 leading-relaxed italic text-lg relative z-10 pl-2">
                {villageInfo.welcomeMessage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Administrasi Penduduk with Floating Animation Elements */}
      <section className="bg-white py-24 px-4 border-y border-gray-100 relative overflow-hidden">
        <BubbleBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2D5A27] font-semibold text-sm tracking-wider uppercase">Statistik Kependudukan</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
              Administrasi Penduduk
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
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
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 p-2 bg-gray-50">
                  <img src={stat.icon} alt={stat.label} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  {stat.label}
                </h3>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-2xl font-extrabold text-gray-900">{stat.value}</span>
                  <span className="text-gray-400 text-xs font-medium">{stat.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pinned Stacking/Fanning Produk Unggulan Section (Fanned playing cards transition on scroll) */}
      <div ref={targetRef} className="relative h-[220vh] bg-gray-50/50 overflow-visible z-30">
        {/* Sticky viewport container with pt-20 to clear fixed navbar and avoid overlapping */}
        <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden z-10 w-full pt-20 px-4 md:px-0">
          <BubbleBackground />
          
          {/* Header block (static pinned with responsive typography to avoid overlap on mobile) */}
          <div className="max-w-4xl mx-auto w-full px-4 mb-2 md:mb-6 relative z-20 text-center flex-shrink-0">
            <span className="text-[#2D5A27] font-bold text-xxs md:text-xs tracking-widest uppercase bg-green-50 px-2.5 py-1 rounded-md border border-green-100/50">
              Ekonomi Kreatif
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-1 md:mb-2 tracking-tight">
              Produk Unggulan Desa <span className="text-xs font-bold bg-[#2D5A27] text-white px-2 py-0.5 rounded-full align-middle ml-1 animate-pulse">Skrol Kebawah</span>
            </h2>
          </div>

          {/* Cards Stack/Fan Container - overflow-visible is required for fanning offsets on desktop */}
          <div className="relative w-full max-w-[340px] md:max-w-4xl h-[400px] md:h-[480px] mx-auto mt-2 md:mt-4 flex items-center justify-center overflow-visible">
            {umkm.slice(0, 3).map((product, index) => {
              const handleBuyWA = (phone: string, productName: string) => {
                const cleanPhone = phone.replace(/^0+/, '62');
                const message = `Halo, saya tertarik untuk membeli produk *${productName}* yang ada di website Desa Benjor. Apakah stoknya masih tersedia?`;
                window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
              };

              return (
                <motion.div 
                  key={product.id} 
                  style={getCardStyle(index)}
                  className="absolute w-[88vw] sm:w-[330px] md:w-[320px] h-[380px] md:h-[470px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col justify-between flex-shrink-0"
                >
                  <Link to={`/umkm/${product.id}`} className="relative h-44 md:h-56 overflow-hidden bg-gray-100 block flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xxs md:text-xs font-bold text-[#2D5A27] shadow-sm">
                      {product.category}
                    </div>
                  </Link>
                  <div className="p-4 md:p-6 flex-grow flex flex-col justify-between overflow-hidden">
                    <div className="overflow-hidden">
                      <Link to={`/umkm/${product.id}`} className="block hover:text-[#2D5A27] transition-colors">
                        <h3 className="font-extrabold text-sm md:text-lg text-gray-900 mb-1 leading-snug line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-[#2D5A27] font-black text-base md:text-xl mb-1 md:mb-2">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-gray-500 text-xxs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed mb-2 md:mb-4">{product.description}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-xxs text-gray-400 mb-3 pb-2 border-b border-gray-100">
                        <span>Pemilik: <strong className="text-gray-600 font-semibold">{product.owner}</strong></span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <Link 
                          to={`/umkm/${product.id}`}
                          className="flex items-center justify-center gap-1 border border-gray-200 hover:border-[#2D5A27] text-gray-700 hover:text-[#2D5A27] font-bold py-2 px-3 rounded-xl transition-colors text-xxs md:text-xs"
                        >
                          <Eye size={12} />
                          Detail
                        </Link>
                        <button 
                          onClick={() => handleBuyWA(product.wa, product.name)}
                          className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 px-3 rounded-xl transition-colors text-xxs md:text-xs shadow-sm hover:shadow"
                        >
                          <MessageCircle size={12} />
                          Beli via WA
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Scroll progress dots inside viewport */}
          <div className="flex gap-2.5 mt-6 md:mt-8 relative z-20 flex-shrink-0">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full transition-all duration-300 border-2 ${
                  idx === activeCard 
                    ? "bg-[#2D5A27] border-[#2D5A27] scale-110 md:scale-125 shadow-md" 
                    : "bg-white border-gray-300 scale-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Kabar Berita Section (Animated Cards) */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full relative z-10 border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <span className="text-[#2D5A27] font-semibold text-sm tracking-wider uppercase">Portal Informasi</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-2 tracking-tight">Kabar Desa Terbaru</h2>
            <p className="text-gray-500 text-sm">Berita, kegiatan masyarakat, and pengumuman resmi Desa Benjor.</p>
          </div>
          <Link to="/berita" className="bg-white hover:bg-green-50 text-[#2D5A27] border border-gray-200 font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-300">
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
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col h-full cursor-pointer"
            >
              <div className="h-52 overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#2D5A27] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs text-gray-400 font-medium mb-3">
                  {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-[#2D5A27] transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {item.summary}
                </p>
                <Link to={`/berita/${item.id}`} className="text-[#2D5A27] text-sm font-semibold hover:underline mt-auto flex items-center gap-1.5">
                  Baca Selengkapnya
                  <span className="text-xs group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Galeri Wisata Desa with 8 Images & "Lihat Lainnya" Redirect link */}
      <section className="py-24 px-4 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <span className="text-[#2D5A27] font-semibold text-sm tracking-wider uppercase">Pesona Wisata</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
                Galeri Wisata Desa
              </h2>
              <p className="text-gray-500 text-base">
                Menampilkan keindahan alam, destinasi wisata unggulan, dan keasrian lingkungan di Desa Benjor.
              </p>
            </div>
            <Link to="/galeri" className="bg-white hover:bg-green-50 text-[#2D5A27] border border-gray-200 font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-300">
              Lihat Lainnya &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {galeriWisata.map((spot, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="relative h-56 rounded-2xl overflow-hidden group shadow-sm border border-gray-100 cursor-pointer"
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
      <section className="bg-gray-50 py-24 px-4 border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2D5A27] font-semibold text-sm tracking-wider uppercase">Wilayah Geografis</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
              Peta Lokasi Desa Benjor
            </h2>
            <p className="text-gray-500 text-base">
              Peta batas wilayah administratif Desa Benjor, Kecamatan Tumpang, Kabupaten Malang.
            </p>
          </div>
          <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-100 h-[450px] w-full overflow-hidden">
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
    </div>
  );
};

export default Home;
