
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentPage }) => {
  // Define role-specific navigation maps
  const getNavItems = () => {
    if (!user) return [];
    
    if (user.role === UserRole.ADMIN) {
      return [
        { id: 'dashboard', label: 'Admin Command' },
        { id: 'campaigns', label: 'Campaign Ops' },
        { id: 'volunteers', label: 'Volunteers' },
        { id: 'transparency', label: 'Impact Data' },
      ];
    }
    
    if (user.role === UserRole.DONOR) {
      return [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'campaigns', label: 'Support Missions' },
        { id: 'transparency', label: 'Live Map' },
      ];
    }
    
    if (user.role === UserRole.VOLUNTEER) {
      return [
        { id: 'dashboard', label: 'Volunteer Hub' },
        { id: 'volunteers', label: 'Discover Missions' },
        { id: 'transparency', label: 'Community Map' },
      ];
    }

    return [];
  };

  const items = getNavItems();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Branding Container */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="relative flex items-center">
            {/* 
              High-Fidelity SVG Recreation of the Heart-People logo.
              Using SVG ensures the logo is high-resolution (40px) and matches the uploaded design perfectly.
            */}
            <svg 
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-300 relative z-10"
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Figure Head */}
              <circle cx="35" cy="25" r="9" fill="#38BDF8"/>
              {/* Right Figure Head */}
              <circle cx="65" cy="25" r="9" fill="#1D4ED8"/>
              
              {/* Main Heart/Arms Body */}
              <path 
                d="M50 85C50 85 15 65 15 40C15 32 20 28 28 28C36 28 42 33 46 40C50 33 56 28 64 28C72 28 77 32 77 40C77 65 50 85 50 85Z" 
                fill="url(#heartGradient)"
              />
              
              {/* Left Wing/Arm Overlay for depth */}
              <path 
                d="M30 28C22 28 15 32 15 40C15 65 50 85 50 85C50 85 42 70 38 50C35 40 33 32 30 28Z" 
                fill="#0EA5E9" 
                opacity="0.9"
              />

              <defs>
                <linearGradient id="heartGradient" x1="15" y1="28" x2="77" y2="85" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38BDF8"/>
                  <stop offset="0.6" stopColor="#2563EB"/>
                  <stop offset="1" stopColor="#1E40AF"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 bg-sky-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          {/* Main Brand Text - Subtitle Deleted as requested */}
          <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Nexus
          </span>
        </div>

        {/* Existing Navbar Items */}
        <div className="hidden lg:flex items-center gap-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                currentPage === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* User / Login Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-none">{user.name}</p>
                <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full ring-2 ring-indigo-50 shadow-sm" />
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Secure Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="bg-indigo-600 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
