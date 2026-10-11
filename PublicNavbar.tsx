import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ArrowRight, Shield, Home } from 'lucide-react';
import { User } from '../../types/index.ts';

interface PublicNavbarProps {
  user: User | null;
  onLogout?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ user }) => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/features', label: 'Features' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/about', label: 'About' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6DBFF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B2A6B] to-[#51368F] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-[#F2C94C]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#2A1B4E]">
              Career<span className="text-[#D4A017]">Path</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-[#7D6B9E] tracking-tight">
              Plan · Learn · Grow
            </span>
          </div>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs font-semibold text-[#4A3B6F]">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                  isActive ? 'text-[#3B2A6B] font-bold bg-[#F3EEFF]' : 'hover:text-[#2A1B4E] hover:bg-[#FAF8FF]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-[#8E68CD]" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs flex items-center gap-1.5"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/admin-login"
                className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-[#8E68CD] hover:text-[#3B2A6B]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#3B2A6B] hover:bg-[#F3EEFF] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
