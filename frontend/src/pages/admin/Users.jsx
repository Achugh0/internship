import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

export default function AdminUsers() {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterActive, setFilterActive] = useState('');
  
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', filterRole, filterActive],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterRole) params.append('role', filterRole);
      if (filterActive !== '') params.append('is_active', filterActive);
      const { data } = await api.get(`/admin/users?${params}`);
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      return await api.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      alert('User deleted successfully');
    }
  });

  const activateMutation = useMutation({
    mutationFn: async (userId) => {
      return await api.post(`/admin/users/${userId}/activate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: async (userId) => {
      return await api.post(`/admin/users/${userId}/deactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    }
  });

  const bulkActionMutation = useMutation({
    mutationFn: async ({ action }) => {
      return await api.post('/admin/users/bulk-action', {
        user_ids: selectedUsers,
        action
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin-users']);
      setSelectedUsers([]);
      alert(`Bulk action completed. Affected: ${data.data.affected}`);
    }
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }
    if (confirm(`Are you sure you want to ${action} ${selectedUsers.length} users?`)) {
      bulkActionMutation.mutate({ action });
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + Create User
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                📤 Bulk Import
              </button>
            </div>

            <div className="flex gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="company">Companies</option>
                <option value="admin">Admins</option>
              </select>

              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-4 flex gap-2">
              <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
              <button
                onClick={() => handleBulkAction('activate')}
                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200"
              >
                Activate All
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
              >
                Deactivate All
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
              >
                Delete All
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedUsers.length === users?.length}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.full_name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'company' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {user.is_active ? (
                      <button
                        onClick={() => deactivateMutation.mutate(user.id)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => activateMutation.mutate(user.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Delete this user?')) {
                          deleteMutation.mutate(user.id);
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
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['admin-users']);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <BulkImportModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['admin-users']);
            setShowBulkModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student'
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await api.post('/admin/users', data);
    },
    onSuccess: () => {
      alert('User created successfully');
      onSuccess();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            required
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BulkImportModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);

  const importMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return await api.post('/admin/users/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: (data) => {
      alert(`Imported ${data.data.created} users. Errors: ${data.data.errors.length}`);
      onSuccess();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      importMutation.mutate(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Bulk Import Users</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload a CSV file with columns: email, password, full_name, role
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!file || importMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Import
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
