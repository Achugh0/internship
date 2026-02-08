import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function AdminReports() {
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-purple-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-purple-100 mt-1">Platform insights and statistics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-purple-600">
              {(stats?.total_students || 0) + (stats?.total_companies || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stats?.total_students || 0} students, {stats?.total_companies || 0} companies
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.active_users || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Currently active accounts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">Inactive Users</h3>
            <p className="text-3xl font-bold text-red-600">{stats?.inactive_users || 0}</p>
            <p className="text-xs text-gray-500 mt-2">Suspended or deactivated</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">Growth Rate</h3>
            <p className="text-3xl font-bold text-blue-600">+12%</p>
            <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">User Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="text-sm font-semibold">{stats?.total_students || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${((stats?.total_students || 0) / ((stats?.total_students || 0) + (stats?.total_companies || 0)) * 100) || 0}%` 
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Companies</span>
                  <span className="text-sm font-semibold">{stats?.total_companies || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${((stats?.total_companies || 0) / ((stats?.total_students || 0) + (stats?.total_companies || 0)) * 100) || 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Account Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="text-sm font-semibold">{stats?.active_users || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${((stats?.active_users || 0) / ((stats?.active_users || 0) + (stats?.inactive_users || 0)) * 100) || 0}%` 
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Inactive</span>
                  <span className="text-sm font-semibold">{stats?.inactive_users || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ 
                      width: `${((stats?.inactive_users || 0) / ((stats?.active_users || 0) + (stats?.inactive_users || 0)) * 100) || 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Platform Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">New user registrations</p>
                  <p className="text-xs text-gray-500">Last 24 hours</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">+15</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Internships posted</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">+8</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Applications submitted</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600">+42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
