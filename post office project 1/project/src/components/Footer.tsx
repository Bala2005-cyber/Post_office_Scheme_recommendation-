import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">India Post</h3>
            <p className="text-gray-300 mb-4">
              Empowering citizens with AI-driven financial scheme recommendations
              tailored to their district's demographic profile.
            </p>
            <div className="flex space-x-4">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-2xl">📮</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/scheme-recommender" className="hover:text-post-yellow transition-colors">Scheme Finder</a></li>
              <li><a href="/post-office-locator" className="hover:text-post-yellow transition-colors">Find Post Office</a></li>
              <li><a href="#" className="hover:text-post-yellow transition-colors">About Schemes</a></li>
              <li><a href="#" className="hover:text-post-yellow transition-colors">Help & Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>1800-266-6868</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@indiapost.gov.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Ministry of Communications, New Delhi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 India Post. All rights reserved. | Powered by AI & Census 2011 Data</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;