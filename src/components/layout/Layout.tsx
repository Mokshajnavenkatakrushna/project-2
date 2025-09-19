import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import LanguageSelector from '../common/LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-violet-400 via-sky-400 to-purple-600">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 lg:ml-0">
          {/* Top bar with language selector */}
          <div className="lg:hidden flex justify-end p-4">
            <LanguageSelector />
          </div>
          
          <div className="hidden lg:flex justify-end p-6">
            <LanguageSelector />
          </div>

          {/* Main content */}
          <main className="p-4 lg:p-6 pt-0 lg:pt-0 pb-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;