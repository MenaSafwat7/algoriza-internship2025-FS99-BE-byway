import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Clock, BookOpen, Users, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-react';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();

  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    rating: null,
    lectureRange: null,
    priceMin: 0,
    priceMax: 400,
    categories: []
  });

  const [expandedSections, setExpandedSections] = useState({
    rating: true,
    lectures: true,
    price: true,
    category: true
  });

  const pageSize = 12;

  useEffect(() => {

    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (category) {
      setFilters(prev => ({ ...prev, categories: [category] }));
    }
    if (search) setSearchTerm(search);

    fetchCategories();
    fetchAllCourses();
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [allCourses, filters, searchTerm, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCourses({ page: 1, pageSize: 1000 });
      setAllCourses(response.data.items);
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error('Fetch courses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredCourses = [...allCourses];

    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.rating) {
      filteredCourses = filteredCourses.filter(course => course.rate >= filters.rating);
    }

    if (filters.lectureRange) {
      filteredCourses = filteredCourses.filter(course => {
        const totalLectures = course.topics?.reduce((sum, topic) => sum + topic.lectureCount, 0) || 0;

        switch(filters.lectureRange) {
          case '1-15':
            return totalLectures >= 1 && totalLectures <= 15;
          case '16-30':
            return totalLectures >= 16 && totalLectures <= 30;
          case '31-45':
            return totalLectures >= 31 && totalLectures <= 45;
          case '45+':
            return totalLectures > 45;
          default:
            return true;
        }
      });
    }

    filteredCourses = filteredCourses.filter(course =>
      course.price >= filters.priceMin && course.price <= filters.priceMax
    );

    if (filters.categories.length > 0) {
      filteredCourses = filteredCourses.filter(course =>
        filters.categories.includes(course.categoryName)
      );
    }

    filteredCourses.sort((a, b) => {
      switch(sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priceHigh':
          return b.price - a.price;
        case 'priceLow':
          return a.price - b.price;
        case 'rating':
          return b.rate - a.rate;
        default:
          return 0;
      }
    });

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    setCourses(filteredCourses.slice(startIndex, endIndex));
    setTotalCount(filteredCourses.length);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleAddToCart = async (courseId) => {
    if (!user) {
      toast.error('Please login to add courses to cart');
      return;
    }

    await addToCart(courseId);
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? null : rating }));
    setCurrentPage(1);
  };

  const handleLectureRangeChange = (range) => {
    setFilters(prev => ({ ...prev, lectureRange: prev.lectureRange === range ? null : range }));
    setCurrentPage(1);
  };

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({ ...prev, priceMin: min, priceMax: max }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryName) => {
    setFilters(prev => {
      const categories = prev.categories.includes(categoryName)
        ? prev.categories.filter(c => c !== categoryName)
        : [...prev.categories, categoryName];
      return { ...prev, categories };
    });
    setCurrentPage(1);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({
      rating: null,
      lectureRange: null,
      priceMin: 0,
      priceMax: 400,
      categories: []
    });
    setSearchTerm('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.rating) count++;
    if (filters.lectureRange) count++;
    if (filters.priceMin > 0 || filters.priceMax < 400) count++;
    if (filters.categories.length > 0) count++;
    return count;
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
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-red-100 text-red-800'
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
    <div className="min-h-screen bg-white">
      {}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Courses</h1>
              <p className="text-gray-600">All Development Courses</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                Filter
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="latest">The latest</option>
                  <option value="oldest">The oldest</option>
                  <option value="priceHigh">Highest price</option>
                  <option value="priceLow">Lowest price</option>
                  <option value="rating">Highest rated</option>
                </select>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>

          {}
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {}
          <div className={`w-full md:w-80 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {}
                <div>
                  <button
                    onClick={() => toggleSection('rating')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <h3 className="text-sm font-medium text-gray-700">Rating</h3>
                    {expandedSections.rating ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections.rating && (
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingChange(rating)}
                          className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
                            filters.rating === rating
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-700">
                            {rating === 5 ? '5 stars' : `${rating}+ stars`}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {}
                <div>
                  <button
                    onClick={() => toggleSection('lectures')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <h3 className="text-sm font-medium text-gray-700">Number of Lectures</h3>
                    {expandedSections.lectures ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections.lectures && (
                    <div className="space-y-2">
                      {[
                        { label: '1-15 lectures', value: '1-15' },
                        { label: '16-30 lectures', value: '16-30' },
                        { label: '31-45 lectures', value: '31-45' },
                        { label: 'More than 45 lectures', value: '45+' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="lectures"
                            value={option.value}
                            checked={filters.lectureRange === option.value}
                            onChange={() => handleLectureRangeChange(option.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {}
                <div>
                  <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <h3 className="text-sm font-medium text-gray-700">Price</h3>
                    {expandedSections.price ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections.price && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${filters.priceMin}</span>
                        <span>${filters.priceMax}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="400"
                          value={filters.priceMax}
                          onChange={(e) => handlePriceChange(filters.priceMin, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <style jsx>{`
                          .slider::-webkit-slider-thumb {
                            appearance: none;
                            height: 20px;
                            width: 20px;
                            border-radius: 50%;
                            background: #3b82f6;
                            cursor: pointer;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                          }
                          .slider::-moz-range-thumb {
                            height: 20px;
                            width: 20px;
                            border-radius: 50%;
                            background: #3b82f6;
                            cursor: pointer;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                          }
                        `}</style>
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="400"
                          value={filters.priceMin}
                          onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, filters.priceMax)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          min="0"
                          max="400"
                          value={filters.priceMax}
                          onChange={(e) => handlePriceChange(filters.priceMin, parseInt(e.target.value) || 400)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {}
                <div>
                  <button
                    onClick={() => toggleSection('category')}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <h3 className="text-sm font-medium text-gray-700">Category</h3>
                    {expandedSections.category ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections.category && (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category.categoryId} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category.name)}
                            onChange={() => handleCategoryChange(category.name)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="flex-1">
            {}
            {getActiveFiltersCount() > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.rating && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {filters.rating}+ stars
                      <button
                        onClick={() => handleRatingChange(filters.rating)}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.lectureRange && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {filters.lectureRange} lectures
                      <button
                        onClick={() => handleLectureRangeChange(filters.lectureRange)}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(filters.priceMin > 0 || filters.priceMax < 400) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      ${filters.priceMin} - ${filters.priceMax}
                      <button
                        onClick={() => handlePriceChange(0, 400)}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.categories.map((category) => (
                    <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {category}
                      <button
                        onClick={() => handleCategoryChange(category)}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {courses.length} of {totalCount} courses
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 text-blue-600">
                    (filtered by {getActiveFiltersCount()} criteria)
                  </span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
                <button onClick={clearFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course.courseId}
                      onClick={() => navigate(`/courses/${course.courseId}`)}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
                    >
                      <div className="relative">
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
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {course.categoryName}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-2">
                          By {course.instructorName}
                        </p>

                        <div className="flex items-center mb-3">
                          {renderStars(course.rate)}
                        </div>

                        <div className="text-sm text-gray-600 mb-4">
                          {course.totalHours} Total Hours. {course.topics?.length || 0} Lectures. {getLevelText(course.level)}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            ${course.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {[...Array(Math.min(3, totalPages))].map((_, index) => {
                        const page = currentPage <= 2 ? index + 1 : currentPage - 1 + index;
                        if (page > totalPages) return null;

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg ${
                              page === currentPage
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="h-4 w-4" />
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