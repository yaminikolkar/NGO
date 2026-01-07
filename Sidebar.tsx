
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onNavigate, currentPage }) => {
  const getNavItems = () => {
    if (user.role === UserRole.ADMIN) {
      return [
        { id: 'dashboard', label: 'Admin Command', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'campaigns', label: 'Campaign Ops', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { id: 'volunteers', label: 'Volunteers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'transparency', label: 'Impact Data', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      ];
    }
    
    if (user.role === UserRole.DONOR) {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'campaigns', label: 'Support Missions', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { id: 'transparency', label: 'Live Map', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
      ];
    }
    
    return [
      { id: 'dashboard', label: 'Volunteer Hub', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'volunteers', label: 'Discover Missions', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { id: 'transparency', label: 'Community Map', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    ];
  };

  const items = getNavItems();

  return (
    <aside className="w-72 bg-slate-900 h-screen fixed left-0 top-0 z-40 flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div 
        className="p-8 flex items-center gap-4 cursor-pointer group mb-6"
        onClick={() => onNavigate('home')}
      >
        <div className="relative">
          <svg className="h-10 w-auto group-hover:scale-110 transition-transform duration-300" viewBox="0 0 100 100" fill="none">
            <circle cx="35" cy="25" r="9" fill="#38BDF8"/>
            <circle cx="65" cy="25" r="9" fill="#1D4ED8"/>
            <path d="M50 85C50 85 15 65 15 40C15 32 20 28 28 28C36 28 42 33 46 40C50 33 56 28 64 28C72 28 77 32 77 40C77 65 50 85 50 85Z" fill="url(#sidebarGradient)"/>
            <defs>
              <linearGradient id="sidebarGradient" x1="15" y1="28" x2="77" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8"/><stop offset="1" stopColor="#1E40AF"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="text-2xl font-black text-white tracking-tighter uppercase">Nexus</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-grow px-4 space-y-2">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              currentPage === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Role Indicator Footer */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Access Level</p>
          <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{user.role}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
