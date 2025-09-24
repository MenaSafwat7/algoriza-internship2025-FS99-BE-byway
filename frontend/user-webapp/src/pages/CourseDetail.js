import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  Play, 
  CheckCircle,
  ArrowLeft,
  ShoppingCart
} from 'lucide-react';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      fetchRelatedCourses();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCourse(id);
      setCourse(response.data);
    } catch (error) {
      toast.error('Failed to fetch course details');
      console.error('Fetch course error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedCourses = async () => {
    try {
      const response = await apiService.getRelatedCourses(id, 4);
      setRelatedCourses(response.data);
    } catch (error) {
      console.error('Fetch related courses error:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add courses to cart');
      return;
    }
    
    await addToCart(parseInt(id));
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to purchase courses');
      return;
    }
    
    const result = await addToCart(parseInt(id));
    if (result.success) {
      // Redirect to checkout
      window.location.href = '/checkout';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
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

  const calculateTotalLectures = (topics) => {
    return topics?.reduce((total, topic) => total + topic.lectureCount, 0) || 0;
  };

  const calculateTotalDuration = (topics) => {
    const totalMinutes = topics?.reduce((total, topic) => total + topic.durationMinutes, 0) || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent course! The instructor explains everything clearly and the projects are very practical."
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      date: "1 month ago",
      comment: "Great content and well-structured. Would definitely recommend to anyone starting out."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 5,
      date: "2 months ago",
      comment: "This course helped me land my first job as a developer. Thank you!"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/courses" className="text-primary-600 hover:text-primary-700 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{course.categoryName}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{course.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="card p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-80 flex-shrink-0">
                  {course.imageUrl ? (
                    <img
                      src={`http://localhost:5045${course.imageUrl}`}
                      alt={course.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(course.level)}`}>
                      {getLevelText(course.level)}
                    </span>
                    <span className="text-sm text-primary-600 font-medium">
                      {course.categoryName}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {course.name}
                  </h1>
                  
                  <p className="text-gray-600 mb-4">
                    By <span className="font-medium text-gray-900">{course.instructorName}</span>
                  </p>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center">
                      {renderStars(course.rate)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({course.rate}.0 rating)
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">1,234 students</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{course.totalHours} hours</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary-600">
                      ${course.price}
                    </span>
                    {course.hasCertification && (
                      <div className="flex items-center text-green-600">
                        <Award className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Certificate included</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'content', label: 'Course Content' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Course Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {course.description || 'No description available for this course.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        What you'll learn
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Master the fundamentals and advanced concepts',
                          'Build real-world projects from scratch',
                          'Learn industry best practices',
                          'Get hands-on experience with tools',
                          'Understand core principles and patterns',
                          'Prepare for technical interviews'
                        ].map((item, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Course Content
                      </h3>
                      <div className="text-sm text-gray-600">
                        {course.topics?.length || 0} sections • {calculateTotalLectures(course.topics)} lectures • {calculateTotalDuration(course.topics)} total length
                      </div>
                    </div>
                    
                    {course.topics && course.topics.length > 0 ? (
                      <div className="space-y-3">
                        {course.topics.map((topic, index) => (
                          <div key={topic.topicId} className="border border-gray-200 rounded-lg">
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  Section {index + 1}: {topic.topicName}
                                </h4>
                                <div className="text-sm text-gray-600">
                                  {topic.lectureCount} lectures • {Math.floor(topic.durationMinutes / 60)}h {topic.durationMinutes % 60}m
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="space-y-2">
                                {[...Array(topic.lectureCount)].map((_, lectureIndex) => (
                                  <div key={lectureIndex} className="flex items-center text-sm text-gray-600">
                                    <Play className="h-4 w-4 mr-3 text-gray-400" />
                                    <span>Lecture {lectureIndex + 1}: Introduction to {topic.topicName}</span>
                                    <span className="ml-auto">
                                      {Math.floor(topic.durationMinutes / topic.lectureCount)}m
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Course content will be available soon.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Student Reviews
                      </h3>
                      <div className="flex items-center">
                        {renderStars(course.rate)}
                        <span className="ml-2 text-sm text-gray-600">
                          {course.rate}.0 out of 5 ({reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.name}</h4>
                              <div className="flex items-center mt-1">
                                {renderStars(review.rating)}
                                <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Purchase Card */}
              <div className="card p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    ${course.price}
                  </div>
                  <p className="text-gray-600">One-time payment</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {isInCart(course.courseId) ? (
                    <Link to="/cart" className="w-full btn-primary text-center block">
                      Go to Cart
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={handleBuyNow}
                        className="w-full btn-primary"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="w-full btn-secondary flex items-center justify-center"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </button>
                    </>
                  )}
                </div>
                
                <div className="text-center text-sm text-gray-600 mb-4">
                  30-day money-back guarantee
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{course.totalHours} hours on-demand video</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{calculateTotalLectures(course.topics)} lectures</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Full lifetime access</span>
                  </div>
                  {course.hasCertification && (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-3 text-gray-400" />
                      <span>Certificate of completion</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructor Card */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About the Instructor
                </h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{course.instructorName}</h4>
                    <p className="text-sm text-gray-600">Expert Instructor</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Professional developer with years of experience in the industry.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More courses like this
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCourses.map((relatedCourse) => (
                <div key={relatedCourse.courseId} className="course-card">
                  <div className="aspect-w-16 aspect-h-9">
                    {relatedCourse.imageUrl ? (
                      <img
                        src={`http://localhost:5045${relatedCourse.imageUrl}`}
                        alt={relatedCourse.name}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedCourse.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      By {relatedCourse.instructorName}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {renderStars(relatedCourse.rate)}
                        <span className="ml-1 text-sm text-gray-600">
                          ({relatedCourse.rate}.0)
                        </span>
                      </div>
                      <span className="font-bold text-primary-600">
                        ${relatedCourse.price}
                      </span>
                    </div>
                    <Link
                      to={`/courses/${relatedCourse.courseId}`}
                      className="mt-3 block btn-primary text-center text-sm py-2"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
