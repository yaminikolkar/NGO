
import React, { useState, useMemo } from 'react';
import { Campaign, User } from '../types';

interface CampaignsProps {
  campaigns: Campaign[];
  onDonate: (id: string, amount: number) => void;
  user: User | null;
}

const Campaigns: React.FC<CampaignsProps> = ({ campaigns, onDonate, user }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState<number>(25);
  const [filter, setFilter] = useState('All');
  const [showNearby, setShowNearby] = useState(false);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const categoryMatch = filter === 'All' || c.category === filter;
      const locationMatch = !showNearby || !user || 
        (c.city.toLowerCase() === user.city?.toLowerCase() || 
         c.state.toLowerCase() === user.state?.toLowerCase());
      return categoryMatch && locationMatch;
    });
  }, [campaigns, filter, showNearby, user]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support Our Mission</h1>
          <p className="text-slate-500 font-medium text-lg">Every donation, no matter the size, makes a difference.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {['All', 'Education', 'Healthcare', 'Environment'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                  filter === cat ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {user && (
            <button 
              onClick={() => setShowNearby(!showNearby)}
              className={`px-6 py-3.5 rounded-2xl text-xs font-black transition-all border-2 flex items-center gap-2 ${
                showNearby 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              {showNearby ? `In ${user.city}` : 'Show Local NGOs'}
            </button>
          )}
        </div>
      </div>

      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCampaigns.map(campaign => {
            const isLocal = user && (campaign.city.toLowerCase() === user.city?.toLowerCase());
            
            return (
              <div key={campaign.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col group relative border-b-8 border-b-transparent hover:border-b-indigo-600">
                {isLocal && (
                  <div className="absolute top-6 right-6 z-20 bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    Nearby
                  </div>
                )}
                
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={campaign.image} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                     <div className="text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Impact Sector</p>
                        <p className="font-bold">{campaign.category}</p>
                     </div>
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{campaign.city}, {campaign.state}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{campaign.title}</h3>
                  <p className="text-slate-500 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">{campaign.description}</p>
                  
                  <div className="mt-auto space-y-6">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-3">
                        <span>${campaign.raised.toLocaleString()} raised of ${campaign.target.toLocaleString()}</span>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campaign.address + ', ' + campaign.city + ', ' + campaign.state)}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="hover:text-indigo-800 flex items-center gap-1 group/map"
                        >
                          Locate NGO <svg className="w-3 h-3 group-hover/map:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${Math.min((campaign.raised / campaign.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedCampaign(campaign)}
                      className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] uppercase tracking-widest text-xs"
                    >
                      Process Donation
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
           <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           </div>
           <h3 className="text-xl font-black text-slate-800 mb-2">No Matching Campaigns</h3>
           <p className="text-slate-400 font-medium">Try changing your filters or checking a different location.</p>
        </div>
      )}

      {selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
            <div className="p-10 sm:p-14">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Support NGO</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{selectedCampaign.title} • {selectedCampaign.city}</p>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-3">
                  {[10, 25, 50, 100, 250, 500].map(val => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-4 rounded-2xl border-2 font-black transition-all text-sm ${
                        amount === val 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.05]' 
                        : 'border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-6 py-6 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none font-black text-2xl bg-slate-50 shadow-inner"
                  />
                </div>

                <button 
                  onClick={() => {
                    onDonate(selectedCampaign.id, amount);
                    setSelectedCampaign(null);
                  }}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 text-xl uppercase tracking-widest"
                >
                  Confirm Impact
                </button>
                
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Secure Mock-Payment Active
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
