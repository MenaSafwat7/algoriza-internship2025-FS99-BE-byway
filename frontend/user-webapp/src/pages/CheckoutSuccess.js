import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { clearCart, refreshCart } = useCart();

  useEffect(() => {

    const ensureCartCleared = async () => {
      try {
        console.log('Verifying cart is cleared after purchase...');

        await clearCart();

        await refreshCart();
        console.log('Cart successfully cleared and refreshed');
      } catch (error) {
        console.error('Error ensuring cart is cleared:', error);
      }
    };

    ensureCartCleared();
  }, [clearCart, refreshCart]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {}
      <div className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Byway</span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md mx-auto">

          {}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-20 h-20 text-white" strokeWidth={3} />
            </div>
          </div>

          {}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Purchase Complete
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            You Will Receive a confirmation email soon!
          </p>

          {}
          <button
            onClick={handleBackToHome}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
          >
            Back to Home
          </button>
        </div>
      </div>

      {}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="ml-2 text-xl font-semibold">Byway</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering learners through accessible and engaging online education.
              </p>
            </div>

            {}
            <div>
              <h3 className="font-semibold mb-4">Get Help</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Latest Articles</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>

            {}
            <div>
              <h3 className="font-semibold mb-4">Programs</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Art & Design</a></li>
                <li><a href="#" className="hover:text-white">Business</a></li>
                <li><a href="#" className="hover:text-white">IT & Software</a></li>
                <li><a href="#" className="hover:text-white">Languages</a></li>
                <li><a href="#" className="hover:text-white">Programming</a></li>
              </ul>
            </div>

            {}
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400 text-sm mb-2">
                Address: 123 Main Street, Anytown, CA 12345
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Tel: +(123) 456-7890
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Mail: byway@webmail.com
              </p>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  <span className="text-sm">in</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  <span className="text-sm">ig</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  <span className="text-sm">tw</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  <span className="text-sm">yt</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutSuccess;
