import React, { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, Package, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import OrderHistory from './OrderHistory';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { soilHistory, orderHistory, updateOrder, isLoadingData } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tests' | 'orders'>('tests');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-700';
      case 'good': return 'text-blue-700';
      case 'fair': return 'text-yellow-700';
      case 'poor': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/60 border-green-400/60';
      case 'good': return 'bg-blue-500/60 border-blue-400/60';
      case 'fair': return 'bg-yellow-500/60 border-yellow-400/60';
      case 'poor': return 'bg-red-500/60 border-red-400/60';
      default: return 'bg-gray-500/60 border-gray-400/60';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">{user?.name}</h1>
            <p className="text-black/70">{user?.email}</p>
            <p className="text-black/60 text-sm">
              Member since {formatDate(user?.createdAt || '')}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="text-blue-900" size={24} />
            <div>
              <p className="text-black text-sm">Total Tests</p>
              <p className="text-2xl font-bold text-black">{soilHistory.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-blue-900" size={24} />
            <div>
              <p className="text-black text-sm">Latest Status</p>
              <p className={`text-lg font-bold ${getStatusColor(soilHistory[0]?.status || 'poor')}`}>
                {soilHistory[0]?.status ? t(soilHistory[0].status) : 'No data'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="text-blue-900" size={24} />
            <div>
              <p className="text-black text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-black">{orderHistory.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tests'
                ? 'bg-blue-500 text-white'
                : 'text-black/70 hover:text-black hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={16} className="inline mr-2" />
            Soil Tests
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-blue-500 text-white'
                : 'text-black/70 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Package size={16} className="inline mr-2" />
            Order History
          </button>
        </div>

        {activeTab === 'tests' ? (
          <>
            <h2 className="text-xl font-bold text-black mb-6">Test History</h2>
        
        {isLoadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-black/60 mb-2">Loading your data...</h3>
            <p className="text-black/40">Restoring your soil analysis history</p>
          </div>
        ) : soilHistory.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto text-black/40 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-black/60 mb-2">No soil tests yet</h3>
            <p className="text-black/40">Start by analyzing your soil on the dashboard</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-black/70 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-black/70 font-medium">N</th>
                  <th className="text-left py-3 px-4 text-black/70 font-medium">P</th>
                  <th className="text-left py-3 px-4 text-black/70 font-medium">K</th>
                  <th className="text-left py-3 px-4 text-black/70 font-medium">pH</th>
                  <th className="text-left py-3 px-4 text-black/70 font-medium">Moisture</th>
                  <th className="text-left py-3 px-4 text-black/70 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {soilHistory.map((test) => (
                  <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-black">{formatDate(test.date)}</td>
                    <td className="py-3 px-4 text-black">{test.nitrogen}</td>
                    <td className="py-3 px-4 text-black">{test.phosphorus}</td>
                    <td className="py-3 px-4 text-black">{test.potassium}</td>
                    <td className="py-3 px-4 text-black">{test.pH}</td>
                    <td className="py-3 px-4 text-black">{test.moisture}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(test.status)}`}>
                        {t(test.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          </>
        ) : (
          isLoadingData ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-black/60 mb-2">Loading your orders...</h3>
              <p className="text-black/40">Restoring your order history</p>
            </div>
          ) : (
            <OrderHistory orders={orderHistory} onOrderUpdate={updateOrder} />
          )
        )}
      </div>

      {/* Recent Recommendations - Only show for tests tab */}
      {activeTab === 'tests' && soilHistory.length > 0 && soilHistory[0].recommendations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-black mb-4">Latest Recommendations</h2>
          <div className="space-y-3">
            {soilHistory[0].recommendations.map((rec, index) => (
              <div key={index} className="p-3 bg-yellow-500/60 border border-yellow-500/50 rounded-lg">
                <p className="text-black">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
