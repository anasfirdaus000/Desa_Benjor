import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

const BeritaDetail = () => {
  const { id } = useParams();
  const { berita } = useAppContext();
  
  const article = berita.find(b => b.id === id);

  if (!article) {
    return <Navigate to="/berita" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-850 dark:text-gray-100 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/berita" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#2D5A27] dark:hover:text-green-400 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Berita
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="h-64 sm:h-96 w-full relative">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-450 mb-6">
              <div className="flex items-center gap-1">
                <Tag size={16} className="text-[#2D5A27] dark:text-green-400" />
                <span className="font-medium text-[#2D5A27] dark:text-green-400">{article.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
              {article.title}
            </h1>
            
            <div className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
              {article.summary.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
              <p className="mb-4">
                Pemerintah Desa Benjor terus berkomitmen untuk memberikan pelayanan terbaik bagi masyarakat dan memajukan potensi desa. Dukungan dari seluruh elemen masyarakat sangat diharapkan untuk mencapai visi dan misi desa.
              </p>
              <p className="mb-4">
                Kegiatan ini merupakan salah satu wujud nyata dari program kerja yang telah disusun dan disepakati bersama. Diharapkan ke depannya, akan lebih banyak lagi inovasi dan terobosan yang dapat meningkatkan kesejahteraan warga Desa Benjor.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BeritaDetail;
