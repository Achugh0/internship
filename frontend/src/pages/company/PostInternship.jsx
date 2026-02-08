import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function PostInternship() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stipend_amount: '',
    duration_months: '',
    work_mode: 'remote',
    location: '',
    hours_per_week: '',
    positions: 1,
    required_skills: '',
    education: '',
    experience: ''
  });

  const postMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/internships/', data);
      return response.data;
    },
    onSuccess: () => {
      alert('Internship posted successfully! Pending admin review.');
      navigate('/company/dashboard');
    },
    onError: (error) => {
      alert(error.response?.data?.detail || 'Failed to post internship');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    postMutation.mutate({
      ...formData,
      stipend_amount: parseFloat(formData.stipend_amount),
      duration_months: parseInt(formData.duration_months),
      hours_per_week: formData.hours_per_week ? parseInt(formData.hours_per_week) : null,
      positions: parseInt(formData.positions)
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Post New Internship</h1>
        <p className="text-gray-600 mb-6">Fill in the details below to create a new internship posting</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Internship Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Describe the role, responsibilities, and what the intern will learn..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Stipend (₹) *</label>
              <input
                type="number"
                required
                value={formData.stipend_amount}
                onChange={(e) => setFormData({ ...formData, stipend_amount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (months) *</label>
              <input
                type="number"
                required
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Work Mode *</label>
              <select
                required
                value={formData.work_mode}
                onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hours per Week</label>
              <input
                type="number"
                value={formData.hours_per_week}
                onChange={(e) => setFormData({ ...formData, hours_per_week: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Positions *</label>
              <input
                type="number"
                required
                value={formData.positions}
                onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Required Skills</label>
            <input
              type="text"
              value={formData.required_skills}
              onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Education Requirements</label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Bachelor's in Computer Science or related field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Experience Required</label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0-1 years"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={postMutation.isPending}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
            >
              {postMutation.isPending ? 'Posting...' : 'Post Internship'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/company/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
