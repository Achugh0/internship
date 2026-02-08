import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function InternshipList() {
  const [filters, setFilters] = useState({
    search: '',
    workMode: '',
    minStipend: '',
    maxStipend: ''
  });

  const { data, isLoading } = useQuery({
    queryKey: ['internships', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await api.get(`/internships?${params}`);
      return data;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Internships</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filters.workMode}
            onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Work Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="office">Office</option>
          </select>
          <input
            type="number"
            placeholder="Min Stipend"
            value={filters.minStipend}
            onChange={(e) => setFilters({ ...filters, minStipend: e.target.value })}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Max Stipend"
            value={filters.maxStipend}
            onChange={(e) => setFilters({ ...filters, maxStipend: e.target.value })}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-6">
          {data?.data?.map((internship) => (
            <Link
              key={internship._id}
              to={`/internships/${internship._id}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{internship.title}</h3>
                  <p className="text-gray-600 mb-2">{internship.companyId?.profile?.name}</p>
                  <p className="text-gray-700 mb-4">{internship.description.substring(0, 200)}...</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      ₹{internship.details.stipend.amount}/month
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                      {internship.details.workMode}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">
                      {internship.details.duration.value} {internship.details.duration.unit}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4 text-right">
                  <div className="text-sm text-gray-500 mb-2">Trust Score</div>
                  <div className="text-2xl font-bold text-primary">
                    {internship.companyId?.trustScore?.score || 'N/A'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
