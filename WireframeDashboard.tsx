import React from 'react';

const WireframeDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-white font-sans text-slate-800">
      {/* LEFT SIDEBAR (Donor Portal) */}
      <aside className="w-64 bg-slate-100 border-r border-slate-300 flex flex-col fixed h-full">
        {/* Top label with icon and text: DONOR */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-300">
          <div className="w-8 h-8 bg-slate-400 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <span className="font-bold text-slate-600 tracking-wider">DONOR</span>
        </div>

        {/* Vertical menu items */}
        <nav className="mt-6 flex-grow">
          <ul className="space-y-1 px-3">
            <li className="flex items-center gap-4 px-4 py-3 bg-slate-300 rounded-lg text-slate-900 font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </li>
            <li className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Campaigns
            </li>
            <li className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Volunteers
            </li>
            <li className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Donations
            </li>
            <li className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reports
            </li>
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-64 flex-grow flex flex-col">
        {/* TOP BAR */}
        <header className="h-20 border-b border-slate-300 flex items-center justify-between px-10">
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search Campaigns..." 
              className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-full bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-slate-200 rounded-full border border-slate-300 flex items-center justify-center text-slate-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-10">
          <h1 className="text-2xl font-bold text-slate-700 mb-8">Campaign List</h1>

          <div className="space-y-6">
            <CampaignWireframeCard 
              title="Feed the Hungry" 
              description="Help provide meals for underprivileged families in our community." 
              raised={6500} 
              goal={10000} 
            />
            <CampaignWireframeCard 
              title="Clean Water Initiative" 
              description="Deploying portable filtration systems to remote villages." 
              raised={4200} 
              goal={8000} 
            />
            <CampaignWireframeCard 
              title="Education for All" 
              description="Providing tablets and digital literacy tools to rural schools." 
              raised={12000} 
              goal={15000} 
            />
            <CampaignWireframeCard 
              title="Tree Planting Drive" 
              description="Restoring local parks with 500 new native tree saplings." 
              raised={1500} 
              goal={3000} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const CampaignWireframeCard: React.FC<{ title: string; description: string; raised: number; goal: number }> = ({ title, description, raised, goal }) => {
  const percentage = Math.min((raised / goal) * 100, 100);
  return (
    <div className="border border-slate-300 rounded-xl p-6 bg-white flex justify-between items-center shadow-sm">
      <div className="flex-grow max-w-2xl">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{description}</p>
        
        <div className="space-y-2">
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-slate-500 h-full" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>${raised.toLocaleString()} raised of ${goal.toLocaleString()}</span>
            <span>Goal: ${goal.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="ml-10">
        <button className="px-8 py-3 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
          Donate
        </button>
      </div>
    </div>
  );
};

export default WireframeDashboard;