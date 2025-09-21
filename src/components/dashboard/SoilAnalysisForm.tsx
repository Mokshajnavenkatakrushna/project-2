import React, { useState, useEffect } from 'react';
import { Beaker, Droplets, Leaf, Activity, Gauge, Loader } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';

const SoilAnalysisForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    pH: '',
    moisture: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const { t } = useLanguage();
  const { addSoilData } = useApp();

  // Check for extracted data from upload on component mount
  useEffect(() => {
    const extractedData = sessionStorage.getItem('extractedSoilData');
    if (extractedData) {
      const data = JSON.parse(extractedData);
      setFormData(data);
      // Clear the session storage after using the data
      sessionStorage.removeItem('extractedSoilData');
      
      // Show a notification that data was loaded
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500/90 text-black px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'Extracted data loaded successfully!';
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const analyzeSoil = (data: any) => {
    const { nitrogen, phosphorus, potassium, pH, moisture } = data;
    
    let status: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    const recommendations: string[] = [];
    const cropSuggestions: string[] = [];

    // pH analysis
    if (pH < 6.0) {
      recommendations.push('Soil is acidic. Consider adding lime to increase pH');
    } else if (pH > 8.0) {
      recommendations.push('Soil is alkaline. Consider adding sulfur to decrease pH');
    }

    // Nutrient analysis
    if (nitrogen < 20) {
      recommendations.push('Low nitrogen levels. Consider nitrogen-rich fertilizers');
    }
    if (phosphorus < 15) {
      recommendations.push('Low phosphorus levels. Consider phosphate fertilizers');
    }
    if (potassium < 150) {
      recommendations.push('Low potassium levels. Consider potash fertilizers');
    }

    // Moisture analysis
    if (moisture < 20) {
      recommendations.push('Low soil moisture. Increase irrigation frequency');
    } else if (moisture > 80) {
      recommendations.push('High soil moisture. Improve drainage to prevent root rot');
    }

    // Determine overall status
    const scores = [];
    scores.push(nitrogen >= 40 ? 4 : nitrogen >= 20 ? 3 : nitrogen >= 10 ? 2 : 1);
    scores.push(phosphorus >= 25 ? 4 : phosphorus >= 15 ? 3 : phosphorus >= 8 ? 2 : 1);
    scores.push(potassium >= 200 ? 4 : potassium >= 150 ? 3 : potassium >= 100 ? 2 : 1);
    scores.push(pH >= 6.0 && pH <= 7.5 ? 4 : pH >= 5.5 && pH <= 8.0 ? 3 : 2);
    scores.push(moisture >= 40 && moisture <= 70 ? 4 : moisture >= 20 && moisture <= 80 ? 3 : 2);

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (avgScore >= 3.5) status = 'excellent';
    else if (avgScore >= 2.5) status = 'good';
    else if (avgScore >= 1.5) status = 'fair';
    else status = 'poor';

    // Crop suggestions based on pH and nutrients
    if (pH >= 6.0 && pH <= 7.0 && nitrogen >= 25 && phosphorus >= 15) {
      cropSuggestions.push('Rice', 'Wheat', 'Corn');
    }
    if (pH >= 5.5 && pH <= 6.5 && potassium >= 150) {
      cropSuggestions.push('Tomatoes', 'Potatoes', 'Peppers');
    }
    if (pH >= 6.5 && pH <= 7.5) {
      cropSuggestions.push('Beans', 'Peas', 'Lentils');
    }
    if (moisture >= 60 && nitrogen >= 30) {
      cropSuggestions.push('Leafy Greens', 'Cabbage', 'Lettuce');
    }

    if (cropSuggestions.length === 0) {
      cropSuggestions.push('Millet', 'Sorghum'); // Hardy crops for poor conditions
    }

    return { status, recommendations, cropSuggestions };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convert string values to numbers
    const numericData = {
      nitrogen: parseFloat(formData.nitrogen),
      phosphorus: parseFloat(formData.phosphorus),
      potassium: parseFloat(formData.potassium),
      pH: parseFloat(formData.pH),
      moisture: parseFloat(formData.moisture)
    };

    const analysis = analyzeSoil(numericData);
    
    const soilData = {
      ...numericData,
      ...analysis
    };

    const success = await addSoilData(soilData);
    if (success) {
      setResults(soilData);
    } else {
      // Show error message
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorNotification.textContent = 'Failed to save analysis. Please try again.';
      document.body.appendChild(errorNotification);
      
      setTimeout(() => {
        document.body.removeChild(errorNotification);
      }, 3000);
    }
    
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-700';
      case 'good': return 'text-blue-700';
      case 'fair': return 'text-yellow-700';
      case 'poor': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/60 border-green-400/30';
      case 'good': return 'bg-blue-500/60 border-blue-400/30';
      case 'fair': return 'bg-yellow-500/60 border-yellow-400/30';
      case 'poor': return 'bg-red-500/60 border-red-400/30';
      default: return 'bg-gray-500/60 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Soil Analysis Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-black mb-6 flex items-center space-x-2">
          <Beaker className="text-black-400" />
          <span>{t('soilAnalysis')}</span>
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-black/80 text-sm font-medium mb-2">
              {t('nitrogen')} (mg/kg)
            </label>
            <div className="relative">
              <Leaf className="absolute left-3 top-3 h-5 w-5 text-black/60" />
              <input
                type="number"
                value={formData.nitrogen}
                onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                placeholder="0-100"
                required
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-black/80 text-sm font-medium mb-2">
              {t('phosphorus')} (mg/kg)
            </label>
            <div className="relative">
              <Activity className="absolute left-3 top-3 h-5 w-5 text-black/60" />
              <input
                type="number"
                value={formData.phosphorus}
                onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                placeholder="0-50"
                required
                min="0"
                max="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-black/80 text-sm font-medium mb-2">
              {t('potassium')} (mg/kg)
            </label>
            <div className="relative">
              <Gauge className="absolute left-3 top-3 h-5 w-5 text-black/60" />
              <input
                type="number"
                value={formData.potassium}
                onChange={(e) => handleInputChange('potassium', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                placeholder="0-300"
                required
                min="0"
                max="300"
              />
            </div>
          </div>

          <div>
            <label className="block text-black/80 text-sm font-medium mb-2">
              {t('pH')}
            </label>
            <div className="relative">
              <Beaker className="absolute left-3 top-3 h-5 w-5 text-black/60" />
              <input
                type="number"
                step="0.1"
                value={formData.pH}
                onChange={(e) => handleInputChange('pH', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                placeholder="0-14"
                required
                min="0"
                max="14"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-black/80 text-sm font-medium mb-2">
              {t('moisture')} (%)
            </label>
            <div className="relative">
              <Droplets className="absolute left-3 top-3 h-5 w-5 text-black/60" />
              <input
                type="number"
                value={formData.moisture}
                onChange={(e) => handleInputChange('moisture', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                placeholder="0-100"
                required
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-black font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading && <Loader className="animate-spin" size={20} />}
              <span>{loading ? t('loading') : t('checkQuality')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-black mb-6">Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className={`p-4 rounded-lg border ${getStatusBgColor(results.status)}`}>
              <h4 className="font-semibold text-black mb-2">{t('soilStatus')}</h4>
              <p className={`text-lg font-bold ${getStatusColor(results.status)}`}>
                {t(results.status)}
              </p>
            </div>

            {/* Crop Suggestions */}
            <div className="bg-blue-500/30 border border-blue-400/50 p-4 rounded-lg">
              <h4 className="font-semibold text-black mb-2">{t('cropSuggestions')}</h4>
              <div className="flex flex-wrap gap-2">
                {results.cropSuggestions.map((crop: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-600/90 text-black-100 rounded-full text-sm">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6">
            <h4 className="font-semibold text-black mb-3">{t('recommendations')}</h4>
            <div className="space-y-2">
              {results.recommendations.map((rec: string, index: number) => (
                <div key={index} className="p-3 bg-green-500/50 border border-white-400/30 rounded-lg">
                  <p className="text-black-100">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysisForm;