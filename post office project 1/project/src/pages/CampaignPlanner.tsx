import React, { useState, useEffect } from 'react';
import { 
  Mail, Building, Plus, X, Calendar, Clock, MapPin, FileText, Users, Search, 
  CheckCircle2, AlertCircle, FileDown, ChevronDown, ChevronUp, Building2, 
  FileX, Activity, BarChart3
} from 'lucide-react';
import jsPDF from 'jspdf';

// Types
interface PostOffice {
  Name: string;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  State: string;
  Country: string;
  Pincode: string;
}

interface PostOfficeResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[];
}

interface Campaign {
  id: string;
  campaignName: string;
  schemeName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  pincode: string;
  selectedPostOffices: PostOffice[];
  createdAt: string;
  status: 'planned' | 'active' | 'completed';
}

type CampaignStatus = 'planned' | 'active' | 'completed' | 'all';

// Utility Functions
const determineCampaignStatus = (campaign: Campaign): 'planned' | 'active' | 'completed' => {
  const now = new Date();
  const startDateTime = new Date(`${campaign.startDate}T${campaign.startTime}`);
  const endDateTime = new Date(`${campaign.endDate}T${campaign.endTime}`);

  if (now < startDateTime) {
    return 'planned';
  } else if (now >= startDateTime && now <= endDateTime) {
    return 'active';
  } else {
    return 'completed';
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'planned':
      return 'border-yellow-400';
    case 'active':
      return 'border-green-500';
    case 'completed':
      return 'border-gray-400';
    default:
      return 'border-gray-300';
  }
};

const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'planned':
      return 'bg-yellow-100 text-yellow-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDateTime = (date: string, time: string): string => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const generateCampaignPDF = (campaign: Campaign): void => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set up colors
  const postOfficeRed = '#B91C1C';
  const postOfficeGold = '#F59E0B';
  const darkGray = '#374151';
  const lightGray = '#F3F4F6';

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Header Background
  pdf.setFillColor(185, 28, 28); // Post Office Red
  pdf.rect(0, 0, pageWidth, 40, 'F');

  // Header Text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text('INDIAN POST OFFICE', pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(14);
  pdf.text('CAMPAIGN NOTIFICATION', pageWidth / 2, 30, { align: 'center' });

  // Campaign Info Section
  pdf.setFillColor(245, 158, 11); // Gold
  pdf.rect(0, 40, pageWidth, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text(campaign.campaignName.toUpperCase(), pageWidth / 2, 55, { align: 'center' });

  // Scheme Name
  pdf.setFillColor(254, 243, 199); // Light cream
  pdf.rect(10, 70, pageWidth - 20, 20, 'F');
  pdf.setTextColor(55, 65, 81);
  pdf.setFontSize(16);
  pdf.text(`Scheme: ${campaign.schemeName}`, 15, 83);

  // Date and Time Information
  pdf.setFontSize(12);
  const startDateTime = new Date(`${campaign.startDate}T${campaign.startTime}`);
  const endDateTime = new Date(`${campaign.endDate}T${campaign.endTime}`);
  
  pdf.text(`Campaign Period: ${startDateTime.toLocaleDateString('en-IN')} ${startDateTime.toLocaleTimeString('en-IN', { hour12: true })} - ${endDateTime.toLocaleDateString('en-IN')} ${endDateTime.toLocaleTimeString('en-IN', { hour12: true })}`, 15, 100);
  pdf.text(`Pincode: ${campaign.pincode}`, 15, 110);

  // Post Offices Section
  pdf.setFillColor(185, 28, 28); // Post Office Red
  pdf.rect(10, 120, pageWidth - 20, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.text('PARTICIPATING POST OFFICES', pageWidth / 2, 132, { align: 'center' });

  // Post Office Details
  let yPosition = 150;
  pdf.setTextColor(55, 65, 81);
  pdf.setFontSize(10);

  campaign.selectedPostOffices.forEach((postOffice, index) => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 30;
    }

    // Alternate row colors
    if (index % 2 === 0) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(10, yPosition - 8, pageWidth - 20, 12, 'F');
    }

    pdf.text(`${index + 1}. ${postOffice.Name}`, 15, yPosition);
    pdf.text(`${postOffice.BranchType}`, 120, yPosition);
    pdf.text(`${postOffice.District}, ${postOffice.State}`, 180, yPosition);
    pdf.text(`${postOffice.Pincode}`, 250, yPosition);

    yPosition += 12;
  });

  // Footer
  const footerY = pageHeight - 20;
  pdf.setFillColor(185, 28, 28);
  pdf.rect(0, footerY - 10, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text('Generated by Campaign Planner System', pageWidth / 2, footerY, { align: 'center' });
  pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN', { hour12: true })}`, pageWidth / 2, footerY + 8, { align: 'center' });

  // Save the PDF
  pdf.save(`${campaign.campaignName}_Campaign_Poster.pdf`);
};

// Campaign Form Component
const CampaignForm: React.FC<{ onSubmit: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'status'>) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    campaignName: '',
    schemeName: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    pincode: ''
  });

  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [selectedPostOffices, setSelectedPostOffices] = useState<PostOffice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validatePincode = (pincode: string): boolean => {
    return /^\d{6}$/.test(pincode);
  };

  const fetchPostOffices = async () => {
    if (!validatePincode(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    setError('');
    setPostOffices([]);
    setSelectedPostOffices([]);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
      const data: PostOfficeResponse[] = await response.json();

      if (data[0]?.Status === 'Success' && data[0]?.PostOffice) {
        setPostOffices(data[0].PostOffice);
        setSuccess(`Found ${data[0].PostOffice.length} post offices for pincode ${formData.pincode}`);
      } else {
        setError('No post offices found for this pincode');
      }
    } catch (err) {
      setError('Failed to fetch post office data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePostOfficeSelection = (postOffice: PostOffice) => {
    setSelectedPostOffices(prev => {
      const isSelected = prev.some(po => po.Name === postOffice.Name);
      if (isSelected) {
        return prev.filter(po => po.Name !== postOffice.Name);
      } else {
        return [...prev, postOffice];
      }
    });
  };

  const selectAllPostOffices = () => {
    setSelectedPostOffices(postOffices);
  };

  const clearSelection = () => {
    setSelectedPostOffices([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPostOffices.length === 0) {
      setError('Please select at least one post office');
      return;
    }

    if (new Date(`${formData.startDate}T${formData.startTime}`) >= new Date(`${formData.endDate}T${formData.endTime}`)) {
      setError('End date and time must be after start date and time');
      return;
    }

    onSubmit({
      ...formData,
      selectedPostOffices
    });

    // Reset form
    setFormData({
      campaignName: '',
      schemeName: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      pincode: ''
    });
    setPostOffices([]);
    setSelectedPostOffices([]);
    setSuccess('Campaign scheduled successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-700">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-red-700 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Schedule New Campaign</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter campaign name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scheme Name
            </label>
            <input
              type="text"
              name="schemeName"
              value={formData.schemeName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter scheme name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Pincode
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              maxLength={6}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter 6-digit pincode"
            />
            <button
              type="button"
              onClick={fetchPostOffices}
              disabled={loading}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Searching...' : 'Fetch Post Offices'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {postOffices.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Post Offices ({postOffices.length} found)
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllPostOffices}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {postOffices.map((postOffice, index) => (
                  <div
                    key={index}
                    onClick={() => togglePostOfficeSelection(postOffice)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPostOffices.some(po => po.Name === postOffice.Name)
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{postOffice.Name}</p>
                        <p className="text-sm text-gray-600">{postOffice.BranchType}</p>
                        <p className="text-sm text-gray-500">{postOffice.District}, {postOffice.State}</p>
                      </div>
                      {selectedPostOffices.some(po => po.Name === postOffice.Name) && (
                        <CheckCircle2 className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedPostOffices.length > 0 && (
              <p className="mt-3 text-sm text-gray-600">
                Selected {selectedPostOffices.length} of {postOffices.length} post offices
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={selectedPostOffices.length === 0}
          className="w-full py-4 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
        >
          Schedule Campaign
        </button>
      </form>
    </div>
  );
};

// Campaign Card Component (FIXED DOWNLOAD FUNCTIONALITY)
const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = determineCampaignStatus(campaign);

  const handleDownloadPDF = () => {
    generateCampaignPDF(campaign);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-t-4 ${getStatusColor(status)} hover:shadow-lg transition-shadow`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{campaign.campaignName}</h3>
            <p className="text-gray-600 font-medium">{campaign.schemeName}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusBadgeColor(status)}`}>
              {status.toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            {/* DOWNLOAD BUTTON IS NOW ALWAYS VISIBLE */}
            <button
              onClick={handleDownloadPDF}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center text-sm font-medium"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download Poster
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-red-600" />
            <span>{formatDateTime(campaign.startDate, campaign.startTime)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-red-600" />
            <span>{formatDateTime(campaign.endDate, campaign.endTime)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-red-600" />
            <span>Pincode: {campaign.pincode}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Users className="h-4 w-4 mr-2 text-red-600" />
          <span>{campaign.selectedPostOffices.length} Post Offices</span>
        </div>

        {isExpanded && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-red-600" />
              Selected Post Offices
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {campaign.selectedPostOffices.map((postOffice, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-800">{postOffice.Name}</p>
                    <p className="text-sm text-gray-600">{postOffice.BranchType}</p>
                    <p className="text-sm text-gray-500">{postOffice.District}, {postOffice.State}</p>
                    <p className="text-sm text-gray-500">Pincode: {postOffice.Pincode}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Campaign Stats Component
const CampaignStats: React.FC<{
  campaigns: Campaign[];
  activeFilter: CampaignStatus;
  onFilterChange: (filter: CampaignStatus) => void;
}> = ({ campaigns, activeFilter, onFilterChange }) => {
  const stats = campaigns.reduce(
    (acc, campaign) => {
      const status = determineCampaignStatus(campaign);
      acc[status]++;
      return acc;
    },
    { planned: 0, active: 0, completed: 0 }
  );

  const statCards = [
    {
      label: 'All Campaigns',
      count: campaigns.length,
      icon: BarChart3,
      color: 'bg-blue-600',
      filter: 'all' as CampaignStatus
    },
    {
      label: 'Planned',
      count: stats.planned,
      icon: Calendar,
      color: 'bg-yellow-500',
      filter: 'planned' as CampaignStatus
    },
    {
      label: 'Active',
      count: stats.active,
      icon: Activity,
      color: 'bg-green-600',
      filter: 'active' as CampaignStatus
    },
    {
      label: 'Completed',
      count: stats.completed,
      icon: CheckCircle2,
      color: 'bg-gray-600',
      filter: 'completed' as CampaignStatus
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.filter}
          onClick={() => onFilterChange(stat.filter)}
          className={`cursor-pointer p-6 rounded-lg shadow-md border-2 transition-all ${
            activeFilter === stat.filter
              ? 'border-red-500 bg-red-50'
              : 'border-transparent bg-white hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.count}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Campaign List Component
const CampaignList: React.FC<{
  campaigns: Campaign[];
  filter: CampaignStatus;
}> = ({ campaigns, filter }) => {
  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'all') return true;
    return determineCampaignStatus(campaign) === filter;
  });

  if (filteredCampaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <FileX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No {filter === 'all' ? '' : filter} campaigns found
        </h3>
        <p className="text-gray-500">
          {filter === 'all' 
            ? 'Schedule your first campaign to get started' 
            : `No campaigns are currently ${filter}`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredCampaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};

// Main Campaign Planner Component
const CampaignPlanner: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CampaignStatus>('all');

  // Load campaigns from localStorage on component mount
  useEffect(() => {
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns));
    }
  }, []);

  // Save campaigns to localStorage whenever campaigns state changes
  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const handleCreateCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'status'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'planned' // Initial status, will be determined dynamically
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
      {/* Header */}
      <div className="bg-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-500 p-3 rounded-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Campaign Planner</h1>
                <p className="text-red-100 flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  Indian Post Office Management System
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
            >
              {showForm ? (
                <>
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  New Campaign
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {showForm ? (
          <CampaignForm onSubmit={handleCreateCampaign} />
        ) : (
          <>
            <CampaignStats
              campaigns={campaigns}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <CampaignList campaigns={campaigns} filter={activeFilter} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Building className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">Indian Post Office</span>
          </div>
          <p className="text-gray-400">
            Campaign Management System - Connecting Communities Through Post Offices
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Powered by Postal Pincode API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CampaignPlanner;