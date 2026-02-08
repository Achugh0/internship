import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../../lib/api';

export default function CompanyDashboard() {
  const queryClient = useQueryClient();
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const { data: internships, isLoading } = useQuery({
    queryKey: ['my-internships'],
    queryFn: async () => {
      const { data } = await api.get('/internships/my-internships');
      return data;
    }
  });

  const { data: applications } = useQuery({
    queryKey: ['company-applications'],
    queryFn: async () => {
      const { data } = await api.get('/applications/company/applications');
      return data;
    }
  });

  const deleteInternshipMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/internships/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-internships']);
      alert('Internship deleted successfully!');
    }
  });

  const updateInternshipMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await api.put(`/internships/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-internships']);
      setShowEditModal(false);
      setSelectedInternship(null);
      alert('Internship updated successfully!');
    }
  });

  const openEditModal = (internship) => {
    setSelectedInternship(internship);
    setEditFormData({
      title: internship.title,
      description: internship.description,
      stipend_amount: internship.stipend_amount,
      duration_months: internship.duration_months,
      work_mode: internship.work_mode,
      location: internship.location,
      positions: internship.positions
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateInternshipMutation.mutate({
      id: selectedInternship.id,
      data: editFormData
    });
  };

  const stats = {
    total: internships?.length || 0,
    active: internships?.filter(i => i.is_active).length || 0,
    pending: internships?.filter(i => i.status === 'pending').length || 0,
    applications: applications?.length || 0
  };

  const getStatusBadge = (status, isActive) => {
    if (!isActive) return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>;
    if (status === 'pending') return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending Review</span>;
    if (status === 'approved') return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
    if (status === 'rejected') return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>;
    return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-green-100 mt-1">Manage your internship postings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Internships</p>
            <p className="text-3xl font-bold text-green-600">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Applications</p>
            <p className="text-3xl font-bold text-purple-600">{stats.applications}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/company/post-internship"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Post New Internship</h3>
                <p className="text-sm text-gray-600 mt-1">Create a new posting</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            to="/company/applications"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Applications</h3>
                <p className="text-sm text-gray-600 mt-1">{stats.applications} applications</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            to="/company/profile"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Company Profile</h3>
                <p className="text-sm text-gray-600 mt-1">Update your details</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Internships List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Internships</h2>
            <Link
              to="/company/post-internship"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Post New
            </Link>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading internships...</div>
          ) : internships?.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No internships posted yet</h3>
              <p className="text-gray-600 mb-6">Create your first internship posting to get started</p>
              <Link
                to="/company/post-internship"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Post Your First Internship
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {internships?.map((internship) => (
                <div key={internship.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{internship.title}</h3>
                        {getStatusBadge(internship.status, internship.is_active)}
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{internship.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>💰 ₹{internship.stipend_amount}/month</span>
                        <span>📅 {internship.duration_months} months</span>
                        <span>🏢 {internship.work_mode}</span>
                        {internship.location && <span>📍 {internship.location}</span>}
                        <span>👥 {internship.applications_count} applications</span>
                        <span>👁️ {internship.views} views</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(internship)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this internship?')) {
                            deleteInternshipMutation.mutate(internship.id);
                          }
                        }}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Internship</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stipend (₹/month)</label>
                  <input
                    type="number"
                    required
                    value={editFormData.stipend_amount}
                    onChange={(e) => setEditFormData({ ...editFormData, stipend_amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (months)</label>
                  <input
                    type="number"
                    required
                    value={editFormData.duration_months}
                    onChange={(e) => setEditFormData({ ...editFormData, duration_months: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Work Mode</label>
                  <select
                    required
                    value={editFormData.work_mode}
                    onChange={(e) => setEditFormData({ ...editFormData, work_mode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Positions</label>
                  <input
                    type="number"
                    value={editFormData.positions}
                    onChange={(e) => setEditFormData({ ...editFormData, positions: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={updateInternshipMutation.isLoading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {updateInternshipMutation.isLoading ? 'Updating...' : 'Update Internship'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedInternship(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
