import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SoilAnalysisForm from './SoilAnalysisForm';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/30 p-6">
        <h1 className="text-3xl font-bold text-black mb-2">
          Welcome to {t('dashboard')}
        </h1>
        <p className="text-black/70">
          Analyze your soil quality and get personalized recommendations for better crop yields.
        </p>
      </div>

      {/* Soil Analysis Form */}
      <SoilAnalysisForm />
    </div>
  );
};

export default Dashboard;