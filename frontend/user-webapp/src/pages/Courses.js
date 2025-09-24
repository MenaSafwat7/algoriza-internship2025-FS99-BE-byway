import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Clock, BookOpen, Users, ChevronDown } from 'lucide-react';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters and search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [minRating, setMinRating] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  
  const pageSize = 12;

  useEffect(() => {
    // Get initial filters from URL params
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) setSelectedCategory(category);
    if (search) setSearchTerm(search);
    
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, selectedCategory, selectedLevel, minRating, priceRange, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize,
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        level: selectedLevel || undefined,
        minRating: minRating || undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        sortBy
      };

      const response = await apiService.getCourses(params);
      setCourses(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error('Fetch courses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourses();
  };

  const handleAddToCart = async (courseId) => {
    if (!user) {
      toast.error('Please login to add courses to cart');
      return;
    }
    
    await addToCart(courseId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setMinRating('');
    setPriceRange({ min: '', max: '' });
    setSortBy('latest');
    setCurrentPage(1);
    setSearchParams({});
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getLevelBadgeColor = (level) => {
    const colors = {
      1: 'bg-green-100 text-green-800', // Beginner
      2: 'bg-yellow-100 text-yellow-800', // Intermediate
      3: 'bg-red-100 text-red-800' // Advanced
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getLevelText = (level) => {
    const levels = {
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Advanced'
    };
    return levels[level] || 'Unknown';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Courses</h1>
          <p className="text-gray-600 mb-6">
            Discover {totalCount} courses to advance your skills
          </p>
          
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
            
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full md:w-80 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="card p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name} ({category.courseCount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="1">Beginner</option>
                    <option value="2">Intermediate</option>
                    <option value="3">Advanced</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => {
                      setMinRating(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.courseId} className="course-card">
                      <div className="aspect-w-16 aspect-h-9">
                        {course.imageUrl ? (
                          <img
                            src={`http://localhost:5045${course.imageUrl}`}
                            alt={course.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeColor(course.level)}`}>
                            {getLevelText(course.level)}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.totalHours}h
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          By {course.instructorName}
                        </p>
                        
                        <p className="text-sm text-primary-600 font-medium mb-3">
                          {course.categoryName}
                        </p>
                        
                        <div className="flex items-center mb-4">
                          {renderStars(course.rate)}
                          <span className="ml-2 text-sm text-gray-600">
                            ({course.rate}.0)
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary-600">
                            ${course.price}
                          </span>
                          {course.hasCertification && (
                            <span className="text-xs text-green-600 font-medium flex items-center">
                              <Award className="h-3 w-3 mr-1" />
                              Certificate
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            to={`/courses/${course.courseId}`}
                            className="flex-1 btn-secondary text-center text-sm py-2"
                          >
                            View Details
                          </Link>
                          {isInCart(course.courseId) ? (
                            <button
                              disabled
                              className="flex-1 bg-green-100 text-green-800 font-medium py-2 px-4 rounded-lg text-sm"
                            >
                              In Cart
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(course.courseId)}
                              className="flex-1 btn-primary text-sm py-2"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const page = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
                        if (page > totalPages) return null;
                        
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 border rounded-lg ${
                              page === currentPage
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
