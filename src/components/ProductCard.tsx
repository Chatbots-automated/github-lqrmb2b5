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

          <p className="text-gray-600 text-sm mb-6 line-clamp-2">{product.description}</p>

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
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowQuickView(false)}
            >
              <div 
                className="relative w-full max-w-5xl bg-black/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowQuickView(false)}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden">
                  <div className="p-8 lg:p-12">
                    <motion.img
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={product.imageurl}
                      alt={product.name}
                      onError={handleImageError}
                      className={`w-full h-[500px] rounded-xl shadow-lg ${
                        imageError || product.imageurl === '/elida-logo.svg' 
                          ? 'object-contain p-8 bg-white/5' 
                          : 'object-cover'
                      }`}
                    />
                  </div>

                  <div className="p-8 lg:p-12 border-l border-white/10 overflow-y-auto">
                    <div className="space-y-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-white/10 rounded-xl">
                            <Shield className="h-7 w-7 text-amber-500" />
                          </div>
                          <h2 className="text-3xl font-playfair text-white">{product.name}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <Package className="h-5 w-5" />
                          <span>{product.category}</span>
                        </div>
                      </motion.div>

                      {features.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <h3 className="text-lg font-medium text-white">Savybės</h3>
                          </div>
                          <div className="space-y-3">
                            {features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-white/70">{feature}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {usage.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Info className="h-5 w-5 text-amber-500" />
                            <h3 className="text-lg font-medium text-white">Naudojimas</h3>
                          </div>
                          <div className="space-y-3">
                            {usage.map((instruction, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-white/70">{instruction}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {warnings.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-red-500/10 p-4 rounded-xl border border-red-500/20"
                        >
                          <div className="flex items-center gap-2 mb-4 text-red-400">
                            <Info className="h-5 w-5" />
                            <h3 className="text-lg font-medium">Įspėjimai</h3>
                          </div>
                          <div className="space-y-3">
                            {warnings.map((warning, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-400">{warning}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {ingredients.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Package className="h-5 w-5 text-amber-500" />
                            <h3 className="text-lg font-medium text-white">Sudėtis</h3>
                          </div>
                          <div className="bg-white/5 p-4 rounded-xl">
                            {ingredients.map((ingredient, index) => (
                              <p key={index} className="text-white/70">{ingredient}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {product.variants && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="space-y-6"
                        >
                          {product.variants.colors && (
                            <div>
                              <h3 className="text-lg font-medium text-white mb-3">Spalva</h3>
                              <div className="flex gap-3">
                                {product.variants.colors.map((color) => (
                                  <motion.button
                                    key={color}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                                      selectedColor === color
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-white/10 text-white hover:bg-white/20'
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
                              <h3 className="text-lg font-medium text-white mb-3">Dydis</h3>
                              <div className="flex gap-3">
                                {product.variants.sizes.map((size) => (
                                  <motion.button
                                    key={size}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm transition-all ${
                                      selectedSize === size
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-white/10 text-white hover:bg-white/20'
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

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-6 pt-6 border-t border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-playfair text-white">
                            €{formattedPrice}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product);
                            }}
                            className={`p-3 rounded-xl ${
                              isWishlisted 
                                ? 'bg-amber-500 text-black' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            <Heart className="h-6 w-6" fill={isWishlisted ? 'currentColor' : 'none'} />
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart();
                          }}
                          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 
                                   text-black font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 
                                   transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          Į krepšelį
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowQuickView(false)}
                          className="w-full py-4 bg-white/10 text-white rounded-xl 
                                   hover:bg-white/20 transition-all duration-300"
                        >
                          Tęsti apsipirkimą
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