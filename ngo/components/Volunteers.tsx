
import React, { useState, useMemo } from 'react';
import { Event, User, UserRole } from '../types';

interface VolunteersProps {
  events: Event[];
  user: User | null;
  onJoin: (id: string) => void;
}

const Volunteers: React.FC<VolunteersProps> = ({ events, user, onJoin }) => {
  const [filter, setFilter] = useState('All');
  const isVolunteer = user?.role === UserRole.VOLUNTEER;

  const filteredEvents = useMemo(() => {
    if (filter === 'Nearby' && user) {
      return events.filter(e => e.city.toLowerCase() === user.city?.toLowerCase());
    }
    return events;
  }, [events, filter, user]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Volunteer Hub</h1>
          <p className="text-slate-500">Discover impactful missions waiting for your unique skills.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setFilter('All')}
             className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filter === 'All' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
           >
             Global Feed
           </button>
           {user && (
             <button 
               onClick={() => setFilter('Nearby')}
               className={`px-6 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${filter === 'Nearby' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
               In {user.city}
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.map(event => {
          const hasJoined = user && event.volunteers.includes(user.id);
          const isMatched = user?.skills?.some(s => event.requiredSkills.includes(s));
          const isLocal = user && event.city.toLowerCase() === user.city?.toLowerCase();

          return (
            <div key={event.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group">
              {isLocal && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-1.5 rounded-bl-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 z-10">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Local Event
                </div>
              )}
              
              <div className="flex flex-col h-full relative z-0">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors mb-4">{event.title}</h3>
                  
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                      {event.location} • {event.city}, {event.state}
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address + ', ' + event.city + ', ' + event.state)}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline ml-6"
                    >
                      View Navigation Map →
                    </a>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-8 font-medium">{event.description}</p>
                </div>

                <div className="mt-auto space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      Targeted Skills {isMatched && <span className="text-emerald-500">(Your Match)</span>}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {event.requiredSkills.map(skill => {
                        const isUserSkill = user?.skills?.includes(skill);
                        return (
                          <span key={skill} className={`px-4 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
                            isUserSkill ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}>
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                          <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=v${event.id}${i}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="v" />
                        ))}
                        <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">+{event.volunteers.length + 8}</div>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Volunteers</p>
                    </div>

                    {isVolunteer ? (
                      <button 
                        disabled={hasJoined ?? false}
                        onClick={() => onJoin(event.id)}
                        className={`px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                          hasJoined 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95'
                        }`}
                      >
                        {hasJoined ? 'Enrolled' : 'Enlist Now'}
                      </button>
                    ) : (
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Login to Enroll</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Volunteers;
