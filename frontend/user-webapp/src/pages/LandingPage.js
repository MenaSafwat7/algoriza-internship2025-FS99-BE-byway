import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, BookOpen, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [coursesCount, setCoursesCount] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (coursesCount > 0) {
      animateCounter();
    }
  }, [coursesCount]);

  const fetchData = async () => {
    try {
      const [categoriesRes, coursesRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getTopRatedCourses(4)
      ]);
      
      setCategories(categoriesRes.data);
      setTopCourses(coursesRes.data);
      
      // Calculate total courses from categories
      const totalCourses = categoriesRes.data.reduce((sum, cat) => sum + cat.courseCount, 0);
      setCoursesCount(totalCourses);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const animateCounter = () => {
    const target = Math.min(coursesCount, 2400); // Cap at 2400 as per requirements
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 50);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedCount(target);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(current));
      }
    }, 50);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      image: "/api/placeholder/64/64",
      rating: 5,
      comment: "The courses here are incredibly well-structured. I went from beginner to landing my first developer job in just 6 months!"
    },
    {
      name: "Michael Chen",
      role: "Full Stack Developer",
      image: "/api/placeholder/64/64",
      rating: 5,
      comment: "Amazing instructors and practical projects. The certificate I earned helped me get promoted at work."
    },
    {
      name: "Emily Rodriguez",
      role: "UI/UX Designer",
      image: "/api/placeholder/64/64",
      rating: 5,
      comment: "Love the interactive learning approach. The design courses are top-notch with real-world applications."
    }
  ];

  const instructors = [
    {
      name: "John Smith",
      role: "Full Stack Developer",
      image: "/api/placeholder/100/100",
      experience: "8+ years",
      courses: 12
    },
    {
      name: "Sarah Wilson",
      role: "UI/UX Designer",
      image: "/api/placeholder/100/100",
      experience: "6+ years",
      courses: 8
    },
    {
      name: "David Brown",
      role: "Backend Specialist",
      image: "/api/placeholder/100/100",
      experience: "10+ years",
      courses: 15
    }
  ];

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Learn from the{' '}
                <span className="text-gradient">Best Mentors</span>{' '}
                in Tech
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Master cutting-edge technologies with expert-led courses. Build real projects, 
                earn certificates, and advance your career in tech.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="btn-primary flex items-center justify-center">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="btn-secondary flex items-center justify-center">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Learning Today</h3>
                  <p className="text-gray-600 mb-6">Join thousands of students already learning</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary-600">50K+</div>
                      <div className="text-sm text-gray-500">Students</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary-600">98%</div>
                      <div className="text-sm text-gray-500">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-blue-400 rounded-2xl transform rotate-6"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Bar */}
      <section className="bg-primary-600 py-8">
        <div className="container-custom">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h3 className="text-2xl font-bold mb-2">Courses by our best mentors</h3>
              <div className="text-5xl font-bold">
                {animatedCount.toLocaleString()}+
              </div>
              <p className="text-primary-100 mt-2">Premium courses available</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Top Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our most popular course categories and start your learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.categoryId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center hover:shadow-lg transition-all duration-200 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-200 transition-colors">
                  <BookOpen className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.courseCount} courses</p>
                <Link 
                  to={`/courses?category=${category.categoryId}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mt-4 transition-colors"
                >
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Courses */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Top Rated Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our highest-rated courses, loved by students worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCourses.map((course, index) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="course-card"
              >
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
                    <span className="text-sm text-primary-600 font-medium">
                      {course.categoryName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.totalHours}h
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    By {course.instructorName}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    {renderStars(course.rate)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({course.rate}.0)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ${course.price}
                    </span>
                    <Link
                      to={`/courses/${course.courseId}`}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses" className="btn-outline">
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Instructors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from industry professionals with years of real-world experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{instructor.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{instructor.role}</p>
                <p className="text-gray-600 text-sm mb-4">{instructor.experience} experience</p>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {instructor.courses} courses
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their careers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join our community of learners and take the first step towards your dream career in tech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
                Get Started Free
              </Link>
              <Link to="/courses" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
