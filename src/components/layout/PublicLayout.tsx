import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Mail, Phone } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const PublicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGrandIntro, setShowGrandIntro] = useState(false);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const location = useLocation();
  const { villageInfo } = useAppContext();

  useEffect(() => {
    const lastVisit = localStorage.getItem('last_visit_benjor');
    const now = Date.now();
    
    // Play grand intro if first time or visited > 10 minutes ago (600,000 ms)
    if (!lastVisit || now - Number(lastVisit) > 600000) {
      setShowGrandIntro(true);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setShowGrandIntro(false);
        setIsIntroFinished(true);
        document.body.style.overflow = '';
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsIntroFinished(true);
    }
    localStorage.setItem('last_visit_benjor', String(now));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect to home if page is refreshed / reloaded from scratch
  useEffect(() => {
    if (location.pathname !== '/') {
      window.location.replace('/');
    }
  }, []);

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Profil Desa', path: '/profil' },
    { name: 'UMKM Desa', path: '/umkm' },
    { name: 'Infografis', path: '/infografis' },
    { name: 'Berita', path: '/berita' },
    { name: 'Galeri Wisata', path: '/galeri' },
  ];

  const isHome = location.pathname === '/';
  const useTransparent = isHome && !isScrolled;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50/50">
      {/* Grand Opening Intro overlay */}
      <AnimatePresence>
        {showGrandIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-[#2D5A27] z-[9999] flex flex-col items-center justify-center text-center p-6"
          >
            {/* Spinning decorative background */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none"
            />
            
            {/* Shared Layout Logo */}
            <motion.div 
              layoutId="village-logo"
              className="w-24 h-24 rounded-full bg-white text-[#2D5A27] flex items-center justify-center font-black text-5xl shadow-2xl mb-6 relative z-10"
              initial={{ scale: 0.4, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            >
              B
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-white text-3xl md:text-4xl font-black tracking-widest uppercase z-10"
            >
              DESA BENJOR
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-green-100 text-sm mt-3 tracking-wider font-semibold z-10 uppercase"
            >
              Kecamatan Tumpang • Kabupaten Malang
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navbar Wrapper */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useTransparent 
          ? 'bg-transparent text-white' 
          : 'bg-white shadow-md'
      }`}>
        {/* Main Navbar */}
        <nav className={`transition-all duration-300 ${
          useTransparent ? 'bg-transparent border-b border-white/10' : 'bg-white border-b border-gray-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-3">
                  <motion.div 
                    layoutId="village-logo"
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors duration-300 ${
                      useTransparent ? 'bg-white text-[#2D5A27]' : 'bg-[#2D5A27] text-white'
                    }`}
                  >
                    B
                  </motion.div>
                  <div>
                    <h1 className={`font-extrabold text-lg leading-tight transition-colors duration-300 ${
                      useTransparent ? 'text-white' : 'text-[#2D5A27]'
                    }`}>
                      DESA BENJOR
                    </h1>
                    <p className={`text-xxs transition-colors duration-300 ${
                      useTransparent ? 'text-green-100' : 'text-gray-400'
                    }`}>
                      Kabupaten Malang
                    </p>
                  </div>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                      useTransparent
                        ? location.pathname === link.path
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                        : location.pathname === link.path
                          ? 'bg-green-50 text-[#2D5A27]'
                          : 'text-gray-700 hover:bg-green-50 hover:text-[#2D5A27]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Admin Login Button next to links */}
                <div className="pl-4">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 border ${
                      useTransparent
                        ? 'border-white/40 hover:bg-white text-white hover:text-[#2D5A27]'
                        : 'border-[#2D5A27] bg-[#2D5A27] hover:bg-green-700 text-white hover:shadow'
                    }`}
                  >
                    Admin Login
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-md transition-colors ${
                    useTransparent 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:text-[#2D5A27] hover:bg-green-50'
                  }`}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden border-t ${useTransparent ? 'bg-black/90 backdrop-blur-md border-white/10' : 'bg-white'}`}>
              <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-semibold transition-colors ${
                      useTransparent
                        ? location.pathname === link.path
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                        : location.pathname === link.path
                          ? 'bg-green-50 text-[#2D5A27]'
                          : 'text-gray-700 hover:bg-green-50 hover:text-[#2D5A27]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Admin Login in Mobile Menu */}
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-bold transition-colors ${
                    useTransparent
                      ? 'text-green-300 hover:bg-white/10 hover:text-white'
                      : 'text-[#2D5A27] hover:bg-green-50'
                  }`}
                >
                  Admin Login
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main content body (Home page has pt-0 so hero goes full screen, subpages have pt-20 to clear navbar) */}
      <main className={`flex-grow ${isHome ? 'pt-0' : 'pt-20'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2D5A27] font-bold text-xl">
                  B
                </div>
                <h2 className="text-xl font-bold">Desa Benjor</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sistem Informasi Desa Benjor, Kecamatan Tumpang, Kabupaten Malang. Mewujudkan pelayanan desa digital yang efisien, transparan, dan terpercaya.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Tautan Cepat</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
                <li><Link to="/profil" className="hover:text-white transition-colors">Profil Desa</Link></li>
                <li><Link to="/umkm" className="hover:text-white transition-colors">UMKM Desa</Link></li>
                <li><Link to="/infografis" className="hover:text-white transition-colors">Infografis</Link></li>
                <li><Link to="/berita" className="hover:text-white transition-colors">Berita Desa</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Kontak</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><MapPin size={16} className="text-[#2D5A27]" /> {villageInfo.contact.address}</li>
                <li className="flex items-center gap-2"><Mail size={16} className="text-[#2D5A27]" /> {villageInfo.contact.email}</li>
                <li className="flex items-center gap-2"><Phone size={16} className="text-[#2D5A27]" /> {villageInfo.contact.phone}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Pemerintah Desa Benjor. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Short Wipe Curtain Page Transition Overlay for Menu Navigation */}
      {isIntroFinished && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`wipe-${location.pathname}`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.45, 1], ease: "easeInOut" }}
            style={{ originY: 1 }}
            className="fixed inset-0 bg-[#2D5A27] z-[99999] pointer-events-none"
          />
        </AnimatePresence>
      )}
    </div>
  );
};

export default PublicLayout;
