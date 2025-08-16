import React from 'react'
import { TrendingUp, MapPin, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-yellow-50 to-teal-100 text-gray-800">

      {/* Hero Section */}
      <section className="py-20 text-center bg-gradient-to-br from-orange-100 via-rose-100 to-yellow-50 shadow-inner rounded-b-3xl">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text mb-6 drop-shadow-lg">
            🇮🇳 Post Office Scheme Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-6">
            Empowering rural and urban citizens by intelligently recommending government schemes based on demographics.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm mt-6 mb-8">
            <div className="bg-white shadow-md px-4 py-2 rounded-full font-medium text-gray-700">
              📊 640+ Districts Analyzed
            </div>
            <div className="bg-white shadow-md px-4 py-2 rounded-full font-medium text-gray-700">
              🏛️ 10+ Schemes Covered
            </div>
            <div className="bg-white shadow-md px-4 py-2 rounded-full font-medium text-gray-700">
              🤖 Data-Driven Recommendations
            </div>
          </div>

          <button
            onClick={() => navigate('/scheme-recommender')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition"
          >
            Get Scheme Recommendations
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            🌟 Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition hover:scale-105 duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Scheme Matching</h3>
              <p className="text-gray-600">
                Our AI engine recommends the most suitable financial and insurance schemes based on local demographics and economic indicators.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition hover:scale-105 duration-300">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">District Intelligence</h3>
              <p className="text-gray-600">
                We analyze census data from all Indian districts to deliver accurate insights for policy-makers and citizens.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition hover:scale-105 duration-300">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inclusive Access to Schemes</h3>
              <p className="text-gray-600">
                Whether you're a farmer, woman, senior citizen or low-income worker — we guide you to benefits you deserve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-white border-t mt-12">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Post Office Scheme Recommender • Built for Bharat 🇮🇳
        </p>
      </footer>
    </div>
  );
};

export default Home;
