import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import LoginTest from './pages/LoginTest';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4aed88',
                  },
                },
              }}
            />

            <Navbar />

            <main className="flex-1">
              <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-test" element={<LoginTest />} />
            <Route path="/signup" element={<Signup />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout/success"
                  element={
                    <ProtectedRoute>
                      <CheckoutSuccess />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
