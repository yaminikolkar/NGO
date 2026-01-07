
import React, { useState } from 'react';
import { Campaign, Event, User, UserRole } from '../types';

interface CampaignManagementProps {
  campaigns: Campaign[];
  events: Event[];
  users: User[];
  onCloseCampaign: (id: string) => void;
}

const CampaignManagement: React.FC<CampaignManagementProps> = ({ campaigns, events, users, onCloseCampaign }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // Helper to get volunteer count for a campaign
  // For this demo, we'll correlate events with campaigns based on title/category keywords
  const getVolunteerCount = (campaign: Campaign) => {
    const relatedEvents = events.filter(e => 
      e.title.toLowerCase().includes(campaign.category.toLowerCase()) || 
      e.description.toLowerCase().includes(campaign.title.toLowerCase())
    );
    const uniqueVolunteers = new Set();
    relatedEvents.forEach(e => e.volunteers.forEach(vId => uniqueVolunteers.add(vId)));
    return uniqueVolunteers.size;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Campaign Operations</h1>
          <p className="text-slate-500 font-medium italic">Command Center: Monitoring {campaigns.length} Strategic Initiatives</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
             <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active Ops</p>
             <p className="text-lg font-black text-emerald-600">{campaigns.filter(c => c.raised < c.target).length}</p>
           </div>
           <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
             <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Total Funding</p>
             <p className="text-lg font-black text-indigo-600">${campaigns.reduce((s, c) => s + c.raised, 0).toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <th className="px-8 py-6">Initiative</th>
              <th className="px-8 py-6">Operational Hub</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Funding Velocity</th>
              <th className="px-8 py-6 text-center">Engagement</th>
              <th className="px-8 py-6 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map(campaign => {
              const vCount = getVolunteerCount(campaign);
              const isCompleted = campaign.raised >= campaign.target;
              
              return (
                <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={campaign.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                      <div>
                        <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{campaign.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{campaign.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-600">{campaign.city}, {campaign.state}</p>
                    <p className="text-[10px] text-slate-400">{campaign.address}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      isCompleted ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      {isCompleted ? 'Target Reached' : 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="w-32">
                      <div className="flex justify-between text-[8px] font-black text-slate-400 mb-1.5 uppercase">
                        <span>${campaign.raised.toLocaleString()}</span>
                        <span>{Math.round((campaign.raised / campaign.target) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min((campaign.raised / campaign.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-slate-900">{vCount + 5}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Assigned</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedCampaign(campaign)}
                        className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        title="View Intelligence"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                      <button 
                        onClick={() => setIsAssigning(true)}
                        className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                        title="Assign Force"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                      </button>
                      <button 
                        onClick={() => onCloseCampaign(campaign.id)}
                        className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
                        title="Archive Mission"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl my-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg mb-2 inline-block">Campaign Intelligence</span>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedCampaign.title}</h3>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Objective</p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{selectedCampaign.description}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Hub</p>
                    <p className="text-sm font-bold text-slate-800">{selectedCampaign.address}, {selectedCampaign.city}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Goal</span>
                     <span className="font-black text-slate-900">${selectedCampaign.target.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Raised to Date</span>
                     <span className="font-black text-indigo-600">${selectedCampaign.raised.toLocaleString()}</span>
                   </div>
                   <div className="pt-4 border-t border-slate-200">
                     <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase">
                        <span>Velocity</span>
                        <span className="text-emerald-500">+12% vs LY</span>
                     </div>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCampaign(null)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
              >
                Close Intelligence Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Force Placeholder Modal */}
      {isAssigning && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg my-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Deploy Strategic Force</h3>
              <p className="text-slate-500 font-medium mb-8">Select specialized volunteers for this deployment hub.</p>
              
              <div className="space-y-3 mb-10 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {users.filter(u => u.role === UserRole.VOLUNTEER).map(v => (
                  <div key={v.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <img src={v.avatar} className="w-8 h-8 rounded-full" alt="" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">{v.name}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase">{v.skills?.join(' • ') || 'General Support'}</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-emerald-500 transition-all"></div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsAssigning(false)}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100"
                >
                  Confirm Deployment
                </button>
                <button 
                  onClick={() => setIsAssigning(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagement;
