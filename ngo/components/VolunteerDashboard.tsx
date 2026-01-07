
import React, { useState, useMemo } from 'react';
import { User, Event, UserRole } from '../types';

interface VolunteerDashboardProps {
  user: User;
  events: Event[];
  onUpdateProfile: (updatedUser: User) => void;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ user, events, onUpdateProfile }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(!user.skills || user.skills.length === 0);
  const [profileData, setProfileData] = useState({
    name: user.name,
    city: user.city || '',
    availability: user.availability || '',
    skills: user.skills || []
  });

  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, boolean>>({});

  const myEvents = useMemo(() => {
    return events.filter(e => e.volunteers.includes(user.id));
  }, [events, user.id]);

  const availableSkills = ['Teaching', 'Logistics', 'Healthcare', 'Teamwork', 'Mathematics', 'Digital Marketing'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      ...profileData
    });
    setIsEditingProfile(false);
  };

  const toggleSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  const markAttendance = (eventId: string) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [eventId]: true
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-700">
      {/* Welcome Header */}
      <header className="mb-10 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 text-center md:text-left">Welcome, {user.name}!</h1>
          <p className="text-slate-500 font-medium italic text-center md:text-left">
            Ready for your next mission? You have <span className="text-emerald-600 font-bold">{myEvents.length} active assignments</span>.
          </p>
        </div>
        <button 
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Management Section */}
        {isEditingProfile && (
          <div className="lg:col-span-12 bg-white rounded-[2.5rem] border-4 border-emerald-500/20 p-8 shadow-2xl animate-in slide-in-from-top-4">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </span>
              Complete Your Volunteer Profile
            </h3>
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Display Name</label>
                  <input 
                    type="text" required value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Active City</label>
                  <input 
                    type="text" required value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Availability Schedule</label>
                  <input 
                    type="text" required value={profileData.availability} onChange={e => setProfileData({...profileData, availability: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 outline-none bg-slate-50 font-bold"
                    placeholder="e.g. Weekends, Tuesday Evenings"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Skills Inventory</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill} type="button" onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                        profileData.skills.includes(skill) ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <button 
                  type="submit"
                  className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assigned Events Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Missions</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{myEvents.length} Assignments</span>
          </div>

          {myEvents.length > 0 ? (
            <div className="space-y-4">
              {myEvents.map(event => (
                <div key={event.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all border-l-8 border-l-emerald-500">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded">Confirmed</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.date}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900">{event.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{event.location} • {event.city}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {attendanceStatus[event.id] ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        Attended
                      </div>
                    ) : (
                      <button 
                        onClick={() => markAttendance(event.id)}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md active:scale-95"
                      >
                        Mark Attendance
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-2">No Active Missions</h4>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">Head over to the <span className="text-indigo-600 font-bold">Volunteer Feed</span> to discover opportunities in your city.</p>
            </div>
          )}
        </div>

        {/* Impact Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Your Contribution</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missions Done</span>
                <span className="text-2xl font-black text-emerald-500">{Object.keys(attendanceStatus).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Hub</span>
                <span className="font-bold">{user.city}</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-4">
                {user.skills?.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-black uppercase tracking-widest">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200">
             <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4">Volunteer Ethics</h4>
             <ul className="space-y-3">
               {['Arrive 10 mins early', 'Wear NGO vest', 'Log your hours', 'Stay connected'].map(rule => (
                 <li key={rule} className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                   {rule}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
