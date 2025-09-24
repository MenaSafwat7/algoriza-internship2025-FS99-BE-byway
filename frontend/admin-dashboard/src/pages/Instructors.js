import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Star } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import InstructorModal from '../components/InstructorModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, instructor: null });
  const pageSize = 10;

  useEffect(() => {
    fetchInstructors();
  }, [currentPage, searchTerm]);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await apiService.getInstructors({
        page: currentPage,
        pageSize,
        search: searchTerm
      });
      setInstructors(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      toast.error('Failed to fetch instructors');
      console.error('Fetch instructors error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddInstructor = () => {
    setSelectedInstructor(null);
    setModalOpen(true);
  };

  const handleEditInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setModalOpen(true);
  };

  const handleViewInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setModalOpen(true);
  };

  const handleDeleteInstructor = (instructor) => {
    setDeleteDialog({ open: true, instructor });
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteInstructor(deleteDialog.instructor.instructorId);
      toast.success('Instructor deleted successfully');
      fetchInstructors();
      setDeleteDialog({ open: false, instructor: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete instructor');
    }
  };

  const handleModalClose = (shouldRefresh = false) => {
    setModalOpen(false);
    setSelectedInstructor(null);
    if (shouldRefresh) {
      fetchInstructors();
    }
  };

  const getJobTitleDisplay = (jobTitle) => {
    const titles = {
      1: 'Frontend Developer',
      2: 'Backend Developer',
      3: 'Full Stack Developer',
      4: 'UI/UX Designer'
    };
    return titles[jobTitle] || 'Unknown';
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
          <h1 className="text-3xl font-bold text-gray-900">Instructors Management</h1>
          <p className="mt-2 text-gray-600">
            Total Instructors: {totalCount}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddInstructor}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Instructor
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or job title..."
            value={searchTerm}
            onChange={handleSearch}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Instructors Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No instructors found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructors.map((instructor) => (
                    <tr key={instructor.instructorId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {instructor.imageUrl ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`http://localhost:5000${instructor.imageUrl}`}
                                alt={instructor.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {instructor.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {instructor.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getJobTitleDisplay(instructor.jobTitle)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(instructor.rate)}
                          <span className="ml-2 text-sm text-gray-600">
                            ({instructor.rate})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {instructor.courseCount} courses
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewInstructor(instructor)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditInstructor(instructor)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(instructor)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* Instructor Modal */}
      {modalOpen && (
        <InstructorModal
          instructor={selectedInstructor}
          onClose={handleModalClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <ConfirmDialog
          title="Delete Instructor"
          message={`Are you sure you want to delete ${deleteDialog.instructor?.name}? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDialog({ open: false, instructor: null })}
        />
      )}
    </div>
  );
};

export default Instructors;
