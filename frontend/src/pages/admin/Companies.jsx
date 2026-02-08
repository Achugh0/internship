import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../lib/api';

export default function AdminCompanies() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'company'
  });

  const { data: companies, isLoading } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users?role=company');
      return data;
    }
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (companyData) => {
      const { data } = await api.post('/admin/users', companyData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-companies']);
      setShowCreateModal(false);
      setFormData({ email: '', password: '', full_name: '', role: 'company' });
      alert('Company created successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.detail || 'Failed to create company');
    }
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-companies']);
      setShowEditModal(false);
      setSelectedCompany(null);
      alert('Company updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.detail || 'Failed to update company');
    }
  });

  const verifyCompanyMutation = useMutation({
    mutationFn: async (companyId) => {
      const { data } = await api.put(`/admin/users/${companyId}`, { is_verified: true });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-companies']);
      alert('Company verified successfully!');
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ companyId, isActive }) => {
      const endpoint = isActive ? 'deactivate' : 'activate';
      const { data } = await api.post(`/admin/users/${companyId}/${endpoint}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-companies']);
    }
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId) => {
      const { data } = await api.delete(`/admin/users/${companyId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-companies']);
      alert('Company deleted successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.detail || 'Failed to delete company');
    }
  });

  const handleCreateCompany = (e) => {
    e.preventDefault();
    createCompanyMutation.mutate(formData);
  };

  const handleEditCompany = (e) => {
    e.preventDefault();
    updateCompanyMutation.mutate({
      id: selectedCompany.id,
      data: {
        full_name: formData.full_name,
        email: formData.email,
        is_verified: formData.is_verified,
        is_active: formData.is_active
      }
    });
  };

  const openEditModal = (company) => {
    setSelectedCompany(company);
    setFormData({
      email: company.email,
      full_name: company.full_name,
      is_verified: company.is_verified,
      is_active: company.is_active
    });
    setShowEditModal(true);
  };

  const stats = {
    total: companies?.length || 0,
    verified: companies?.filter(c => c.is_verified).length || 0,
    pending: companies?.filter(c => !c.is_verified && c.is_active).length || 0,
    suspended: companies?.filter(c => !c.is_active).length || 0
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Company Management</h1>
              <p className="text-green-100 mt-1">Verify and manage company accounts</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              + Add Company
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Companies</p>
            <p className="text-3xl font-bold text-green-600">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Verified</p>
            <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Suspended</p>
            <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
          </div>
        </div>

        {/* Companies List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All Companies</h2>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading companies...</div>
            ) : companies?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No companies found. Create one to get started.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {companies?.map((company) => (
                    <tr key={company.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{company.full_name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {company.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          company.is_verified ? 'bg-green-100 text-green-800' :
                          company.is_active ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {company.is_verified ? 'Verified' : company.is_active ? 'Pending' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(company.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button 
                          onClick={() => openEditModal(company)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        {!company.is_verified && (
                          <button 
                            onClick={() => verifyCompanyMutation.mutate(company.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Verify
                          </button>
                        )}
                        <button 
                          onClick={() => toggleActiveMutation.mutate({ companyId: company.id, isActive: company.is_active })}
                          className={company.is_active ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}
                        >
                          {company.is_active ? 'Suspend' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this company?')) {
                              deleteCompanyMutation.mutate(company.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Create Company Account</h2>
            <form onSubmit={handleCreateCompany}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={createCompanyMutation.isLoading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {createCompanyMutation.isLoading ? 'Creating...' : 'Create Company'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ email: '', password: '', full_name: '', role: 'company' });
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

      {/* Edit Company Modal */}
      {showEditModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Edit Company</h2>
            <form onSubmit={handleEditCompany}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_verified"
                    checked={formData.is_verified}
                    onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_verified" className="text-sm font-medium text-gray-700">Verified</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={updateCompanyMutation.isLoading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {updateCompanyMutation.isLoading ? 'Updating...' : 'Update Company'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCompany(null);
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
