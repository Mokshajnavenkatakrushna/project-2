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
      <div className="min-h-screen" style={{ backgroundColor: '#4B3832' }}>
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 lg:ml-0 border-l" style={{ borderColor: '#228B22' }}>
          {/* Top bar with language selector */}
          <div className="lg:hidden flex justify-end p-4 border-b" style={{ borderColor: '#228B22', backgroundColor: '#F5F5DC', color: '#4B3832' }}>
            <LanguageSelector />
          </div>
          
          <div className="hidden lg:flex justify-end p-6 border-b" style={{ borderColor: '#228B22', backgroundColor: '#F5F5DC', color: '#4B3832' }}>
            <LanguageSelector />
          </div>

          {/* Main content */}
          <main className="p-4 lg:p-6 pt-0 lg:pt-0 pb-8 border m-4 rounded-lg shadow-sm" style={{ borderColor: '#228B22', backgroundColor: '#F5F5DC', color: '#4B3832' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;