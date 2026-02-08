export default function CompanyDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Active Internships</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Trust Score</h3>
          <p className="text-3xl font-bold">50</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Response Rate</h3>
          <p className="text-3xl font-bold">0%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button className="w-full bg-primary text-white py-3 px-6 rounded hover:bg-blue-600">
            Post New Internship
          </button>
          <button className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded hover:bg-gray-300">
            View Applications
          </button>
        </div>
      </div>
    </div>
  );
}
