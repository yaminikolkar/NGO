
import React from 'react';

interface HomeProps {
  onStart: () => void;
  onViewImpact: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart, onViewImpact }) => {
  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section with Parallax-like Impact Image */}
      <section className="relative min-h-[90vh] flex items-center pt-16 pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000" 
            alt="Global Community" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] drop-shadow-2xl">
              Giving is <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                Revolutionary.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Join the world's most transparent NGO platform. Powered by AI to ensure every dollar reaches the hands that need it most.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={onStart}
                className="bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 hover:-translate-y-1 active:scale-95"
              >
                Become a Change Maker
              </button>
              <button 
                onClick={onViewImpact}
                className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-white/20 transition-all active:scale-95"
              >
                Explore Live Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Stats */}
      <section className="py-16 bg-white relative -mt-12 z-20 mx-4 lg:mx-20 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem label="Verified Donations" value="$12.4M" color="text-indigo-600" />
            <StatItem label="Active Volunteers" value="45k+" color="text-emerald-600" />
            <StatItem label="Countries Impacted" value="62" color="text-amber-500" />
            <StatItem label="Transparency Score" value="99.8%" color="text-slate-900" />
          </div>
        </div>
      </section>

      {/* Visual Impact Quote Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1000" 
                  alt="Team Success" 
                  className="rounded-[3rem] shadow-2xl z-10 relative"
                />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-center p-4 leading-tight rotate-12 shadow-2xl">
                  AI VERIFIED IMPACT
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
                Transparency isn't a feature. <br/>
                <span className="text-indigo-600 italic">It's our promise.</span>
              </h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                Every photo you see, every dollar you donate, and every hour you volunteer is logged into our AI-Auditor. We provide real-time proof of impact so you never have to wonder if you've made a difference.
              </p>
              <div className="flex gap-4 items-center">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ceo" className="w-16 h-16 rounded-full border-4 border-indigo-50" alt="CEO" />
                <div>
                  <p className="font-black text-slate-900">Sarah Jenkins</p>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Global Director, NGO Nexus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Final Impact Image */}
      <section className="py-32 relative overflow-hidden bg-indigo-900">
        <img 
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=2000" 
          alt="Hands Together" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter">Ready to write a new story?</h2>
          <p className="text-2xl text-indigo-100 mb-16 max-w-2xl mx-auto font-medium">Your first contribution, no matter the size, starts a chain reaction of positive change.</p>
          <button 
            onClick={onStart}
            className="bg-white text-indigo-900 px-16 py-8 rounded-[3rem] font-black text-2xl hover:bg-indigo-50 transition-all shadow-3xl hover:-translate-y-2"
          >
            Join NGO Nexus Today
          </button>
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="text-center">
    <div className={`text-4xl md:text-6xl font-black mb-2 tracking-tighter ${color}`}>{value}</div>
    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{label}</div>
  </div>
);

export default Home;
