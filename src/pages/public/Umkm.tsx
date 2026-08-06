import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Search, ShoppingBag, MessageCircle } from 'lucide-react';

const Umkm = () => {
  const { umkm } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Get unique categories
  const categories = ['Semua', ...Array.from(new Set(umkm.map(item => item.category)))];

  const filteredUmkm = umkm.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuyWA = (phone: string, productName: string) => {
    // Format phone to international format (strip leading 0 if exists, assuming 62 is used or added)
    const cleanPhone = phone.replace(/^0+/, '62');
    const message = `Halo, saya tertarik untuk membeli produk *${productName}* yang ada di website Desa Benjor. Apakah stoknya masih tersedia?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2D5A27]">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">UMKM Desa Benjor</h1>
          <p className="text-lg text-gray-600">Dukung ekonomi lokal dengan membeli produk unggulan dari masyarakat Desa Benjor.</p>
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
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#2D5A27] focus:border-[#2D5A27] bg-gray-50"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredUmkm.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredUmkm.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col h-full">
                <Link to={`/umkm/${product.id}`} className="relative h-48 overflow-hidden bg-gray-100 block">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#2D5A27] shadow-sm">
                    {product.category}
                  </div>
                </Link>
                <div className="p-5 flex-grow flex flex-col">
                  <Link to={`/umkm/${product.id}`} className="block group-hover:text-[#2D5A27] transition-colors">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-[#2D5A27] font-bold text-xl mb-3">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">👤</div>
                    <span>{product.owner}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Link 
                      to={`/umkm/${product.id}`}
                      className="flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-[#2D5A27] font-semibold py-2.5 px-3 rounded-lg transition-colors text-xs border border-gray-100"
                    >
                      Detail
                    </Link>
                    <button 
                      onClick={() => handleBuyWA(product.wa, product.name)}
                      className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-xs shadow-sm hover:shadow"
                    >
                      <MessageCircle size={14} />
                      Beli via WA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-gray-400 mb-2">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">Produk tidak ditemukan</h3>
            <p className="text-gray-500">Coba gunakan kata kunci atau kategori yang berbeda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Umkm;
