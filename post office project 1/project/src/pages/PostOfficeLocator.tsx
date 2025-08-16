import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface PostOffice {
  name: string;
  branchType: string;
  district: string;
  state: string;
  pincode: string;
  address: string;
}

const PostOfficeLocator: React.FC = () => {
  const [stateInput, setStateInput] = useState('');
  const [districtInput, setDistrictInput] = useState('');
  const [branchInput, setBranchInput] = useState('');
  const [pincodeInput, setPincodeInput] = useState('');
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPostOffices = async () => {
    const query = pincodeInput || branchInput || districtInput || stateInput;
    if (!query) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        pincodeInput
          ? `https://api.postalpincode.in/pincode/${encodeURIComponent(query)}`
          : `https://api.postalpincode.in/postoffice/${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data[0].Status === 'Success') {
        const offices = data[0].PostOffice.map((office: any) => ({
          name: office.Name,
          branchType: office.BranchType,
          district: office.District,
          state: office.State,
          pincode: office.Pincode,
          address: `${office.Name}, ${office.Block || ''}, ${office.District}, ${office.State} - ${office.Pincode}`,
        }));
        setPostOffices(offices);
      } else {
        setPostOffices([]);
        setError('No post offices found for the entered location.');
      }
    } catch (error) {
      console.error('Error fetching post office data:', error);
      setError('Failed to fetch data. Please try again later.');
      setPostOffices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">📍 Post Office Locator</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              value={stateInput}
              onChange={(e) => setStateInput(e.target.value)}
              placeholder="Enter State Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={districtInput}
              onChange={(e) => setDistrictInput(e.target.value)}
              placeholder="Enter District Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={branchInput}
              onChange={(e) => setBranchInput(e.target.value)}
              placeholder="Enter Branch Name"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
              placeholder="Enter Pincode"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={fetchPostOffices}
            className="w-full bg-post-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors mb-6"
          >
            🔍 Search
          </button>

          {loading ? (
            <div className="text-center text-gray-600">Loading post offices...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : postOffices.length > 0 ? (
            <div className="space-y-4">
              {postOffices.map((office, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-md">
                  <h2 className="text-lg font-semibold text-post-red mb-1">
                    📮 {office.name} ({office.branchType})
                  </h2>
                  <p className="text-gray-700">📍 {office.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">Enter details above to view post offices.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostOfficeLocator;
