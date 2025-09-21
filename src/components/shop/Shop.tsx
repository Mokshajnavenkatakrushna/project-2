import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Package } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { mockProducts } from '../../data/mockProducts';
import ProductCard from './ProductCard';
import Cart from './Cart';

const Shop: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  
  const { t } = useLanguage();
  const { cart } = useApp();

  const categories = ['all', 'Fertilizer', 'Pesticide', 'Soil Amendment'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              🛒 {t('shop')}
            </h1>
            <p className="text-black/70">
              Find the perfect fertilizers, pesticides, and soil amendments for your agricultural needs
            </p>
          </div>
          
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <ShoppingCart size={20} />
            <span>{showCart ? 'View Products' : t('cart')}</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-black text-xs w-6 h-6 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showCart ? (
        <Cart />
      ) : (
        <>
          {/* Search and Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-black/60" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-black/60" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-white text-black">
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black">
                  {selectedCategory === 'Pesticide' ? '🦠 Pesticides' : 
                   selectedCategory === 'Fertilizer' ? '🌱 Fertilizers' :
                   selectedCategory === 'Soil Amendment' ? '🌍 Soil Amendments' :
                   'Products'} ({filteredProducts.length})
                </h2>
                {selectedCategory !== 'all' && (
                  <p className="text-sm text-black/60 mt-1">
                    Showing {selectedCategory.toLowerCase()} products
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 text-black/70">
                <Package size={20} />
                <span>{filteredProducts.filter(p => p.inStock).length} in stock</span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto text-black/40 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-black/60 mb-2">No products found</h3>
                <p className="text-black/40">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;

