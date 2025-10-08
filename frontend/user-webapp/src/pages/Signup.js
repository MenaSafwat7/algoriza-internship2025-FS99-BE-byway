import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Facebook, Chrome, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocialLogin } from '../hooks/useSocialLogin';
import toast from 'react-hot-toast';

const Signup = () => {
  const { user, register: registerUser } = useAuth();
  const { handleSocialLogin } = useSocialLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {

      if (!data.firstName?.trim() || !data.lastName?.trim()) {
        toast.error('Both first name and last name are required');
        return;
      }

      const result = await registerUser({
        fullName: `${data.firstName.trim()} ${data.lastName.trim()}`,
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        confirmPassword: data.confirmPassword
      });

      if (result.success) {
        toast.success('Account created successfully! Please log in.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex">
      {}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Your Account
              </h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        {...register('firstName', {
                          required: 'First name is required'
                        })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="First Name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <input
                        {...register('lastName', {
                          required: 'Last name is required'
                        })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Last Name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                    <input
                      {...register('username', {
                        required: 'Username is required',
                        minLength: {
                          value: 3,
                          message: 'Username must be at least 3 characters'
                        },
                        maxLength: {
                          value: 100,
                          message: 'Username cannot exceed 100 characters'
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9_]+$/,
                          message: 'Username can only contain letters, numbers, and underscores'
                        }
                      })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Username"
                    />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email ID"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        },
                        maxLength: {
                          value: 255,
                          message: 'Password cannot exceed 255 characters'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Enter Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 text-white" />
                    </>
                  )}
                </button>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Sign up with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleSocialLogin('Facebook')}
                  >
                    <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                    Facebook
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <Chrome className="h-5 w-5 text-red-500 mr-2" />
                    Google
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleSocialLogin('Microsoft')}
                  >
                    <Mail className="h-5 w-5 text-blue-500 mr-2" />
                    Microsoft
                  </button>
                </div>
              </div>

              {}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
