import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Star, Filter } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import CourseModal from '../components/CourseModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, course: null });
  const pageSize = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCourses({
        page: currentPage,
        pageSize,
        search: searchTerm,
        categoryId: selectedCategory || undefined
      });
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
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleDeleteCourse = (course) => {
    setDeleteDialog({ open: true, course });
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteCourse(deleteDialog.course.courseId);
      toast.success('Course deleted successfully');
      fetchCourses();
      setDeleteDialog({ open: false, course: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleModalClose = (shouldRefresh = false) => {
    setModalOpen(false);
    setSelectedCourse(null);
    if (shouldRefresh) {
      fetchCourses();
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
          <p className="mt-2 text-gray-600">
            Total Courses: {totalCount}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddCourse}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Course
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by course name..."
              value={searchTerm}
              onChange={handleSearch}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={handleCategoryFilter}
              className="input-field pl-10 pr-10"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {courses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    {course.imageUrl ? (
                      <img
                        src={`http://localhost:5000${course.imageUrl}`}
                        alt={course.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeColor(course.level)}`}>
                        {getLevelText(course.level)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {course.categoryName}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      By {course.instructorName}
                    </p>
                    
                    <div className="flex items-center mb-3">
                      {renderStars(course.rate)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({course.rate})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-primary-600">
                        ${course.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {course.totalHours}h
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCourse(course)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {course.hasCertification && (
                        <span className="text-xs text-green-600 font-medium">
                          Certificate
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Course Modal */}
      {modalOpen && (
        <CourseModal
          course={selectedCourse}
          categories={categories}
          onClose={handleModalClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <ConfirmDialog
          title="Delete Course"
          message={`Are you sure you want to delete "${deleteDialog.course?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDialog({ open: false, course: null })}
        />
      )}
    </div>
  );
};

export default Courses;
