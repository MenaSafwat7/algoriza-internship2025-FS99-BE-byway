import React, { useState, useEffect } from 'react';
import { X, Upload, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const InstructorModal = ({ instructor, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const selectedRate = watch('rate', 1);

  useEffect(() => {
    if (instructor) {
      setValue('name', instructor.name);
      setValue('jobTitle', instructor.jobTitle);
      setValue('rate', instructor.rate);
      setValue('description', instructor.description || '');
      
      if (instructor.imageUrl) {
        setImagePreview(`http://localhost:5000${instructor.imageUrl}`);
      }
    }
  }, [instructor, setValue]);

  const jobTitleOptions = [
    { value: 1, label: 'Frontend Developer' },
    { value: 2, label: 'Backend Developer' },
    { value: 3, label: 'Full Stack Developer' },
    { value: 4, label: 'UI/UX Designer' }
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

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('jobTitle', data.jobTitle);
      formData.append('rate', data.rate);
      formData.append('description', data.description || '');
      
      const imageFile = data.image?.[0];
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (instructor) {
        await apiService.updateInstructor(instructor.instructorId, formData);
        toast.success('Instructor updated successfully');
      } else {
        await apiService.createInstructor(formData);
        toast.success('Instructor created successfully');
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

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {instructor ? (isViewMode ? 'View Instructor' : 'Edit Instructor') : 'Add New Instructor'}
              </h3>
              <div className="flex items-center space-x-2">
                {instructor && (
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
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

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="mt-1 input-field"
                  placeholder="Enter instructor name"
                  disabled={isViewMode}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                  Job Title *
                </label>
                <select
                  {...register('jobTitle', { required: 'Job title is required' })}
                  className="mt-1 input-field"
                  disabled={isViewMode}
                >
                  <option value="">Select job title</option>
                  {jobTitleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.jobTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>
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

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="mt-1 input-field"
                  placeholder="Enter instructor description"
                  disabled={isViewMode}
                />
              </div>

              {/* Action Buttons */}
              {!isViewMode && (
                <div className="flex justify-end space-x-3 pt-4">
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
                      instructor ? 'Update' : 'Create'
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

export default InstructorModal;
