import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, LogOut, Loader2, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      // Here you would update the user's profile
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-b from-elida-warm to-elida-cream py-16 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              Mano Paskyra
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto mb-8"></div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden"
          >
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Profilis atnaujintas</span>
              </motion.div>
            )}

            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-elida-gold/10 rounded-lg">
                <Shield className="h-6 w-6 text-elida-gold" />
              </div>
              <h2 className="text-2xl font-playfair text-gray-900">
                Profilio Informacija
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vardas
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl ${
                      isEditing
                        ? 'bg-white border border-elida-gold/20 focus:ring-2 focus:ring-elida-gold focus:border-transparent'
                        : 'bg-gray-50 border border-gray-200'
                    } transition-all duration-300`}
                  />
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-elida-gold transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  El. paštas
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-end gap-4 pt-4"
                >
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Atšaukti
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={updating}
                    className="px-6 py-2 bg-gradient-to-r from-elida-gold to-elida-accent text-white rounded-xl font-medium 
                             hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Atnaujinama...
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        Išsaugoti pakeitimus
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              <div className="pt-8 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium 
                           hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Atsijungti
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}