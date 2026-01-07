
import React, { useMemo, useState, PropsWithChildren } from 'react';
import { User, UserRole, Campaign, Donation, Event } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const AdminStatCard = ({ title, value, subtext, color }: { title: string; value: string; subtext: string; color: string }) => {
  const colorMap: any = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100'
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{title}</p>
      <div className="flex items-baseline gap-2 mb-8">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">{value}</h2>
      </div>
      <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${colorMap[color]}`}>
        {subtext}
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

const AdminDashboard: React.FC<{
  user: User;
  donations: Donation[];
  campaigns: Campaign[];
  events: Event[];
  users: User[];
  onAddCampaign: (c: Campaign) => void;
  onAddEvent: (e: Event) => void;
}> = ({ user, donations, campaigns, events, users, onAddCampaign, onAddEvent }) => {
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  const stats = useMemo(() => ({
    totalDonated: donations.reduce((sum, d) => sum + d.amount, 0),
    donorCount: new Set(donations.map(d => d.donorId)).size,
    volunteerCount: users.filter(u => u.role === UserRole.VOLUNTEER).length,
    activeCampaigns: campaigns.length,
    upcomingEvents: events.length,
  }), [donations, campaigns, events, users]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Director Command</h1>
          <p className="text-slate-500 font-medium italic mt-2">Operational Telemetry for <span className="text-indigo-600 font-bold">{user.name}</span></p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCampaignModal(true)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
          >
            Launch Mission
          </button>
          <button 
            onClick={() => setShowEventModal(true)}
            className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
          >
            Deploy Ops
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AdminStatCard title="Treasury Sum" value={`$${stats.totalDonated.toLocaleString()}`} subtext={`${stats.donorCount} Active Contributors`} color="indigo" />
        <AdminStatCard title="Open Missions" value={stats.activeCampaigns.toString()} subtext="Verified Hubs" color="emerald" />
        <AdminStatCard title="Personnel" value={stats.volunteerCount.toString()} subtext="Social Impact Agents" color="amber" />
        <AdminStatCard title="Upcoming Ops" value={stats.upcomingEvents.toString()} subtext="Logistics Ready" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Active Roster</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Feed</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">
                <tr>
                  <th className="px-8 py-6">Member Node</th>
                  <th className="px-8 py-6">Protocol</th>
                  <th className="px-8 py-6">Heartbeat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.slice(0, 6).map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={u.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                        <div>
                          <p className="font-black text-slate-800 text-sm tracking-tight">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg ${u.role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Synced</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col border border-white/5">
          <h3 className="text-xl font-black uppercase tracking-tight mb-8">Resource Map</h3>
          <div className="flex-grow min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={campaigns.map(c => ({ name: c.title, value: c.raised }))} innerRadius={70} outerRadius={90} dataKey="value" paddingAngle={5}>
                  {campaigns.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global</p>
                  <p className="text-xl font-black">Impact</p>
               </div>
            </div>
          </div>
          <div className="space-y-4 mt-10">
            {campaigns.slice(0, 4).map((c, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[10px] font-bold text-slate-400 truncate w-32 uppercase tracking-widest">{c.title}</span>
                </div>
                <span className="text-[10px] font-black text-white tracking-widest">${(c.raised/1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCampaignModal && (
        <AdminModal title="Strategic Funding Launch" onClose={() => setShowCampaignModal(false)}>
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Mission Identifier</label>
                 <input type="text" placeholder="e.g. Operation Clean Water" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none" />
               </div>
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Strategy Overview</label>
                 <textarea placeholder="Mission objectives and field plan..." className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl min-h-[120px] font-medium focus:border-indigo-600 outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Funding Target</label>
                 <input type="number" placeholder="50000" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Sector</label>
                 <select className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] focus:border-indigo-600 outline-none">
                   <option>Education</option>
                   <option>Healthcare</option>
                   <option>Environment</option>
                 </select>
               </div>
             </div>
             <button onClick={() => setShowCampaignModal(false)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-600/20 active:scale-[0.98] transition-all">Authorize Deployment</button>
           </div>
        </AdminModal>
      )}

      {showEventModal && (
        <AdminModal title="Personnel Deployment Schedule" onClose={() => setShowEventModal(false)}>
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Operation Code</label>
                 <input type="text" placeholder="e.g. SF Food Pack Alpha" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Sync Date</label>
                 <input type="date" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Sector Code</label>
                 <input type="text" placeholder="Unit-A1" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none" />
               </div>
             </div>
             <button onClick={() => setShowEventModal(false)} className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-[0.98] transition-all">Lock Operation</button>
           </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminDashboard;
