import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, BookOpen, Award, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, coursesRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getTopRatedCourses(4)
      ]);

      setCategories(categoriesRes.data);
      setTopCourses(coursesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const testimonials = [
    {
      name: "Julia Doe",
      role: "Student",
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
      name: "Ronald Richards",
      role: "UI/UX Designer",
      image: "/api/placeholder/100/100",
      rating: 5,
      students: 250
    },
    {
      name: "Sarah Wilson",
      role: "Frontend Developer",
      image: "/api/placeholder/100/100",
      rating: 5,
      students: 180
    },
    {
      name: "David Brown",
      role: "Backend Specialist",
      image: "/api/placeholder/100/100",
      rating: 5,
      students: 320
    },
    {
      name: "Lisa Johnson",
      role: "Full Stack Developer",
      image: "/api/placeholder/100/100",
      rating: 5,
      students: 200
    },
    {
      name: "Mike Davis",
      role: "DevOps Engineer",
      image: "/api/placeholder/100/100",
      rating: 5,
      students: 150
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
    <div className="min-h-screen bg-white">
      {}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Unlock Your Potential{' '}
                <span className="text-blue-600">With Byway</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Welcome to Byway, where learning is made easy. Discover thousands of courses,
                master new skills, and achieve your goals with our expert-led instructors and comprehensive learning paths.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {}
              <div className="relative">
                {}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face" alt="Student" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-8 left-0 w-28 h-28 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=112&h=112&fit=crop&crop=face" alt="Student" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-8 w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face" alt="Student" className="w-full h-full object-cover" />
                </div>
                {}
                <div className="absolute bottom-4 left-4 w-40 h-24 bg-gray-200 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=160&h=96&fit=crop" alt="Group" className="w-full h-full object-cover" />
                </div>
                {}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Play className="h-6 w-6 text-white ml-1" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <AnimatedCounter
                end={250}
                duration={2000}
                suffix="+"
                label="Global Students"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <AnimatedCounter
                end={1000}
                duration={2000}
                suffix="+"
                label="Online Courses"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <AnimatedCounter
                end={15}
                duration={2000}
                suffix="+"
                label="Expert Instructors"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <AnimatedCounter
                end={2400}
                duration={2000}
                suffix="+"
                label="Happy Customers"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Top Categories
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.categoryId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.courseCount} Courses</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Top Courses
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCourses.map((course, index) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/courses/${course.courseId}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 block"
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.name}
                    </h3>

                    <div className="flex items-center mb-3">
                      {renderStars(course.rate)}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      By {course.instructorName}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${course.price}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Top Instructors
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {instructors.map((instructor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                  <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{instructor.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{instructor.role}</p>
                <div className="flex items-center justify-center mb-2">
                  {renderStars(instructor.rating)}
                </div>
                <p className="text-gray-500 text-sm">{instructor.students} Students</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              What Our Customer Say About Us
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative"
              >
                <div className="absolute top-4 left-4 text-blue-400 text-4xl">"</div>
                <p className="text-gray-600 mb-6 mt-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 overflow-hidden">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
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

      {/* CTA Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Become an Instructor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center"
            >
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mr-8">
                <img src="https://via.placeholder.com/128x128/8B5CF6/FFFFFF?text=Teach" alt="Instructor" className="w-16 h-16" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Become an Instructor</h3>
                <p className="text-gray-600 mb-6">
                  Share your knowledge and expertise with students worldwide. Join our community of expert instructors.
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Start Teaching Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Transform your life through education</h3>
                <p className="text-gray-600 mb-6">
                  Take control of your future with our comprehensive learning paths designed for career advancement.
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center ml-8">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face" alt="Student" className="w-full h-full object-cover rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
