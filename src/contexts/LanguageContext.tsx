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
    
    // Additional
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterName: 'Enter your full name',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    invalidCredentials: 'Invalid credentials',
    signupFailed: 'Signup failed',
    createAccount: 'Create Your Account',
    noAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    soilQualityAnalyzer: 'Soil Quality Analyzer',
    
    // Order Management
    cancelOrder: 'Cancel Order',
    cancelOrderConfirm: 'Are you sure you want to cancel this order?',
    cancelReason: 'Reason for cancellation (optional)',
    orderCancelled: 'Order cancelled successfully',
    cancelFailed: 'Failed to cancel order',
    cannotCancelOrder: 'This order cannot be cancelled',
    orderStatus: 'Order Status',
    cancelOrderTitle: 'Cancel Order',
    orderCancelledMessage: 'This order has been cancelled',
    cancelled: 'CANCELLED',
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
    
    // Additional
    enterEmail: 'अपना ईमेल दर्ज करें',
    enterPassword: 'अपना पासवर्ड दर्ज करें',
    enterName: 'अपना पूरा नाम दर्ज करें',
    showPassword: 'पासवर्ड दिखाएं',
    hidePassword: 'पासवर्ड छुपाएं',
    invalidCredentials: 'अमान्य क्रेडेंशियल्स',
    signupFailed: 'साइनअप असफल',
    createAccount: 'अपना खाता बनाएं',
    noAccount: 'खाता नहीं है?',
    alreadyHaveAccount: 'पहले से खाता है?',
    soilQualityAnalyzer: 'मिट्टी गुणवत्ता विश्लेषक',
    
    // Order Management
    cancelOrder: 'ऑर्डर रद्द करें',
    cancelOrderConfirm: 'क्या आप वाकई इस ऑर्डर को रद्द करना चाहते हैं?',
    cancelReason: 'रद्दीकरण का कारण (वैकल्पिक)',
    orderCancelled: 'ऑर्डर सफलतापूर्वक रद्द हो गया',
    cancelFailed: 'ऑर्डर रद्द करने में विफल',
    cannotCancelOrder: 'यह ऑर्डर रद्द नहीं किया जा सकता',
    orderStatus: 'ऑर्डर स्थिति',
    cancelOrderTitle: 'ऑर्डर रद्द करें',
    orderCancelledMessage: 'यह ऑर्डर रद्द कर दिया गया है',
    cancelled: 'रद्द',
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
    
    // Additional
    enterEmail: 'మీ ఇమెయిల్‌ను నమోదు చేయండి',
    enterPassword: 'మీ పాస్‌వర్డ్‌ను నమోదు చేయండి',
    enterName: 'మీ పూర్తి పేరును నమోదు చేయండి',
    showPassword: 'పాస్‌వర్డ్‌ను చూపించండి',
    hidePassword: 'పాస్‌వర్డ్‌ను దాచండి',
    invalidCredentials: 'చెల్లని ధృవీకరణలు',
    signupFailed: 'సైన్‌అప్ విఫలమైంది',
    createAccount: 'మీ ఖాతాను సృష్టించండి',
    noAccount: 'ఖాతా లేదా?',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    soilQualityAnalyzer: 'మట్టి నాణ్యత విశ్లేషకుడు',
    
    // Order Management
    cancelOrder: 'ఆర్డర్ రద్దు చేయండి',
    cancelOrderConfirm: 'మీరు ఖచ్చితంగా ఈ ఆర్డర్‌ను రద్దు చేయాలనుకుంటున్నారా?',
    cancelReason: 'రద్దుకు కారణం (ఐచ్ఛికం)',
    orderCancelled: 'ఆర్డర్ విజయవంతంగా రద్దు చేయబడింది',
    cancelFailed: 'ఆర్డర్ రద్దు చేయడంలో విఫలమైంది',
    cannotCancelOrder: 'ఈ ఆర్డర్‌ను రద్దు చేయలేము',
    orderStatus: 'ఆర్డర్ స్థితి',
    cancelOrderTitle: 'ఆర్డర్ రద్దు చేయండి',
    orderCancelledMessage: 'ఈ ఆర్డర్ రద్దు చేయబడింది',
    cancelled: 'రద్దు',
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