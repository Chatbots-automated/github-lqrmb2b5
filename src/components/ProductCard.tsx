import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Target, Shield, X, Star, Clock, Award, Sparkles } from 'lucide-react';
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
  const [imageError, setImageError] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!product.image || product.image === '/elida-logo.svg') return;
    console.error('Image failed to load:', product.image);
    setImageError(true);
    e.currentTarget.src = '/elida-logo.svg';
  };

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

  // Ensure price is a number and has toFixed method
  const formattedPrice = typeof product.price === 'number' ? 
    product.price.toFixed(2) : 
    parseFloat(String(product.price)).toFixed(2);

  return (
    <>
      <motion.div
        className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative">
          <img 
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className={`w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageError || product.image === '/elida-logo.svg' ? 'object-contain p-4 bg-gray-50' : ''
            }`}
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
            <span className="text-2xl font-bold text-elida-gold">{formattedPrice}€</span>
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

      {/* Enhanced Quick View Modal */}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl relative overflow-hidden">
                {/* Close button */}
                <button
                  onClick={() => setShowQuickView(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative h-[500px] overflow-hidden bg-elida-cream">
                    <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      src={product.image}
                      alt={product.name}
                      onError={handleImageError}
                      className={`absolute inset-0 w-full h-full ${
                        imageError || product.image === '/elida-logo.svg' ? 'object-contain p-16 bg-gray-50' : 'object-contain p-8'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 relative">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-elida-gold/10 rounded-full blur-3xl" />
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Shield className="h-7 w-7 text-elida-gold" />
                          <h2 className="text-3xl font-playfair text-gray-900">{product.name}</h2>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Pristatymas per 1-2 d.d.
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            Premium kokybė
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-elida-gold" />
                          Apie produktą
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Features */}
                      {product.features && (
                        <div className="mb-8">
                          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Target className="h-5 w-5 text-elida-gold" />
                            Savybės
                          </h3>
                          <ul className="grid grid-cols-2 gap-3">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-600">
                                <span className="w-1.5 h-1.5 bg-elida-gold rounded-full" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Variants */}
                      {product.variants && (
                        <div className="space-y-6 mb-8">
                          {product.variants.colors && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-3">Spalva</h3>
                              <div className="flex gap-3">
                                {product.variants.colors.map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                      selectedColor === color
                                        ? 'bg-elida-gold text-white shadow-lg'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    {color}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {product.variants.sizes && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-3">Dydis</h3>
                              <div className="flex gap-3">
                                {product.variants.sizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm transition-all ${
                                      selectedSize === size
                                        ? 'bg-elida-gold text-white shadow-lg'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div>
                          <span className="text-sm text-gray-500 mb-1 block">Kaina</span>
                          <span className="text-3xl font-playfair text-elida-gold">
                            {formattedPrice}€
                          </span>
                        </div>
                        <button
                          onClick={handleAddToCart}
                          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-lg hover:shadow-lg focus:ring-4 focus:ring-elida-gold/50 transition-all duration-300 font-medium relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 shimmer pointer-events-none" />
                          <ShoppingCart className="h-5 w-5 relative z-10" />
                          <span className="relative z-10">Į krepšelį</span>
                        </button>
                      </div>
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