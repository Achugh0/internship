import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function StudentApplications() {
  const queryClient = useQueryClient();
  
  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data } = await api.get('/applications/my-applications');
      return data;
    }
  });

  const withdrawMutation = useMutation({
    mutationFn: async (applicationId) => {
      await api.delete(`/applications/${applicationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-applications']);
      alert('Application withdrawn successfully');
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-gray-100 text-gray-800',
      viewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      interview_scheduled: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      offer_made: 'bg-green-100 text-green-800',
      accepted: 'bg-green-200 text-green-900',
      declined: 'bg-gray-200 text-gray-900'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'offer_made') return '🎉';
    if (status === 'shortlisted') return '⭐';
    if (status === 'interview_scheduled') return '📅';
    if (status === 'rejected') return '❌';
    if (status === 'viewed') return '👀';
    return '📝';
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading applications...</div>;
  }

  const stats = {
    total: applications?.length || 0,
    shortlisted: applications?.filter(a => a.status === 'shortlisted').length || 0,
    interviews: applications?.filter(a => a.status === 'interview_scheduled').length || 0,
    offers: applications?.filter(a => a.status === 'offer_made').length || 0
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600">Total Applied</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.shortlisted}</div>
          <div className="text-gray-600">Shortlisted</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.interviews}</div>
          <div className="text-gray-600">Interviews</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
          <div className="text-gray-600">Offers</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow">
        {applications?.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">Start applying to internships to see them here</p>
            <Link 
              to="/internships"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Internships
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {applications?.map((app) => (
              <div key={app.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getStatusIcon(app.status)}</span>
                      <div>
                        <h3 className="text-xl font-semibold">{app.internship_title || 'Internship'}</h3>
                        <p className="text-gray-600">{app.company_name || 'Company'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                      <span>📅 Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>

                    {app.interview_scheduled && app.interview_date && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm font-medium text-yellow-800">
                          📅 Interview scheduled for {new Date(app.interview_date).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {app.cover_letter && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700 line-clamp-2">{app.cover_letter}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    
                    {app.status === 'submitted' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to withdraw this application?')) {
                            withdrawMutation.mutate(app.id);
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
