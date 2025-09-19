import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  t: (key: string) => string;
  currentLanguage: 'en' | 'hi' | 'te';
}

const translations = {
  en: {
    // Auth
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    language: 'Language',
    
    // Navigation
    dashboard: 'Dashboard',
    profile: 'Profile',
    upload: 'Upload Report',
    shop: 'Pesticides Shop',
    logout: 'Logout',
    
    // Dashboard
    soilAnalysis: 'Soil Analysis',
    enterParameters: 'Enter Soil Parameters',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    pH: 'pH Level',
    moisture: 'Moisture (%)',
    checkQuality: 'Analyze Soil',
    
    // Results
    recommendations: 'Recommendations',
    cropSuggestions: 'Crop Suggestions',
    soilStatus: 'Soil Status',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    
    // Shop
    addToCart: 'Add to Cart',
    cart: 'Cart',
    checkout: 'Checkout',
    total: 'Total',
    
    // Common
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',
  },
  hi: {
    // Auth
    login: 'लॉगिन',
    signup: 'साइन अप',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'पूरा नाम',
    language: 'भाषा',
    
    // Navigation
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफाइल',
    upload: 'रिपोर्ट अपलोड',
    shop: 'कीटनाशक दुकान',
    logout: 'लॉगआउट',
    
    // Dashboard
    soilAnalysis: 'मिट्टी विश्लेषण',
    enterParameters: 'मिट्टी के पैरामीटर दर्ज करें',
    nitrogen: 'नाइट्रोजन (N)',
    phosphorus: 'फास्फोरस (P)',
    potassium: 'पोटैशियम (K)',
    pH: 'pH स्तर',
    moisture: 'नमी (%)',
    checkQuality: 'मिट्टी का विश्लेषण करें',
    
    // Results
    recommendations: 'सिफारिशें',
    cropSuggestions: 'फसल सुझाव',
    soilStatus: 'मिट्टी की स्थिति',
    excellent: 'उत्कृष्ट',
    good: 'अच्छा',
    fair: 'ठीक',
    poor: 'खराब',
    
    // Shop
    addToCart: 'कार्ट में जोड़ें',
    cart: 'कार्ट',
    checkout: 'चेकआउट',
    total: 'कुल',
    
    // Common
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    loading: 'लोड हो रहा है...',
  },
  te: {
    // Auth
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    name: 'పూర్తి పేరు',
    language: 'భాష',
    
    // Navigation
    dashboard: 'డాష్‌బోర్డ్',
    profile: 'ప్రొఫైల్',
    upload: 'రిపోర్ట్ అప్‌లోడ్',
    shop: 'కీటనాశకాల దుకాణం',
    logout: 'లాగ్ అవుట్',
    
    // Dashboard
    soilAnalysis: 'మట్టి విశ్లేషణ',
    enterParameters: 'మట్టి పారామితులను నమోదు చేయండి',
    nitrogen: 'నైట్రోజన్ (N)',
    phosphorus: 'ఫాస్ఫరస్ (P)',
    potassium: 'పొటాషియం (K)',
    pH: 'pH స్థాయి',
    moisture: 'తేమ (%)',
    checkQuality: 'మట్టిని విశ్లేషించండి',
    
    // Results
    recommendations: 'సిఫార్సులు',
    cropSuggestions: 'పంట సూచనలు',
    soilStatus: 'మట్టి స్థితి',
    excellent: 'అద్భుతమైన',
    good: 'మంచి',
    fair: 'సరైన',
    poor: 'పేద',
    
    // Shop
    addToCart: 'కార్టులో జోడించండి',
    cart: 'కార్ట్',
    checkout: 'చెక్అవుట్',
    total: 'మొత్తం',
    
    // Common
    submit: 'సమర్పించండి',
    cancel: 'రద్దు చేయండి',
    save: 'సేవ్ చేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    loading: 'లోడ్ అవుతోంది...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (undefined === context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const currentLanguage = user?.language || 'en';

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};