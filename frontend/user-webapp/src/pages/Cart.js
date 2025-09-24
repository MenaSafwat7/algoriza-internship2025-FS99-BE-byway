import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, loading, removeFromCart, refreshCart } = useCart();
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    refreshCart();
  }, []);

  const handleRemoveItem = async (courseId, courseName) => {
    setRemoving(courseId);
    try {
      const result = await removeFromCart(courseId);
      if (result.success) {
        toast.success(`${courseName} removed from cart`);
      }
    } catch (error) {
      toast.error('Failed to remove item from cart');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any courses to your cart yet. 
              Browse our courses and find something you love!
            </p>
            <Link to="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {cart.items.length} {cart.items.length === 1 ? 'course' : 'courses'} in your cart
              </p>
            </div>
            <Link
              to="/courses"
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div
                    key={item.cartItemId}
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="card p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Course Image */}
                      <div className="md:w-48 flex-shrink-0">
                        {item.courseImageUrl ? (
                          <img
                            src={`http://localhost:5045${item.courseImageUrl}`}
                            alt={item.courseName}
                            className="w-full h-32 md:h-28 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 md:h-28 bg-gray-200 flex items-center justify-center rounded-lg">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="flex-1 mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              <Link
                                to={`/courses/${item.courseId}`}
                                className="hover:text-primary-600 transition-colors"
                              >
                                {item.courseName}
                              </Link>
                            </h3>
                            <p className="text-gray-600 mb-2">
                              By {item.instructorName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Added {new Date(item.addedAt).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between md:flex-col md:items-end md:justify-start">
                            <div className="text-right mb-4">
                              <div className="text-2xl font-bold text-primary-600">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.courseId, item.courseName)}
                              disabled={removing === item.courseId}
                              className="flex items-center text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                            >
                              {removing === item.courseId ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="text-green-600">
                      -${cart.discount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (15%)</span>
                    <span>${cart.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span className="text-primary-600">${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full btn-primary text-center block mb-4"
                >
                  Proceed to Checkout
                </Link>

                <div className="text-center">
                  <Link
                    to="/courses"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Security Badges */}
              <div className="card p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Safe & Secure Shopping
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Lifetime access to courses</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="card p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Have a promo code?
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="btn-secondary px-4 py-2 text-sm">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
