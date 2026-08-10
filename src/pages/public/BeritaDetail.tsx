import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Calendar, Tag, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const BeritaDetail = () => {
  const { id } = useParams();
  const { berita } = useAppContext();
  
  const article = berita.find(b => b.id === id);

  if (!article) {
    return <Navigate to="/berita" replace />;
  }

  // Combine main image with additional photos
  const allImages = article.images && article.images.length > 0 
    ? [article.image, ...article.images] 
    : [article.image];

  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto sliding logic
  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
    }, 4000); // Slide every 4 seconds
    return () => clearInterval(interval);
  }, [allImages.length]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-955 text-gray-850 dark:text-gray-100 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/berita" className="inline-flex items-center text-sm font-semibold text-gray-505 hover:text-[#2D5A27] dark:hover:text-green-400 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Berita
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 transition-colors">
          {/* Multi-Photo Slideshow Section (Uses object-contain to avoid image crop) */}
          <div className="h-64 sm:h-[480px] w-full relative bg-gray-950 group">
            <img 
              src={allImages[currentIdx]} 
              alt={`${article.title} - Foto ${currentIdx + 1}`} 
              className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
                currentIdx === 0 && article.align
                  ? article.align === 'top' ? 'object-top' :
                    article.align === 'bottom' ? 'object-bottom' : 'object-center'
                  : 'object-center'
              }`}
            />
            
            {allImages.length > 1 && (
              <>
                {/* Arrow navigation overlay buttons */}
                <button
                  onClick={() => setCurrentIdx(prev => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-[#2D5A27] text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10 cursor-pointer backdrop-blur-xs"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentIdx(prev => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-[#2D5A27] text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10 cursor-pointer backdrop-blur-xs"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Counter indicator */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm z-10">
                  {currentIdx + 1} / {allImages.length}
                </div>

                {/* Dot indicator navigation overlays */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === currentIdx ? 'bg-[#2D5A27] w-6' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="p-6 sm:p-10 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-450 mb-6">
              <div className="flex items-center gap-1">
                <Tag size={16} className="text-[#2D5A27] dark:text-green-400" />
                <span className="font-semibold text-[#2D5A27] dark:text-green-400">{article.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {article.title}
            </h1>
            
            <div className="prose max-w-none text-gray-750 dark:text-gray-300 leading-relaxed text-justify text-base">
              {/* Main content display */}
              {article.content ? (
                article.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))
              ) : (
                article.summary.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BeritaDetail;
