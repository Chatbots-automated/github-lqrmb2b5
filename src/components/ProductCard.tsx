import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Target, Shield, X, Star, Clock, Award, Sparkles, Info, Package, CheckCircle, Zap } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!product.imageurl || product.imageurl === '/elida-logo.svg') return;
    console.error('Image failed to load:', product.imageurl);
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

  // Split description into categories
  const categorizeDescription = () => {
    const description = product.description;
    const points = description.split('.').filter(Boolean).map(point => point.trim());
    
    return {
      features: points.filter(point => 
        !point.toLowerCase().includes('naudojimas:') &&
        !point.toLowerCase().includes('įspėjimas:') &&
        !point.toLowerCase().includes('sudėtis:')
      ),
      usage: points.filter(point => 
        point.toLowerCase().includes('naudojimas:')
      ),
      warnings: points.filter(point => 
        point.toLowerCase().includes('įspėjimas:')
      ),
      ingredients: points.filter(point => 
        point.toLowerCase().includes('sudėtis:')
      )
    };
  };

  const { features, usage, warnings, ingredients } = categorizeDescription();

  // Ensure price is a number and has toFixed method
  const formattedPrice = typeof product.price === 'number' ? 
    product.price.toFixed(2) : 
    parseFloat(String(product.price)).toFixed(2);

  return (
    <>
      <motion.div
        className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500"
        whileHover={{ scale: 1.02, y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setShowQuickView(true)}
      >
        <div className="relative cursor-pointer">
          <motion.div
            className="relative w-full h-64 overflow-hidden"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={product.imageurl}
              alt={product.name}
              onError={handleImageError}
              className={`w-full h-full transition-all duration-500 ${
                imageError || product.imageurl === '/elida-logo.svg' 
                  ? 'object-contain p-4 bg-gray-50' 
                  : 'object-cover'
              }`}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          <motion.div 
            className="absolute top-4 right-4 space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`p-3 rounded-xl shadow-lg ${
                isWishlisted 
                  ? 'bg-elida-gold text-white' 
                  : 'bg-white/95 text-elida-gold hover:bg-elida-gold hover:text-white'
              } backdrop-blur-sm transition-all duration-300`}
            >
              <Heart className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </motion.div>

          <motion.div 
            className="absolute top-4 left-4 px-4 py-2 bg-elida-gold/95 text-white rounded-xl text-xs font-mono tracking-wider backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {product.sku}
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(true);
              }}
              className="w-full px-6 py-3 bg-white/95 text-elida-gold rounded-xl font-medium backdrop-blur-sm shadow-lg hover:bg-elida-gold hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Eye className="h-5 w-5" />
              Peržiūrėti Detaliau
            </button>
          </motion.div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-elida-gold" />
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
            </div>
            <div className="text-sm font-medium text-gray-600">{product.category}</div>
          </div>

          <p className="text-gray-600 text-sm mb-6 line-clamp-2">{features[0]}</p>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <span className="text-2xl font-bold text-elida-gold">{formattedPrice}€</span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-elida-gold to-elida-accent text-white font-medium rounded-xl hover:shadow-lg focus:ring-4 focus:ring-elida-gold/50 transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
              Į krepšelį
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showQuickView && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowQuickView(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl relative overflow-hidden">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowQuickView(false)}
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-elida-gold hover:text-white rounded-xl transition-colors z-10 backdrop-blur-sm"
                >
                  <X className="h-6 w-6" />
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="lg:sticky lg:top-0 h-fit p-8 lg:p-12 bg-gradient-to-br from-elida-cream to-white">
                    <motion.img
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={product.imageurl}
                      alt={product.name}
                      onError={handleImageError}
                      className={`w-full rounded-xl shadow-lg ${
                        imageError || product.imageurl === '/elida-logo.svg' 
                          ? 'object-contain p-8 bg-gray-50' 
                          : 'object-cover'
                      }`}
                    />
                  </div>

                  <div className="p-8 lg:p-12 border-l border-gray-100">
                    <div className="space-y-8">
                      {/* Header */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-elida-gold/10 rounded-xl">
                            <Shield className="h-7 w-7 text-elida-gold" />
                          </div>
                          <h2 className="text-3xl font-playfair text-gray-900">{product.name}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="h-5 w-5" />
                          <span>{product.category}</span>
                        </div>
                      </motion.div>

                      {/* Features */}
                      {features.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-elida-gold" />
                            <h3 className="text-lg font-medium text-gray-900">Savybės</h3>
                          </div>
                          <div className="space-y-3">
                            {features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-elida-gold flex-shrink-0 mt-0.5" />
                                <p className="text-gray-600">{feature}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Usage Instructions */}
                      {usage.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Info className="h-5 w-5 text-elida-gold" />
                            <h3 className="text-lg font-medium text-gray-900">Naudojimas</h3>
                          </div>
                          <div className="space-y-3">
                            {usage.map((instruction, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <Star className="h-5 w-5 text-elida-gold flex-shrink-0 mt-0.5" />
                                <p className="text-gray-600">{instruction}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Warnings */}
                      {warnings.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-red-50 p-4 rounded-xl border border-red-100"
                        >
                          <div className="flex items-center gap-2 mb-4 text-red-600">
                            <Info className="h-5 w-5" />
                            <h3 className="text-lg font-medium">Įspėjimai</h3>
                          </div>
                          <div className="space-y-3">
                            {warnings.map((warning, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-red-600">{warning}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Ingredients */}
                      {ingredients.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Package className="h-5 w-5 text-elida-gold" />
                            <h3 className="text-lg font-medium text-gray-900">Sudėtis</h3>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl">
                            {ingredients.map((ingredient, index) => (
                              <p key={index} className="text-gray-600">{ingredient}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Variants Selection */}
                      {product.variants && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="space-y-6"
                        >
                          {product.variants.colors && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-3">Spalva</h3>
                              <div className="flex gap-3">
                                {product.variants.colors.map((color) => (
                                  <motion.button
                                    key={color}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                                      selectedColor === color
                                        ? 'bg-elida-gold text-white shadow-lg'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    {color}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )}

                          {product.variants.sizes && (
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-3">Dydis</h3>
                              <div className="flex gap-3">
                                {product.variants.sizes.map((size) => (
                                  <motion.button
                                    key={size}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm transition-all ${
                                      selectedSize === size
                                        ? 'bg-elida-gold text-white shadow-lg'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    {size}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Add to Cart Section */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center justify-between pt-6 border-t border-gray-100"
                      >
                        <div>
                          <span className="text-sm text-gray-500 mb-1 block">Kaina</span>
                          <span className="text-3xl font-playfair text-elida-gold">
                            {formattedPrice}€
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddToCart}
                          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl hover:shadow-lg focus:ring-4 focus:ring-elida-gold/50 transition-all duration-300 font-medium relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 shimmer pointer-events-none" />
                          <ShoppingCart className="h-5 w-5 relative z-10" />
                          <span className="relative z-10">Į krepšelį</span>
                        </motion.button>
                      </motion.div>
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