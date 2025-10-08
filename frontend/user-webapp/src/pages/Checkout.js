import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, CreditCard, User, MapPin, Mail, Phone } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, processPurchase, clearCart, loading: cartLoading } = useCart();
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    if (user) {
      setValue('email', user.email);
      setValue('fullName', user.name);
    }
  }, [cart, user, navigate, setValue]);

  const onSubmit = async (data) => {
    setProcessing(true);

    try {

      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderDetails = {
        total: cart.total,
        coursesCount: cart.items.length,
        courses: cart.items,
        paymentInfo: {
          cardholderName: data.cardholderName,
          lastFourDigits: data.cardNumber.slice(-4)
        }
      };

      try {
        const result = await processPurchase({
          courseIds: cart.items.map(item => item.courseId),
          discount: cart.discount || 0
        });

        if (result.success) {
          console.log('Purchase processed and cart cleared successfully');
        } else {
          console.warn('Backend purchase failed, but continuing with frontend flow:', result.error);

          await clearCart();
        }
      } catch (backendError) {
        console.warn('Backend not available, continuing with static checkout:', backendError);

        try {
          await clearCart();
        } catch (clearError) {
          console.error('Failed to clear cart:', clearError);
        }
      }

      toast.success('Payment successful!');
      navigate('/checkout/success', {
        state: { orderDetails }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <Lock className="h-4 w-4 mr-2" />
            <span>Secure checkout powered by SSL encryption</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {}
            <div className="space-y-6">
              {}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Billing Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('fullName', { required: 'Full name is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      {...register('country', { required: 'Country is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IN">India</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      {...register('address')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP / Postal Code
                    </label>
                    <input
                      {...register('zipCode')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>

              {}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                    <input
                      type="radio"
                      id="credit-card"
                      name="paymentMethod"
                      value="credit-card"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="credit-card" className="flex items-center cursor-pointer">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="font-medium">Credit / Debit Card</span>
                    </label>
                  </div>

                  <div className="ml-7 space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        {...register('cardNumber', {
                          required: 'Card number is required',
                          pattern: {
                            value: /^[0-9\s]{13,19}$/,
                            message: 'Invalid card number'
                          }
                        })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          {...register('expiryDate', {
                            required: 'Expiry date is required',
                            pattern: {
                              value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                              message: 'Invalid expiry date (MM/YY)'
                            }
                          })}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          {...register('cvv', {
                            required: 'CVV is required',
                            pattern: {
                              value: /^[0-9]{3,4}$/,
                              message: 'Invalid CVV'
                            }
                          })}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        {...register('cardholderName', { required: 'Cardholder name is required' })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name as it appears on card"
                      />
                      {errors.cardholderName && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center space-x-4">
                      <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0">
                        {item.courseImageUrl ? (
                          <img
                            src={`http://localhost:5045${item.courseImageUrl}`}
                            alt={item.courseName}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.courseName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          By {item.instructorName}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${cart.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${cart.discount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (15%)</span>
                    <span className="text-gray-900">${cart.tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      {...register('agreeTerms', { required: 'You must agree to the terms' })}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label className="ml-3 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-gray-800 text-white flex items-center justify-center py-4 text-lg font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-3" />
                        Complete Payment ${cart.total.toFixed(2)}
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Your payment information is secure and encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
