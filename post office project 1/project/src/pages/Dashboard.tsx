import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

const SchemeRecommender: React.FC = () => {
  const [district, setDistrict] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`📮 Scheme Recommendations for ${result.district}`, 10, 10);
    doc.setFontSize(12);

    let y = 20;
    doc.text('📊 Key Metrics:', 10, y);
    y += 10;

    Object.entries(result.metrics).forEach(([key, value]) => {
      doc.text(`${key.replace(/_/g, ' ')}: ${value}`, 10, y);
      y += 8;
    });

    y += 6;
    doc.text('🎯 Recommended Schemes:', 10, y);
    y += 10;

    result.schemes.forEach((scheme: string) => {
      doc.text(`- ${scheme}`, 10, y);
      y += 8;
    });

    doc.save(`${result.district}_recommendations.pdf`);
  };

  const handleCreateCampaign = () => {
    if (!result) return;
    navigate('/campaign-planner', {
      state: {
        district: result.district,
        scheme: result.schemes[0] || ''
      }
    });
  };

  const getBarWidth = (value: number) => `${Math.min(100, Math.max(0, value))}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-white p-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-[#C8102E]">📮 Scheme Recommender</h2>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
          type="text"
          placeholder="Enter District Name"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        <button
          type="submit"
          className="bg-[#C8102E] text-white font-semibold py-2 px-4 rounded w-full"
        >
          Get Recommendations
        </button>
      </form>

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}

      {result && (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg text-gray-800">
          <h3 className="text-2xl font-bold mb-4 text-[#C8102E]">
            📍 Key Metrics for {result.district}
          </h3>

          <ul className="space-y-4">
            {Object.entries(result.metrics).map(([key, value]: any) => (
              key !== "income_distribution" && (
                <li key={key}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-[#C8102E] h-4 rounded-full"
                      style={{ width: getBarWidth(parseFloat(value)) }}
                    />
                  </div>
                </li>
              )
            ))}
          </ul>

          <h4 className="mt-6 text-xl font-semibold text-green-700">🎯 Recommended Schemes:</h4>
          <ul className="list-disc ml-5 space-y-1 text-green-800">
            {result.schemes.map((scheme: string, idx: number) => (
              <li key={idx}>✅ {scheme}</li>
            ))}
          </ul>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              📄 Download PDF
            </button>
            <button
              onClick={handleCreateCampaign}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              📝 Create Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeRecommender;
