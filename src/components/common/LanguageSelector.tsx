import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Language } from '../../types';

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

const LanguageSelector: React.FC = () => {
  const { user, updateLanguage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === user?.language) || languages[0];

  const handleLanguageChange = (language: Language['code']) => {
    updateLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm"
      >
        <Globe size={18} />
        <span className="text-sm">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <ChevronDown
          size={16}
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg border border-gray-300 shadow-xl z-50 overflow-hidden">
          {languages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200
                ${
                  language.code === currentLanguage.code
                    ? 'bg-green-50 text-green-700 font-semibold border-l-4 border-green-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === languages.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
