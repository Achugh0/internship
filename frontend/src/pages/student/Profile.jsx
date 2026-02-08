import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../lib/api';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    college: '',
    degree: '',
    graduationYear: '',
    location: '',
    bio: ''
  });

  const { data: profile } = useQuery({
    queryKey: ['student-profile'],
    queryFn: async () => {
      const { data } = await api.get('/students/profile');
      setFormData(data.data.profile || {});
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await api.put('/students/profile', { profile: data });
    },
    onSuccess: () => {
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                disabled={!isEditing}
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College/University
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.college || ''}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.degree || ''}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Year
              </label>
              <input
                type="number"
                disabled={!isEditing}
                value={formData.graduationYear || ''}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              disabled={!isEditing}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Tell us about yourself, your interests, and career goals..."
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </form>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {profile?.data?.skills?.map((skill, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {skill.name} - {skill.level}
            </span>
          ))}
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          + Add Skill
        </button>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
        {profile?.data?.portfolio?.length > 0 ? (
          <div className="space-y-4">
            {profile.data.portfolio.map((item, idx) => (
              <div key={idx} className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No portfolio items yet</p>
        )}
        <button className="text-blue-600 hover:text-blue-700 font-medium mt-4">
          + Add Project
        </button>
      </div>
    </div>
  );
}
