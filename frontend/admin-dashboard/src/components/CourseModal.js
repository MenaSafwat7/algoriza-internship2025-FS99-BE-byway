import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const CourseModal = ({ course, categories, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm({
    defaultValues: {
      topics: [{ topicName: '', lectureCount: 1, durationMinutes: 60, order: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics'
  });

  const selectedRate = watch('rate', 1);

  useEffect(() => {
    fetchInstructors();
    if (course) {
      populateForm();
    }
  }, [course]);

  const fetchInstructors = async () => {
    try {
      const response = await apiService.getInstructors({ pageSize: 100 });
      setInstructors(response.data.items);
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    }
  };

  const populateForm = () => {
    setValue('name', course.name);
    setValue('description', course.description || '');
    setValue('categoryId', course.categoryId);
    setValue('instructorId', course.instructorId);
    setValue('level', course.level);
    setValue('totalHours', course.totalHours);
    setValue('rate', course.rate);
    setValue('price', course.price);
    setValue('hasCertification', course.hasCertification);
    
    if (course.topics && course.topics.length > 0) {
      setValue('topics', course.topics);
    }
    
    if (course.imageUrl) {
      setImagePreview(`http://localhost:5000${course.imageUrl}`);
    }
  };

  const levelOptions = [
    { value: 1, label: 'Beginner' },
    { value: 2, label: 'Intermediate' },
    { value: 3, label: 'Advanced' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTopic = () => {
    const nextOrder = fields.length + 1;
    append({ topicName: '', lectureCount: 1, durationMinutes: 60, order: nextOrder });
  };

  const removeTopic = (index) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error('At least one topic is required');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('categoryId', data.categoryId);
      formData.append('instructorId', data.instructorId);
      formData.append('level', data.level);
      formData.append('totalHours', data.totalHours);
      formData.append('rate', data.rate);
      formData.append('price', data.price);
      formData.append('hasCertification', data.hasCertification);
      
      // Add topics
      data.topics.forEach((topic, index) => {
        formData.append(`topics[${index}].topicName`, topic.topicName);
        formData.append(`topics[${index}].lectureCount`, topic.lectureCount);
        formData.append(`topics[${index}].durationMinutes`, topic.durationMinutes);
        formData.append(`topics[${index}].order`, index + 1);
      });
      
      const imageFile = data.image?.[0];
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (course) {
        await apiService.updateCourse(course.courseId, formData);
        toast.success('Course updated successfully');
      } else {
        await apiService.createCourse(formData);
        toast.success('Course created successfully');
      }
      
      onClose(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type={interactive ? "button" : undefined}
        className={`h-6 w-6 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-400 transition-colors' : ''}`}
        onClick={interactive ? () => setValue('rate', index + 1) : undefined}
        disabled={!interactive}
      >
        <Star className="h-full w-full" />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => onClose()}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {course ? (isViewMode ? 'View Course' : 'Edit Course') : 'Add New Course'}
              </h3>
              <div className="flex items-center space-x-2">
                {course && (
                  <button
                    type="button"
                    onClick={() => setIsViewMode(!isViewMode)}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    {isViewMode ? 'Edit' : 'View'}
                  </button>
                )}
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => onClose()}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Course Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Course Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="h-32 w-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      {!isViewMode && (
                        <div>
                          <input
                            {...register('image')}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer btn-secondary text-sm"
                          >
                            Choose Image
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Course Name *
                    </label>
                    <input
                      {...register('name', { required: 'Course name is required' })}
                      type="text"
                      className="mt-1 input-field"
                      placeholder="Enter course name"
                      disabled={isViewMode}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      {...register('categoryId', { required: 'Category is required' })}
                      className="mt-1 input-field"
                      disabled={isViewMode}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                    )}
                  </div>

                  {/* Instructor */}
                  <div>
                    <label htmlFor="instructorId" className="block text-sm font-medium text-gray-700">
                      Instructor *
                    </label>
                    <select
                      {...register('instructorId', { required: 'Instructor is required' })}
                      className="mt-1 input-field"
                      disabled={isViewMode}
                    >
                      <option value="">Select instructor</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.instructorId} value={instructor.instructorId}>
                          {instructor.name}
                        </option>
                      ))}
                    </select>
                    {errors.instructorId && (
                      <p className="mt-1 text-sm text-red-600">{errors.instructorId.message}</p>
                    )}
                  </div>

                  {/* Level */}
                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                      Level *
                    </label>
                    <select
                      {...register('level', { required: 'Level is required' })}
                      className="mt-1 input-field"
                      disabled={isViewMode}
                    >
                      <option value="">Select level</option>
                      {levelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.level && (
                      <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
                    )}
                  </div>

                  {/* Total Hours */}
                  <div>
                    <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700">
                      Total Hours *
                    </label>
                    <input
                      {...register('totalHours', { 
                        required: 'Total hours is required',
                        min: { value: 1, message: 'Must be at least 1 hour' }
                      })}
                      type="number"
                      min="1"
                      className="mt-1 input-field"
                      placeholder="Enter total hours"
                      disabled={isViewMode}
                    />
                    {errors.totalHours && (
                      <p className="mt-1 text-sm text-red-600">{errors.totalHours.message}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price ($) *
                    </label>
                    <input
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price cannot be negative' }
                      })}
                      type="number"
                      step="0.01"
                      min="0"
                      className="mt-1 input-field"
                      placeholder="Enter price"
                      disabled={isViewMode}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-1">
                      {renderStars(selectedRate, !isViewMode)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({selectedRate} star{selectedRate !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <input
                      {...register('rate', { required: 'Rating is required' })}
                      type="hidden"
                    />
                  </div>

                  {/* Has Certification */}
                  <div className="flex items-center">
                    <input
                      {...register('hasCertification')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      disabled={isViewMode}
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Provides Certificate
                    </label>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="mt-1 input-field"
                      placeholder="Enter course description"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Course Topics */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Course Topics</h4>
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={addTopic}
                      className="btn-secondary text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Topic
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Topic {index + 1}</h5>
                        {!isViewMode && fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTopic(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Topic Name *
                          </label>
                          <input
                            {...register(`topics.${index}.topicName`, {
                              required: 'Topic name is required'
                            })}
                            type="text"
                            className="mt-1 input-field"
                            placeholder="Enter topic name"
                            disabled={isViewMode}
                          />
                          {errors.topics?.[index]?.topicName && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.topics[index].topicName.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Lectures *
                          </label>
                          <input
                            {...register(`topics.${index}.lectureCount`, {
                              required: 'Lecture count is required',
                              min: { value: 1, message: 'Must be at least 1' }
                            })}
                            type="number"
                            min="1"
                            className="mt-1 input-field"
                            disabled={isViewMode}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Duration (minutes) *
                          </label>
                          <input
                            {...register(`topics.${index}.durationMinutes`, {
                              required: 'Duration is required',
                              min: { value: 1, message: 'Must be at least 1 minute' }
                            })}
                            type="number"
                            min="1"
                            className="mt-1 input-field"
                            disabled={isViewMode}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {!isViewMode && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      course ? 'Update Course' : 'Create Course'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
