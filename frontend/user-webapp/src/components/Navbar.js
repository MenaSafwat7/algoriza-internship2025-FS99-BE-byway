import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Search, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = (e) => {
    console.log('=== LOGOUT BUTTON CLICKED ===');

    try {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      console.log('Closing menus...');
      setUserMenuOpen(false);
      setMobileMenuOpen(false);

      console.log('Calling logout function...');
      logout();

      console.log('Navigating to home...');
      navigate('/');

      console.log('Logout complete!');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const cartItemCount = getCartItemCount();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full"></div>
              <span className="text-xl font-bold text-gray-900">Byway</span>
            </button>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/courses"
              className={`font-medium transition-colors ${
                isActive('/courses')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Courses
            </Link>

            {user ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Bell className="h-6 w-6" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{user.name?.charAt(0) || 'U'}</span>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {!isLoginPage && (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Log In
                  </Link>
                )}
                {!isSignupPage && (
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="px-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <Link
                to="/courses"
                className={`px-4 font-medium transition-colors ${
                  isActive('/courses')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>

              {user ? (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center px-4 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>

                  <div className="border-t border-gray-200 pt-4 px-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{user.name?.charAt(0) || 'U'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      type="button"
                      className="flex items-center text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 border-t border-gray-200 pt-4 px-4">
                  {!isLoginPage && (
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  )}
                  {!isSignupPage && (
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
