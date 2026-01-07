
import React, { useMemo, useState, useEffect, PropsWithChildren } from 'react';
import { User, UserRole, Campaign, Donation, Event } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const StatCard = ({ title, value, trend, color }: { title: string; value: string; trend: string; color: string }) => {
  const colorMap: any = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100'
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{title}</p>
      <div className="flex items-baseline gap-2 mb-8">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">{value}</h2>
      </div>
      <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${colorMap[color]}`}>
        {trend}
      </div>
    </div>
  );
};

const AdminModal: React.FC<PropsWithChildren<{ title: string; onClose: () => void }>> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 overflow-y-auto">
    <div className="bg-white rounded-[3.5rem] w-full max-w-2xl my-auto overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="p-10 sm:p-14">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

const CampaignForm = ({ onAdd }: { onAdd: (c: Campaign) => void }) => {
  const [formData, setFormData] = useState({ title: '', description: '', target: 5000, category: 'Education' as const, city: '', state: '', address: '' });
  return (
    <div className="space-y-6">
      <input 
        type="text" placeholder="Initiative Identifier" 
        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-slate-50"
        onChange={e => setFormData({...formData, title: e.target.value})}
      />
      <textarea 
        placeholder="Mission Objective" 
        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-medium h-32 bg-slate-50"
        onChange={e => setFormData({...formData, description: e.target.value})}
      />
      <div className="grid grid-cols-2 gap-6">
        <input 
          type="number" placeholder="Target ($)" 
          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-slate-50"
          onChange={e => setFormData({...formData, target: Number(e.target.value)})}
        />
        <select 
          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-slate-50"
          onChange={e => setFormData({...formData, category: e.target.value as any})}
        >
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Environment">Environment</option>
          <option value="Disaster Relief">Disaster Relief</option>
        </select>
      </div>
      <button 
        onClick={() => onAdd({
          ...formData, 
          id: `c-${Date.now()}`, 
          raised: 0, 
          city: formData.city || 'San Francisco',
          state: formData.state || 'CA',
          address: formData.address || 'Global HQ',
          image: `https://is4-ssl.mzstatic.com/image/thumb/Purple122/v4/fa/75/65/fa75654d-047f-13be-31ec-e425d3a1fe99/source/512x512bb.jpg`
        })}
        className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-100"
      >
        Authorize & Launch
      </button>
    </div>
  );
};

const EventForm = ({ onAdd }: { onAdd: (e: Event) => void }) => {
  const [formData, setFormData] = useState({ title: '', date: '', location: '', city: '', state: '', address: '', description: '' });
  return (
    <div className="space-y-6">
      <input 
        type="text" placeholder="Operation Title" 
        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 bg-slate-50 font-bold"
        onChange={e => setFormData({...formData, title: e.target.value})}
      />
      <div className="grid grid-cols-2 gap-6">
        <input 
          type="date" 
          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 bg-slate-50"
          onChange={e => setFormData({...formData, date: e.target.value})}
        />
        <input 
          type="text" placeholder="Location Code" 
          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 bg-slate-50"
          onChange={e => setFormData({...formData, location: e.target.value})}
        />
      </div>
      <button 
        onClick={() => onAdd({
          ...formData, 
          id: `e-${Date.now()}`, 
          city: formData.city || 'Global Hub',
          state: formData.state || 'GH',
          address: formData.address || 'Deployment Zone',
          requiredSkills: ['Nexus Protocol'], 
          volunteers: []
        })}
        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl"
      >
        Confirm Operations
      </button>
    </div>
  );
};

interface DashboardProps {
  user: User | null;
  donations: Donation[];
  campaigns: Campaign[];
  events: Event[];
  users: User[];
  onAddCampaign: (c: Campaign) => void;
  onAddEvent: (e: Event) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, donations = [], campaigns = [], events = [], users = [], onAddCampaign, onAddEvent }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAdmin = user?.role === UserRole.ADMIN;

  const stats = useMemo(() => {
    if (!user) return { totalDonated: 0, userTotal: 0, activeCampaigns: 0, upcomingEvents: 0, volunteerCount: 0, totalDonors: 0, totalUsers: 0 };
    const safeDonations = donations || [];
    const totalDonated = safeDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const userDonations = safeDonations.filter(d => d.donorId === user.id);
    const userTotal = userDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const activeVolunteers = (events || []).reduce((sum, e) => sum + (e.volunteers?.length || 0), 0);
    const totalDonors = new Set(safeDonations.map(d => d.donorId)).size;
    
    return {
      totalDonated,
      userTotal,
      activeCampaigns: (campaigns || []).length,
      upcomingEvents: (events || []).length,
      volunteerCount: activeVolunteers,
      totalDonors,
      totalUsers: (users || []).length
    };
  }, [donations, campaigns, events, user, users]);

  const chartData = [
    { name: 'Mon', amount: 4000 },
    { name: 'Tue', amount: 3000 },
    { name: 'Wed', amount: 5000 },
    { name: 'Thu', amount: 2780 },
    { name: 'Fri', amount: 1890 },
    { name: 'Sat', amount: 2390 },
    { name: 'Sun', amount: 3490 },
  ];

  const pieData = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return [{ name: 'System Initialized', value: 1 }];
    return campaigns.map(c => ({ name: c.title || 'Mission', value: c.raised || 0 }));
  }, [campaigns]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!user || !isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black uppercase tracking-[0.2em] animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
             {isAdmin && (
               <span className="px-3 py-1 bg-slate-950 text-white text-[10px] font-black uppercase rounded-lg shadow-xl ring-2 ring-slate-100">NGO Director</span>
             )}
          </div>
          <p className="text-slate-500 font-medium italic">Operational status for <span className="text-indigo-600 font-bold">{user.name}</span>: <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Active</span></p>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowCampaignModal(true)}
              className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Launch Campaign
            </button>
            <button 
              onClick={() => setShowEventModal(true)}
              className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path></svg>
              Deploy Force
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={isAdmin ? "Total Treasury" : "My Impact"} 
          value={`$${(isAdmin ? stats.totalDonated : stats.userTotal || 0).toLocaleString()}`} 
          trend={isAdmin ? `${stats.totalDonors} Unique Donors` : "Verified Contributor"}
          color="indigo"
        />
        <StatCard title="Active Hubs" value={stats.activeCampaigns.toString()} trend="Operational Global" color="emerald" />
        <StatCard title="Personnel Strength" value={stats.volunteerCount.toString()} trend={`${stats.totalUsers} Registered Nodes`} color="amber" />
        <StatCard title="Upcoming Ops" value={stats.upcomingEvents.toString()} trend="Logistics Confirmed" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Impact Velocity
            </h3>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Live Telemetry</div>
          </div>
          <div className="flex-grow w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                  itemStyle={{ color: '#4f46e5' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col h-[450px]">
          <h3 className="text-xl font-black mb-8">Resource Allocation</h3>
          <div className="flex-grow w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-[10px] font-bold">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-400 truncate max-w-[120px]">{d.name}</span>
                </div>
                <span className="font-black text-white">${(d.value || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personnel Roster</h3>
              <p className="text-sm text-slate-500 font-medium">Monitoring all active NGO members across global nodes.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6">Member</th>
                  <th className="px-10 py-6">Deployment Hub</th>
                  <th className="px-10 py-6">Role / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(users || []).length > 0 ? (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-slate-100" alt="" />
                          <div>
                            <p className="font-black text-slate-800 text-sm">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{u.city || 'Global Hub'}</span>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${
                              u.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 
                              u.role === UserRole.DONOR ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {u.role}
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                               Active
                            </span>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-10 py-10 text-center text-slate-400 text-sm font-bold italic">No personnel detected.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCampaignModal && (
        <AdminModal title="Launch Strategic Funding" onClose={() => setShowCampaignModal(false)}>
           <CampaignForm onAdd={(c) => { onAddCampaign(c); setShowCampaignModal(false); }} />
        </AdminModal>
      )}

      {showEventModal && (
        <AdminModal title="Confirm Operation Schedule" onClose={() => setShowEventModal(false)}>
           <EventForm onAdd={(e) => { onAddEvent(e); setShowEventModal(false); }} />
        </AdminModal>
      )}
    </div>
  );
};

export default Dashboard;
