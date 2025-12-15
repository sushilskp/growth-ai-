import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Community from './components/Community';
import Profile from './components/Profile';
import Auth from './components/Auth';
import { Page, User } from './types';
import { getSessionUser, logoutUser } from './services/storageService';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const session = getSessionUser();
    if (session) {
      setUser(session);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const renderContent = () => {
    if (!user) return null;
    switch (activePage) {
      case Page.Dashboard:
        return <Dashboard user={user} />;
      case Page.Tasks:
        return <Tasks user={user} />;
      case Page.Community:
        return <Community user={user} />;
      case Page.Profile:
        return <Profile user={user} onUpdate={setUser} />;
      case Page.Settings:
        return <div className="p-10 text-center text-slate-500">Settings Page (Coming Soon)</div>;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen bg-[#0a0e17] text-white overflow-hidden relative font-sans selection:bg-blue-500/30">
        {/* Subtle global gradient orb */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-4">
             <span className="font-bold text-lg">G.Take</span>
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
                {mobileMenuOpen ? <X /> : <Menu />}
             </button>
        </div>

        <div className="z-10 flex w-full h-full pt-16 md:pt-0">
            <Sidebar 
                activePage={activePage} 
                setPage={setActivePage} 
                onLogout={handleLogout}
                mobileOpen={mobileMenuOpen}
                closeMobile={() => setMobileMenuOpen(false)}
            />
            
            <main className="flex-1 overflow-hidden relative flex">
                <div className="flex-1 overflow-y-auto relative scroll-smooth">
                    {renderContent()}
                </div>
                {/* Right Panel only visible on large screens or specific context if extended */}
                <RightPanel /> 
            </main>
        </div>
    </div>
  );
};

export default App;
