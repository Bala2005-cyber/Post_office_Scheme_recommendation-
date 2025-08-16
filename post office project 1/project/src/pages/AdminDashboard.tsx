import React, { useState } from 'react';
import axios from 'axios';
import { Mail, MapPin, ShieldCheck, User, Building2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    district: '',
    branch: '',
    pincode: ''
  });
  const [result, setResult] = useState<any | null>(null);

  const occupations = [
    "student", "farmer", "business", "retired",
    "government employee", "housewife", "unemployed", "private employee"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    try {
      const res = await axios.post('http://localhost:5002/user-dashboard/custom-recommend', form);
      setResult(res.data);
    } catch (err) {
      alert("Error fetching recommendations");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-white border-l-[10px] border-[#C8102E] p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-[#C8102E] mb-6 flex items-center">
          <ShieldCheck className="mr-2 text-[#C8102E]" />
          Post Office Scheme Recommender
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['name', 'age', 'district', 'branch', 'pincode'].map(field => (
            <input
              key={field}
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              className="p-3 border border-[#C8102E]/30 rounded-xl w-full focus:outline-[#C8102E]"
              type={field === 'age' || field === 'pincode' ? 'number' : 'text'}
            />
          ))}

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="p-3 border border-[#C8102E]/30 rounded-xl w-full focus:outline-[#C8102E]"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            className="p-3 border border-[#C8102E]/30 rounded-xl w-full focus:outline-[#C8102E]"
          >
            <option value="">Select Occupation</option>
            {occupations.map(occ => (
              <option key={occ} value={occ}>{occ}</option>
            ))}
          </select>
        </div>

        <button
          onClick={submitForm}
          className="mt-6 bg-[#C8102E] hover:bg-red-800 text-white px-6 py-3 rounded-xl w-full shadow-md transition"
        >
          🔍 Get Scheme Recommendations
        </button>

        {result && (
          <div className="mt-10">
            <div className="bg-[#FFD200]/20 p-6 rounded-xl border-l-4 border-[#C8102E] shadow-inner">
              <h3 className="text-2xl font-semibold text-[#C8102E] mb-4 flex items-center">
                <User className="mr-2" />
                Recommended Schemes for {result.user.name}
              </h3>
              <ul className="list-disc list-inside text-gray-800">
                {result.recommended_schemes.map((scheme: string, idx: number) => (
                  <li key={idx}>{scheme}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-xl font-semibold text-[#C8102E] mb-2 flex items-center">
                <Building2 className="mr-2" /> Nearby Post Offices
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.nearby_post_offices.length ? result.nearby_post_offices.map((po: string, idx: number) => (
                  <div key={idx} className="bg-white border border-[#FFD200]/60 p-4 rounded-xl shadow-sm hover:shadow-lg transition">
                    <MapPin className="text-[#C8102E] inline-block mr-2" /> {po}
                  </div>
                )) : (
                  <p className="text-gray-600">No post office data found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
