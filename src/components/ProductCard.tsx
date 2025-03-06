import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Target, Shield, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../types/product';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showQuickView, setShowQuickView] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (product.variants) {
      if (!selectedSize || !selectedColor) {
        alert('Prašome pasirinkti dydį ir spalvą');
        return;
      }
    }

    addToCart({
      ...product,
      quantity: 1,
      selectedSize,
      selectedColor,
    });
  };

  return (
    <>
      <motion.div
        className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative">
          <img 
            src={product.image || 'https://via.placeholder.com/400x400?text=Produkto+nuotrauka'}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Quick actions */}
          <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-lg shadow-md ${
                isWishlisted ? 'bg-elida-gold text-white' : 'bg-white/90 text-elida-gold'
              } hover:scale-110 transition-transform backdrop-blur-sm`}
            >
              <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => setShowQuickView(true)}
              className="p-2 rounded-lg bg-white/90 text-elida-gold shadow-md hover:scale-110 transition-transform backdrop-blur-sm"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>

          {/* SKU Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-elida-gold/90 text-white rounded-lg text-xs font-mono tracking-wider backdrop-blur-sm">
            {product.sku}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-elida-gold" />
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
            </div>
            <div className="text-sm font-medium text-gray-600">{product.category}</div>
          </div>

          <p className="text-gray-600 text-sm mb-6 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <span className="text-2xl font-bold text-elida-gold">{product.price.toFixed(2)}€</span>
            <button 
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-3 bg-elida-gold text-white font-medium rounded-lg hover:bg-elida-accent focus:ring-4 focus:ring-elida-gold/50 transition-colors duration-300 shadow-md"
            >
              <ShoppingCart className="h-5 w-5" />
              Į krepšelį
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowQuickView(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button
                  onClick={() => setShowQuickView(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                  <div>
                    <img
                      src={product.image || 'https://via.placeholder.com/400x400?text=Produkto+nuotrauka'}
                      alt={product.name}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-6 w-6 text-elida-gold" />
                      <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    
                    {product.features && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-elida-gold" />
                          Savybės
                        </h4>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-elida-gold rounded-full mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.variants && (
                      <div className="space-y-4 mb-6">
                        {product.variants.colors && (
                          <div>
                            <label className="text-sm font-medium text-gray-900 block mb-2">Spalva</label>
                            <div className="flex gap-2">
                              {product.variants.colors.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setSelectedColor(color)}
                                  className={`px-3 py-1 rounded-lg text-sm border ${
                                    selectedColor === color
                                      ? 'bg-elida-gold text-white border-elida-gold'
                                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                  } transition-colors`}
                                >
                                  {color}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {product.variants.sizes && (
                          <div>
                            <label className="text-sm font-medium text-gray-900 block mb-2">Dydis</label>
                            <div className="flex gap-2">
                              {product.variants.sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setSelectedSize(size)}
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm border ${
                                    selectedSize === size
                                      ? 'bg-elida-gold text-white border-elida-gold'
                                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                  } transition-colors`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <span className="text-3xl font-bold text-elida-gold">{product.price.toFixed(2)}€</span>
                      <button
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 px-8 py-4 bg-elida-gold text-white rounded-lg hover:bg-elida-accent focus:ring-4 focus:ring-elida-gold/50 transition-colors duration-300 shadow-md font-medium"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Į krepšelį
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}