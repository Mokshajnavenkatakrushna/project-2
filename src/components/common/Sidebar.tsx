import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Upload, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();

  // Scroll logic for Name & Email
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const [nameScroll, setNameScroll] = useState(false);
  const [emailScroll, setEmailScroll] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const nameWidth = nameRef.current?.scrollWidth || 0;
      const emailWidth = emailRef.current?.scrollWidth || 0;

      setNameScroll(nameWidth > containerWidth);
      setEmailScroll(emailWidth > containerWidth);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [user]);

  const menuItems = [
    { icon: Home, label: t('dashboard'), path: '/dashboard' },
    { icon: User, label: t('profile'), path: '/profile' },
    { icon: Upload, label: t('upload'), path: '/upload' },
    { icon: ShoppingCart, label: t('shop'), path: '/shop' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg border"
        style={{ backgroundColor: '#228B22', borderColor: '#4B3832', color: '#F5F5DC' }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay on Mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed left-0 top-0 h-full w-64 border-r z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-0
        `}
        style={{ backgroundColor: '#228B22', borderColor: '#4B3832' }}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#F5F5DC' }}>🧑‍🌾  SoilQ</h1>
            <p className="text-sm" style={{ color: '#F5F5DC', opacity: 0.8 }}>Soil Quality Analyzer</p>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 rounded-lg border" style={{ backgroundColor: '#4B3832', borderColor: '#F5F5DC' }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4B3832' }}>
                <User size={20} style={{ color: '#F5F5DC' }} />
              </div>
              <div ref={containerRef} className="w-40 overflow-hidden">
                <div className="whitespace-nowrap">
                  <p
                    ref={nameRef}
                    className={`inline-block font-medium hover:[animation-play-state:paused] ${
                      nameScroll ? 'animate-scroll' : ''
                    }`}
                    style={{ color: '#F5F5DC' }}
                  >
                    {user?.name}
                  </p>
                </div>
                <div className="whitespace-nowrap">
                  <p
                    ref={emailRef}
                    className={`inline-block text-sm hover:[animation-play-state:paused] ${
                      emailScroll ? 'animate-scroll' : ''
                    }`}
                    style={{ color: '#F5F5DC', opacity: 0.8 }}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 border
                  ${isActive(item.path) 
                    ? '' 
                    : ''
                  }
                `}
                style={{
                  backgroundColor: isActive(item.path) ? '#4B3832' : 'transparent',
                  color: '#F5F5DC',
                  borderColor: isActive(item.path) ? '#F5F5DC' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = '#4B3832';
                    e.currentTarget.style.borderColor = '#F5F5DC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full border transition-all duration-200"
            style={{ 
              color: '#F5F5DC', 
              backgroundColor: 'transparent',
              borderColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4B3832';
              e.currentTarget.style.borderColor = '#F5F5DC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
