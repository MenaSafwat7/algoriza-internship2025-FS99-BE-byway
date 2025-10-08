import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await apiService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart({ items: [], subtotal: 0, discount: 0, tax: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (courseId) => {
    if (!user) {
      toast.error('Please login to add courses to cart');
      return { success: false };
    }

    try {
      await apiService.addToCart(courseId);
      await fetchCart();
      toast.success('Course added to cart');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add course to cart';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      await apiService.removeFromCart(courseId);
      await fetchCart();
      toast.success('Course removed from cart');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove course from cart';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      await apiService.clearCart();
      setCart({ items: [], subtotal: 0, discount: 0, tax: 0, total: 0 });
      return { success: true };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return { success: false };
    }
  };

  const processPurchase = async (purchaseData = {}) => {
    try {
      const response = await apiService.processPurchase(purchaseData);
      await clearCart();
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to process purchase';
      return { success: false, error: errorMessage };
    }
  };

  const getCartItemCount = () => {
    return cart?.items?.length || 0;
  };

  const isInCart = (courseId) => {
    return cart?.items?.some(item => item.courseId === courseId) || false;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    processPurchase,
    getCartItemCount,
    isInCart,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
