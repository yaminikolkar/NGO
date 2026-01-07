
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  users: User[];
  onGoBack: () => void;
}

type FlowStep = 'auth' | 'registration';

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, users, onGoBack }) => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.DONOR);
  const [flowStep, setFlowStep] = useState<FlowStep>('auth');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Selected Role for Registration form (inherited from activeTab)
  const [selectedPublicRole, setSelectedPublicRole] = useState<UserRole | null>(null);

  // Registration fields
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [availability, setAvailability] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const availableSkills = ['Teaching', 'Logistics', 'Healthcare', 'Teamwork', 'Mathematics', 'Digital Marketing'];

  const resetForm = () => {
    setFlowStep('auth');
    setSelectedPublicRole(null);
    setEmail('');
    setPassword('');
    setName('');
    setCity('');
    setState('');
    setPincode('');
    setAvailability('');
    setSkills([]);
    setErrorMessage(null);
  };

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    resetForm();
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);
    
    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedCredential = password.trim();

      // Admin-only demo authorization (stays completely isolated)
      if (activeTab === UserRole.ADMIN) {
        if (trimmedCredential === 'admin123') {
          const adminUser: User = {
            id: `admin-${Date.now()}`,
            email: trimmedEmail || 'admin@ngo.com',
            name: 'NGO Administrator',
            role: UserRole.ADMIN,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedEmail || 'admin')}`,
            city: 'Global',
            state: 'HQ'
          };
          localStorage.setItem('ngo_admin_authorized', 'true');
          onLogin(adminUser);
          setIsProcessing(false);
          return;
        } else {
          setErrorMessage("Invalid Admin Security Key");
          setIsProcessing(false);
          return;
        }
      }

      // Public User Initial Auth (Donor/Volunteer)
      setSelectedPublicRole(activeTab);
      setFlowStep('registration');
      setIsProcessing(false);
    }, 800);
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !state || !pincode) {
      setErrorMessage("Please complete your location details (City, State, Pin).");
      return;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      email: email.toLowerCase(),
      name: name.trim(),
      password: password,
      role: selectedPublicRole!,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      availability: availability.trim(),
      skills: selectedPublicRole === UserRole.VOLUNTEER ? skills : undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
    };

    onRegister(newUser);
  };

  const toggleSkill = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Helper to get correct placeholder based on tab
  const getEmailPlaceholder = () => {
    if (activeTab === UserRole.ADMIN) return 'admin@ngo.com';
    if (activeTab === UserRole.DONOR) return 'donor@gmail.com';
    return 'volunteer@gmail.com';
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={onGoBack}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Home
      </button>

      {/* Role Selection Tabs - Only in Step 1 */}
      {flowStep === 'auth' && (
        <div className="flex bg-slate-200 p-1.5 rounded-2xl mb-10 shadow-inner">
          {[UserRole.DONOR, UserRole.VOLUNTEER, UserRole.ADMIN].map(role => (
            <button
              key={role}
              onClick={() => handleTabChange(role)}
              className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all ${
                activeTab === role 
                  ? role === UserRole.ADMIN 
                    ? 'bg-slate-900 text-white shadow-xl transform scale-[1.02]' 
                    : 'bg-white text-indigo-600 shadow-xl transform scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      <div className={`bg-white rounded-[2.5rem] border shadow-2xl overflow-hidden relative transition-all duration-300 ${
        activeTab === UserRole.ADMIN ? 'border-slate-900' : 'border-slate-200'
      }`}>
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4 ${
              activeTab === UserRole.ADMIN ? 'border-slate-900' : 'border-indigo-600'
            }`}></div>
            <p className="font-black text-slate-900 animate-pulse uppercase tracking-widest text-xs italic">
              Connecting...
            </p>
          </div>
        )}

        <div className="p-10 sm:p-14">
          
          {/* STEP 1: LOGIN (Public & Admin Entry) */}
          {flowStep === 'auth' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-12">
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black mx-auto mb-8 transition-all shadow-2xl ${
                  activeTab === UserRole.ADMIN ? 'bg-slate-950 scale-110' : activeTab === UserRole.DONOR ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}>
                  {activeTab === UserRole.ADMIN ? (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  ) : activeTab === UserRole.DONOR ? (
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  ) : (
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
                  )}
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 text-center">
                  {activeTab === UserRole.ADMIN ? 'Admin Login' : `${activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} Login`}
                </h2>
                <p className="text-slate-500 font-medium text-sm italic text-center">
                  {activeTab === UserRole.ADMIN 
                    ? 'Security Key required for manager nodes.' 
                    : `Welcome back to the NGO ${activeTab.toLowerCase()} login portal.`}
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                  <p className="text-xs font-black uppercase tracking-widest">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Email Address</label>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all bg-slate-50 font-bold"
                    placeholder={getEmailPlaceholder()}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">
                    {activeTab === UserRole.ADMIN ? "Security Key" : "Password"}
                  </label>
                  <input 
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all bg-slate-50 font-bold"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className={`w-full py-5 text-white rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-[0.98] ${
                  activeTab === UserRole.ADMIN ? 'bg-slate-950 shadow-slate-200' : activeTab === UserRole.DONOR ? 'bg-indigo-600 shadow-indigo-100' : 'bg-emerald-600 shadow-emerald-100'
                }`}>
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: REGISTRATION DETAILS (Public User specific forms) */}
          {flowStep === 'registration' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-10">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block ${
                  selectedPublicRole === UserRole.DONOR ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  Member Registration: {selectedPublicRole}
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter text-center">Create Profile</h2>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Full Legal Name</label>
                  <input 
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none bg-slate-50 font-bold"
                    placeholder="Jane Impact"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">City</label>
                    <input 
                      type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none bg-slate-50 font-bold"
                      placeholder="SF"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">State</label>
                    <input 
                      type="text" required value={state} onChange={(e) => setState(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none bg-slate-50 font-bold"
                      placeholder="CA"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Pincode</label>
                    <input 
                      type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none bg-slate-50 font-bold"
                      placeholder="94103"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Account Email</label>
                  <input 
                    type="email" disabled value={email}
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-200 text-slate-500 font-bold cursor-not-allowed"
                  />
                </div>

                {selectedPublicRole === UserRole.VOLUNTEER && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Availability Schedule</label>
                      <input 
                        type="text" required value={availability} onChange={(e) => setAvailability(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none bg-slate-50 font-bold"
                        placeholder="Weekends, On-call, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Skills Inventory</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {availableSkills.map(skill => (
                          <button
                            key={skill} type="button" onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black border-2 transition-all ${
                              skills.includes(skill) ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" className={`w-full py-5 text-white rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-[0.98] ${
                  selectedPublicRole === UserRole.DONOR ? 'bg-indigo-600 shadow-indigo-100' : 'bg-emerald-600 shadow-emerald-100'
                }`}>
                  Complete Registration
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
