import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function StudentDashboard() {
  const { data: applications } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data } = await api.get('/applications/my-applications');
      return data;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold">{applications?.data?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Shortlisted</h3>
          <p className="text-3xl font-bold">
            {applications?.data?.filter(a => a.status === 'shortlisted').length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Offers</h3>
          <p className="text-3xl font-bold">
            {applications?.data?.filter(a => a.status === 'offer_made').length || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">My Applications</h2>
        </div>
        <div className="divide-y">
          {applications?.data?.map((app) => (
            <div key={app._id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{app.internshipId?.title}</h3>
                  <p className="text-gray-600">{app.companyId?.profile?.name}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  app.status === 'offer_made' ? 'bg-green-100 text-green-800' :
                  app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
