import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function InternshipDetail() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['internship', id],
    queryFn: async () => {
      const { data } = await api.get(`/internships/${id}`);
      return data;
    }
  });

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  const internship = data?.data;
  const company = internship?.companyId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{internship.title}</h1>
        
        <div className="flex items-center justify-between mb-6 pb-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{company?.profile?.name}</h2>
            <p className="text-gray-600">{company?.profile?.location}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Trust Score</div>
            <div className="text-3xl font-bold text-primary">
              {company?.trustScore?.score || 'N/A'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-gray-600">Stipend</div>
            <div className="text-lg font-semibold">
              ₹{internship.details.stipend.amount}/month
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-gray-600">Duration</div>
            <div className="text-lg font-semibold">
              {internship.details.duration.value} {internship.details.duration.unit}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-sm text-gray-600">Work Mode</div>
            <div className="text-lg font-semibold capitalize">
              {internship.details.workMode}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded">
            <div className="text-sm text-gray-600">Positions</div>
            <div className="text-lg font-semibold">
              {internship.details.positions}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {internship.requirements.skills.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 px-3 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {internship.learningOutcomes?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Learning Outcomes</h3>
            <ul className="list-disc list-inside space-y-2">
              {internship.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="text-gray-700">{outcome}</li>
              ))}
            </ul>
          </div>
        )}

        <button className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-blue-600 text-lg font-semibold">
          Apply Now
        </button>
      </div>
    </div>
  );
}
