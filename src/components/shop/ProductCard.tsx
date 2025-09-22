import React, { useState } from 'react';
import { Star, ShoppingCart, Package, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useApp();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}
      />
    ));
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:bg-gray-50 transition-all duration-300 hover:scale-105">
      {/* Product Image */}
      <div className="relative h-56 overflow-hidden bg-white">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <div className="text-center">
              <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500 text-sm">Image not available</p>
            </div>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        <div className="absolute top-3 right-3">
          {product.inStock ? (
            <span className="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <CheckCircle size={12} />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="bg-red-500/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Package size={12} />
              <span>Out of Stock</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <span className="inline-block bg-blue-500/60 text-blue-900 px-2 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-black mb-2 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>

        <p className="text-black/70 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-black/70 text-sm ml-2">{product.rating}</span>
        </div>

        {/* Compatibility */}
        <div className="mb-4">
          <p className="text-black/60 text-xs mb-2">Compatible with:</p>
          <div className="flex flex-wrap gap-1">
            {product.compatibility.slice(0, 3).map((crop, index) => (
              <span
                key={index}
                className="bg-green-500/40 text-green-700 px-2 py-1 rounded text-xs"
              >
                {crop}
              </span>
            ))}
            {product.compatibility.length > 3 && (
              <span className="text-black/60 text-xs px-2 py-1">
                +{product.compatibility.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-black">₹{product.price}</span>
            <span className="text-black/60 text-sm">/unit</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${product.inStock
                ? 'bg-green-500 hover:bg-green-600 text-black hover:scale-105'
                : 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <ShoppingCart size={16} />
            <span>{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;