
import React, { useState, useEffect } from 'react';
import { User, UserRole, Campaign, Donation, Event } from './types';
import { SAMPLE_CAMPAIGNS, SAMPLE_EVENTS, MOCK_USERS } from './constants';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import AdminDashboard from './components/AdminDashboard';
import CampaignManagement from './components/CampaignManagement';
import AdminVolunteerManagement from './components/AdminVolunteerManagement';
import DonorDashboard from './components/DonorDashboard';
import VolunteerDashboard from './components/VolunteerDashboard';
import Campaigns from './components/Campaigns';
import Volunteers from './components/Volunteers';
import Login from './components/Login';
import ImpactTransparency from './components/ImpactTransparency';
import ChatBot from './components/ChatBot';
import Home from './components/Home';
import WireframeDashboard from './components/WireframeDashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>(SAMPLE_CAMPAIGNS);
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const savedUsersStr = localStorage.getItem('ngo_registered_users');
    let loadedUsers = [...MOCK_USERS];
    
    if (savedUsersStr) {
      try {
        const parsed = JSON.parse(savedUsersStr);
        const userMap = new Map();
        [...MOCK_USERS, ...parsed].forEach(u => userMap.set(u.email.toLowerCase(), u));
        loadedUsers = Array.from(userMap.values());
      } catch (e) {
        console.error("Failed to parse users", e);
      }
    }
    setUsers(loadedUsers);
    localStorage.setItem('ngo_registered_users', JSON.stringify(loadedUsers));

    const savedUser = localStorage.getItem('ngo_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === UserRole.ADMIN && localStorage.getItem('ngo_admin_authorized') === 'true') {
          setUser(u);
          setCurrentPage('dashboard');
        } else {
          const verifiedUser = loadedUsers.find(vu => vu.email.toLowerCase() === u.email.toLowerCase());
          if (verifiedUser) {
            setUser(verifiedUser);
            setCurrentPage('dashboard');
          }
        }
      } catch (e) {
        localStorage.removeItem('ngo_user');
      }
    }

    const savedDonations = localStorage.getItem('ngo_donations');
    if (savedDonations) setDonations(JSON.parse(savedDonations));
    const savedCampaigns = localStorage.getItem('ngo_campaigns');
    if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
    const savedEvents = localStorage.getItem('ngo_events');
    if (savedEvents) setEvents(JSON.parse(savedEvents));
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('ngo_user', JSON.stringify(u));
    setCurrentPage('dashboard');
    setNotification({ message: `Access Authorized: ${u.role} Node Active`, type: 'success' });
  };

  const handleRegister = (u: User) => {
    const updatedUsers = [...users, u];
    setUsers(updatedUsers);
    localStorage.setItem('ngo_registered_users', JSON.stringify(updatedUsers));
    setUser(u);
    localStorage.setItem('ngo_user', JSON.stringify(u));
    setCurrentPage('dashboard');
    setNotification({ message: `Welcome to the Network, ${u.name}.`, type: 'success' });
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('ngo_user', JSON.stringify(updatedUser));
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('ngo_registered_users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ngo_user');
    localStorage.removeItem('ngo_admin_authorized');
    setCurrentPage('home');
  };

  const handleDonate = (campaignId: string, amount: number) => {
    if (!user) return;
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    const newDonation: Donation = { id: `d-${Date.now()}`, donorId: user.id, campaignId, campaignTitle: campaign.title, amount, date: new Date().toISOString() };
    const updatedDonations = [newDonation, ...donations];
    setDonations(updatedDonations);
    localStorage.setItem('ngo_donations', JSON.stringify(updatedDonations));
    const updatedCampaigns = campaigns.map(c => c.id === campaignId ? { ...c, raised: (c.raised || 0) + amount } : c);
    setCampaigns(updatedCampaigns);
    localStorage.setItem('ngo_campaigns', JSON.stringify(updatedCampaigns));
    setNotification({ message: `Impact Locked: $${amount} Authorized.`, type: 'success' });
  };

  const handleAddCampaign = (newCampaign: Campaign) => {
    const updated = [...campaigns, newCampaign];
    setCampaigns(updated);
    localStorage.setItem('ngo_campaigns', JSON.stringify(updated));
  };

  const handleAddEvent = (newEvent: Event) => {
    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem('ngo_events', JSON.stringify(updated));
  };

  const renderContent = () => {
    if (currentPage === 'wireframe') return <WireframeDashboard />;
    if (currentPage === 'home' && !user) return <Home onStart={() => setCurrentPage('login')} onViewImpact={() => setCurrentPage('transparency')} />;

    switch (currentPage) {
      case 'login': 
        return <Login onLogin={handleLogin} onRegister={handleRegister} users={users} onGoBack={() => setCurrentPage('home')} />;
      case 'dashboard': 
        if (user?.role === UserRole.ADMIN) return <AdminDashboard user={user} donations={donations} campaigns={campaigns} events={events} users={users} onAddCampaign={handleAddCampaign} onAddEvent={handleAddEvent} />;
        if (user?.role === UserRole.DONOR) return <DonorDashboard user={user} donations={donations} campaigns={campaigns} onDonate={handleDonate} />;
        if (user?.role === UserRole.VOLUNTEER) return <VolunteerDashboard user={user} events={events} onUpdateProfile={handleUpdateProfile} />;
        return <Home onStart={() => setCurrentPage('login')} onViewImpact={() => setCurrentPage('transparency')} />;
      case 'campaigns': 
        if (user?.role === UserRole.ADMIN) return <CampaignManagement campaigns={campaigns} events={events} users={users} onCloseCampaign={() => {}} />;
        return <Campaigns campaigns={campaigns} onDonate={handleDonate} user={user} />;
      case 'volunteers': 
        if (user?.role === UserRole.ADMIN) return <AdminVolunteerManagement users={users} events={events} />;
        return <Volunteers events={events} user={user} onJoin={(id) => {
          const updated = events.map(e => e.id === id ? { ...e, volunteers: [...(e.volunteers || []), user?.id || ''] } : e);
          setEvents(updated);
          localStorage.setItem('ngo_events', JSON.stringify(updated));
          setNotification({ message: "Mission Assignment Verified.", type: 'success' });
        }} />;
      case 'transparency': 
        return <ImpactTransparency donations={donations} campaigns={campaigns} user={user} />;
      default: 
        return <Home onStart={() => setCurrentPage('login')} onViewImpact={() => setCurrentPage('transparency')} />;
    }
  };

  // If user is logged in and not on wireframe/login/home, show sidebar layout
  const isAuthLayout = user && currentPage !== 'home' && currentPage !== 'login' && currentPage !== 'wireframe';

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-indigo-100 selection:text-indigo-700">
      {/* Sidebar - Desktop Only */}
      {isAuthLayout && <Sidebar user={user!} onNavigate={setCurrentPage} currentPage={currentPage} />}

      <div className={`flex-grow flex flex-col ${isAuthLayout ? 'ml-72' : ''}`}>
        {/* Navbar for Public pages, TopBar for Dashboard pages */}
        {!isAuthLayout && currentPage !== 'wireframe' && (
          <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage={currentPage} />
        )}
        {isAuthLayout && <TopBar user={user!} onLogout={handleLogout} onNavigate={setCurrentPage} />}

        {notification && (
          <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
            <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 bg-white ${
              notification.type === 'success' ? 'border-emerald-100 text-emerald-800' : 'border-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <p className="font-black text-[10px] uppercase tracking-widest">{notification.message}</p>
            </div>
          </div>
        )}

        <main className="flex-grow">
          {renderContent()}
        </main>
        
        {user && currentPage !== 'wireframe' && <ChatBot />}
        
        {/* Footer only on non-dashboard pages */}
        {!isAuthLayout && currentPage !== 'wireframe' && (
          <footer className="bg-slate-950 text-slate-500 py-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">NGO Nexus Operations</p>
              <p className="text-[10px] opacity-30 font-bold tracking-widest">© 2024 Command Node v3.2</p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default App;
