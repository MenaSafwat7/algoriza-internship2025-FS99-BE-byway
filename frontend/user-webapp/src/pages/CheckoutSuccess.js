import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, BookOpen, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const CheckoutSuccess = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        }
      });

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Purchase Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Congratulations! Your payment was successful and you now have access to your courses.
            </p>
          </motion.div>

          {/* Order Details */}
          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="card p-8 mb-8 text-left"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Order Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary-600">
                    {orderDetails.coursesCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Course{orderDetails.coursesCount !== 1 ? 's' : ''} Purchased
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {orderDetails.coursesCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Certificate{orderDetails.coursesCount !== 1 ? 's' : ''} Available
                  </div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    ${orderDetails.total.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Paid
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Courses:
                </h3>
                <div className="space-y-3">
                  {orderDetails.courses.map((course) => (
                    <div key={course.courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-primary-100 rounded flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                          <p className="text-sm text-gray-600">By {course.instructorName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${course.price.toFixed(2)}</div>
                        <div className="text-sm text-green-600">✓ Access Granted</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="card p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              What's Next?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Learning</h3>
                <p className="text-gray-600 text-sm">
                  Access your courses immediately and begin your learning journey.
                </p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Download Resources</h3>
                <p className="text-gray-600 text-sm">
                  Get access to downloadable materials and course resources.
                </p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Earn Certificate</h3>
                <p className="text-gray-600 text-sm">
                  Complete courses to earn your certificates of completion.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => toast.info('My Courses feature coming soon!')}
              className="btn-primary flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Go to My Courses
            </button>
            
            <Link
              to="/courses"
              className="btn-secondary flex items-center justify-center"
            >
              Browse More Courses
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 p-6 bg-blue-50 rounded-lg"
          >
            <h3 className="font-semibold text-blue-900 mb-2">
              📧 Confirmation Email Sent
            </h3>
            <p className="text-blue-800 text-sm">
              We've sent a confirmation email with your purchase details and course access information. 
              If you don't see it in your inbox, please check your spam folder.
            </p>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 text-sm">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@lms.com" className="text-primary-600 hover:text-primary-700">
                support@lms.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
