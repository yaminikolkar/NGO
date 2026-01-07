
import React, { useMemo, useState, useEffect } from 'react';
import { User, Campaign, Donation } from '../types';
import { getQuickSummary } from '../geminiService';

interface DonorDashboardProps {
  user: User;
  donations: Donation[];
  campaigns: Campaign[];
  onDonate: (campaignId: string, amount: number) => void;
}

const DonorDashboard: React.FC<DonorDashboardProps> = ({ user, donations, campaigns, onDonate }) => {
  const [showReceipt, setShowReceipt] = useState<Donation | null>(null);
  const [aiInsight, setAiInsight] = useState<string>("Analyzing your impact potential...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [donationAmount, setDonationAmount] = useState<number>(25);

  const myDonations = useMemo(() => 
    donations.filter(d => d.donorId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [donations, user.id]
  );

  const stats = useMemo(() => ({
    total: myDonations.reduce((sum, d) => sum + d.amount, 0),
    count: myDonations.length,
    activeSupport: new Set(myDonations.map(d => d.campaignId)).size
  }), [myDonations]);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const insight = await getQuickSummary(`The social impact of donating $${stats.total} across ${stats.activeSupport} unique NGO campaigns.`);
        setAiInsight(insight);
      } catch (e) {
        setAiInsight("Your support is providing critical resources to communities in need.");
      }
    };
    if (stats.total > 0) fetchInsight();
  }, [stats.total, stats.activeSupport]);

  const handleQuickDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onDonate(selectedCampaignId, donationAmount);
      setIsProcessing(false);
      setDonationAmount(25);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Welcome Header */}
      <header className="mb-12 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Hello, {user.name}!</h1>
          <p className="text-slate-500 font-medium italic">Your current global impact footprint: <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Level {Math.floor(stats.total / 100) + 1} Contributor</span></p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Impact</p>
            <p className="text-2xl font-black text-indigo-600">${stats.total.toLocaleString()}</p>
          </div>
          <div className="px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Lives Touched</p>
            <p className="text-2xl font-black text-emerald-600">{stats.activeSupport * 12}+</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* AI Impact Summary */}
          <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-lg font-black tracking-tight uppercase">Impact Intelligence</h3>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium italic">{aiInsight}</p>
          </div>

          {/* Active Campaigns */}
          <div>
            <div className="flex items-center justify-between mb-6 px-4">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Support New Initiatives</h3>
              <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Feed</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.slice(0, 4).map(campaign => (
                <div key={campaign.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg">{campaign.category}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{campaign.city}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{campaign.title}</h4>
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      <span>Goal: ${campaign.target.toLocaleString()}</span>
                      <span className="text-indigo-600">{Math.round((campaign.raised / campaign.target) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                        style={{ width: `${(campaign.raised / campaign.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedCampaignId(campaign.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
                  >
                    Quick Support
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Donation History */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Donation History</h3>
              <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Tax Exempt Status: Active</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-4">Campaign</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {myDonations.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{d.campaignTitle}</td>
                      <td className="px-8 py-6 text-xs text-slate-500">{new Date(d.date).toLocaleDateString()}</td>
                      <td className="px-8 py-6 font-black text-indigo-600">${d.amount}</td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => setShowReceipt(d)}
                          className="px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                  {myDonations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic font-medium">No donations found. Start your impact journey above!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Instant Donation Form */}
          <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-xl sticky top-24">
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Direct Impact</h3>
            <form onSubmit={handleQuickDonate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Select Campaign</label>
                <select 
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-bold bg-slate-50"
                >
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300">$</span>
                  <input 
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none font-black text-xl bg-slate-50 shadow-inner"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  {[10, 25, 50, 100].map(amt => (
                    <button 
                      key={amt} type="button" onClick={() => setDonationAmount(amt)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${donationAmount === amt ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                    Process Impact
                  </>
                )}
              </button>
              <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">Encrypted via NGO Nexus Secure Node</p>
            </form>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Impact Receipt</h3>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-10">Verification Hash: {showReceipt.id.slice(-8).toUpperCase()}</p>
              
              <div className="bg-slate-50 p-8 rounded-3xl text-left space-y-6 mb-10">
                <div className="flex justify-between border-b border-slate-200 pb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contributor</span>
                  <span className="font-bold text-slate-800">{user.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign</span>
                  <span className="font-bold text-slate-800">{showReceipt.campaignTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                  <span className="font-bold text-slate-800">{new Date(showReceipt.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Contribution</span>
                  <span className="text-2xl font-black text-indigo-600">${showReceipt.amount}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"
                >
                  Download PDF
                </button>
                <button 
                  onClick={() => setShowReceipt(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="bg-indigo-600 p-4 text-center">
              <p className="text-[9px] text-white font-black uppercase tracking-[0.3em]">Thank you for changing the world.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
