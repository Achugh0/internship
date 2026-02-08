import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function PostInternship() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: { skills: [], education: '', experience: '' },
    details: {
      stipend: { amount: '', currency: 'INR' },
      duration: { value: '', unit: 'months' },
      workMode: 'remote',
      location: '',
      hoursPerWeek: '',
      positions: 1
    },
    learningOutcomes: []
  });

  const postMutation = useMutation({
    mutationFn: async (data) => {
      return await api.post('/internships', data);
    },
    onSuccess: () => {
      alert('Internship posted successfully! Pending review.');
      navigate('/company/dashboard');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    postMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Post New Internship</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Internship Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Full Stack Developer Intern"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the role, responsibilities, and what the intern will learn..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Stipend (₹) *</label>
              <input
                type="number"
                required
                value={formData.details.stipend.amount}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, stipend: { ...formData.details.stipend, amount: e.target.value }}
                })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (months) *</label>
              <input
                type="number"
                required
                value={formData.details.duration.value}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, duration: { ...formData.details.duration, value: e.target.value }}
                })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Work Mode *</label>
              <select
                required
                value={formData.details.workMode}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, workMode: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="office">Office</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.details.location}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, location: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hours per Week</label>
              <input
                type="number"
                value={formData.details.hoursPerWeek}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, hoursPerWeek: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Positions</label>
              <input
                type="number"
                value={formData.details.positions}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, positions: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={postMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {postMutation.isPending ? 'Posting...' : 'Post Internship'}
          </button>
        </form>
      </div>
    </div>
  );
}
