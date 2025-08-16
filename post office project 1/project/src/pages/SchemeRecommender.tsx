import React, { useState } from 'react';
import axios from 'axios';

const SchemeRecommender: React.FC = () => {
  const [district, setDistrict] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const res = await axios.post('http://127.0.0.1:5000/recommend', {
        district: district.trim()
      });
      setResult(res.data);
    } catch (err: any) {
      setError('District not found or server error.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-yellow-50 p-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-emerald-800">📮 Scheme Recommender</h2>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
          type="text"
          placeholder="Enter District Name"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Get Recommendations
        </button>
      </form>

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}

      {result && (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg text-gray-800">
          <h3 className="text-2xl font-bold mb-4">
            📍 Key Metrics for {result.district}
          </h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>Female Percent: {result.metrics.female_percent}</li>
            <li>Male Percent: {result.metrics.male_percent}</li>
            <li>Female Literacy: {result.metrics.female_literacy}</li>
            <li>Male Literacy: {result.metrics.male_literacy}</li>
            <li>Farmer Percent: {result.metrics.farmer_percent}</li>
            <li>Rural Percent: {result.metrics.rural_percent}</li>
            <li>Senior Citizen Percent: {result.metrics.senior_citizen_percent}</li>
            <li>Avg Income Group: {result.metrics.avg_income_group}</li>
          </ul>

          <h4 className="mt-6 text-xl font-semibold">🎯 Recommended Schemes:</h4>
          <ul className="list-disc ml-5 space-y-1 text-green-800">
            {result.schemes.map((scheme: string, idx: number) => (
              <li key={idx}>✅ {scheme}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SchemeRecommender;
