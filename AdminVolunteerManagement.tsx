
import React, { useState } from 'react';
import { User, UserRole, Event } from '../types';

interface AdminVolunteerManagementProps {
  users: User[];
  events: Event[];
}

const AdminVolunteerManagement: React.FC<AdminVolunteerManagementProps> = ({ users, events }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const volunteers = users.filter(u => u.role === UserRole.VOLUNTEER);

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVolunteerAssignments = (volunteerId: string) => {
    return events.filter(e => e.volunteers.includes(volunteerId));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 text-center md:text-left">Personnel Management</h1>
          <p className="text-slate-500 font-medium italic text-center md:text-left">Overseeing {volunteers.length} verified social impact agents.</p>
        </div>
        <div className="w-full md:w-72 relative">
          <input 
            type="text" 
            placeholder="Search volunteers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 outline-none font-bold shadow-sm"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                <th className="px-8 py-6">Volunteer Profile</th>
                <th className="px-8 py-6">Mission Status</th>
                <th className="px-8 py-6">Skills & Specializations</th>
                <th className="px-8 py-6">Availability</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVolunteers.map(v => {
                const assignedEvents = getVolunteerAssignments(v.id);
                return (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={v.avatar} className="w-12 h-12 rounded-full ring-4 ring-slate-100" alt="" />
                        <div>
                          <p className="font-black text-slate-900">{v.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{v.email}</p>
                          <p className="text-[9px] text-indigo-500 font-black uppercase mt-0.5">{v.city || 'Global Hub'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${assignedEvents.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        <p className="text-xs font-bold text-slate-700">
                          {assignedEvents.length > 0 ? `${assignedEvents.length} Active Ops` : 'Standby'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1">
                        {v.skills?.map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase tracking-widest">
                            {skill}
                          </span>
                        )) || <span className="text-[10px] text-slate-300 italic">No skills listed</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-600">{v.availability || 'Flexible'}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md">
                        Assign Mission
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredVolunteers.length === 0 && (
            <div className="p-20 text-center grayscale opacity-50">
              <p className="text-slate-400 font-black uppercase tracking-widest">No matching personnel detected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVolunteerManagement;
