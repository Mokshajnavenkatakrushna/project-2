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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-black"
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
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-md border-r border-white/20 z-40
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-0
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black">🧑‍🌾  SoilQ</h1>
            <p className="text-black/70 text-sm">Soil Quality Analyzer</p>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 rounded-lg bg-white/10 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={20} className="text-black" />
              </div>
              <div ref={containerRef} className="w-40 overflow-hidden">
                <div className="whitespace-nowrap">
                  <p
                    ref={nameRef}
                    className={`inline-block text-black font-medium hover:[animation-play-state:paused] ${
                      nameScroll ? 'animate-scroll' : ''
                    }`}
                  >
                    {user?.name}
                  </p>
                </div>
                <div className="whitespace-nowrap">
                  <p
                    ref={emailRef}
                    className={`inline-block text-black/70 text-sm hover:[animation-play-state:paused] ${
                      emailScroll ? 'animate-scroll' : ''
                    }`}
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
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-blue-600/90 text-blue-100 border border-blue-400/30' 
                    : 'text-black/80 hover:bg-white/10 hover:text-black'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-red-500 hover:bg-red-500/45 hover:text-red-500 transition-all duration-200"
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
