import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, ChevronLeft, ChevronRight, X, Send, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const Galeri = () => {
  const { wisata, fetchWisata } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWisataId, setSelectedWisataId] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const itemsPerPage = 10;
  const isAdmin = !!localStorage.getItem('admin_token');

  // Pagination calculation
  const totalPages = Math.ceil(wisata.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWisata = wisata.slice(startIndex, startIndex + itemsPerPage);

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

  const activeWisata = wisata.find(w => w.id === selectedWisataId);
  const activeWisataPhotos = activeWisata ? [activeWisata.image, ...(activeWisata.images || [])] : [];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#2D5A27] dark:hover:text-green-400 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2D5A27] dark:text-green-400 border border-green-100 dark:border-green-900/30 shadow-sm">
            <Camera size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Wisata Desa Benjor</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Menjelajahi pesona keindahan alam, potensi wisata, dan dokumentasi keasrian Desa Benjor.</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paginatedWisata.map((spot) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => {
                setSelectedWisataId(spot.id);
                setActivePhotoIdx(0);
              }}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100/80 dark:border-gray-800 group cursor-pointer flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                <img 
                  src={spot.image} 
                  alt={spot.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-[#2D5A27] dark:group-hover:text-green-400 transition-colors line-clamp-1">
                    {spot.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {spot.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#2D5A27] dark:text-green-400 font-semibold mt-auto">
                  <MapPin size={14} />
                  <span>Desa Benjor, Malang</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Pagination Control */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200/60 dark:border-gray-800 pt-8 gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Menampilkan <span className="font-bold text-gray-800 dark:text-white">{startIndex + 1}</span> - <span className="font-bold text-gray-800 dark:text-white">{Math.min(startIndex + itemsPerPage, wisata.length)}</span> dari <span className="font-bold text-gray-800 dark:text-white">{wisata.length}</span> objek wisata
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#2D5A27] dark:hover:border-green-500 hover:text-[#2D5A27] dark:hover:text-green-400 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors shadow-sm cursor-pointer"
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
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#2D5A27] dark:hover:border-green-500 hover:text-[#2D5A27] dark:hover:text-green-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#2D5A27] dark:hover:border-green-500 hover:text-[#2D5A27] dark:hover:text-green-400 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

      </div>

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
                            <span className="text-[10px] text-gray-400 dark:text-gray-550 font-medium">{comment.date}</span>
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
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic py-4 text-center">Belum ada komentar. Jadilah yang pertama memberikan pendapat!</p>
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
                        className="w-1/3 text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#2D5A27] dark:focus:border-green-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Tulis pendapat/komentar Anda..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        className="w-2/3 text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-white focus:outline-none focus:border-[#2D5A27] dark:focus:border-green-500"
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

export default Galeri;
