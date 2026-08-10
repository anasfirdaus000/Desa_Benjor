import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, MessageCircle } from 'lucide-react';

const UmkmDetail = () => {
  const { id } = useParams();
  const { umkm } = useAppContext();
  
  const product = umkm.find(item => item.id === id);

  if (!product) {
    return <Navigate to="/umkm" replace />;
  }

  // Get other products for recommendation
  const otherProducts = umkm.filter(item => item.id !== id).slice(0, 3);

  const handleBuyWA = (phone: string, productName: string) => {
    const cleanPhone = phone.replace(/^0+/, '62');
    const message = `Halo, saya tertarik untuk membeli produk *${productName}* yang ada di website Desa Benjor. Apakah stoknya masih tersedia?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-850 dark:text-gray-100 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link to="/umkm" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#2D5A27] dark:hover:text-green-400 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Katalog UMKM
        </Link>

        {/* Product Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100/80 dark:border-gray-800 mb-12 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-12">
            
            {/* Image Column */}
            <div className="w-full h-80 sm:h-96 md:h-[450px] rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-inner flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain bg-gray-50 dark:bg-gray-800 p-2 transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            
            {/* Details Column */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category tag */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-50 dark:bg-green-950/40 text-[#2D5A27] dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-md shadow-sm border border-green-100/30 dark:border-green-900/30 uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
                
                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
                  {product.name}
                </h1>
                
                {/* Price */}
                <p className="text-[#2D5A27] dark:text-green-400 font-extrabold text-3xl mb-6">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                
                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-800 my-6" />
                
                {/* Description */}
                <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Deskripsi Produk</h3>
                <p className="text-gray-650 dark:text-gray-300 leading-relaxed text-base mb-8 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
              
              {/* Buy & Owner card */}
              <div className="bg-gray-50 dark:bg-gray-850 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 mt-auto">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[#2D5A27] dark:text-green-400 font-bold border border-gray-100 dark:border-gray-700 shadow-sm">
                    👤
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Pemilik Usaha</p>
                    <p className="text-sm font-bold text-gray-850 dark:text-white">{product.owner}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleBuyWA(product.wa, product.name)}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <MessageCircle size={20} />
                  Hubungi via WhatsApp
                </button>
              </div>
              
            </div>
            
          </div>
        </div>

        {/* Other Products Section */}
        {otherProducts.length > 0 && (
          <div>
            <div className="border-t border-gray-200/60 dark:border-gray-800 pt-12 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Produk Lainnya</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Temukan juga produk menarik lainnya dari warga Benjor.</p>
              </div>
              <Link to="/umkm" className="text-[#2D5A27] dark:text-green-400 font-semibold text-sm hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProducts.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-[#2D5A27] dark:text-green-450 shadow-sm border dark:border-gray-800">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-[#2D5A27] dark:group-hover:text-green-400 transition-colors line-clamp-1">{item.name}</h3>
                    <p className="text-[#2D5A27] dark:text-green-400 font-bold text-xl mb-3">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">{item.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50 dark:border-gray-800 mt-auto">
                      <Link 
                        to={`/umkm/${item.id}`}
                        className="flex items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-[#2D5A27] dark:hover:text-green-400 font-semibold py-2.5 px-3 rounded-lg transition-colors text-xs border border-gray-100 dark:border-gray-700"
                      >
                        Detail
                      </Link>
                      <button 
                        onClick={() => handleBuyWA(item.wa, item.name)}
                        className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-xs"
                      >
                        <MessageCircle size={14} />
                        Beli via WA
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UmkmDetail;
