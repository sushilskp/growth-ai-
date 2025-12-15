import React from 'react';
import { LayoutDashboard, CheckSquare, Users, User, Settings, LogOut, Hexagon } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setPage: (page: Page) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  closeMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, onLogout, mobileOpen, closeMobile }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: Page.Dashboard },
    { icon: CheckSquare, label: Page.Tasks },
    { icon: Users, label: Page.Community },
    { icon: User, label: Page.Profile },
    { icon: Settings, label: Page.Settings },
  ];

  const handleNav = (page: Page) => {
    setPage(page);
    closeMobile();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        glass-panel border-r border-white/10 flex flex-col h-full
      `}>
        <div className="p-8 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
            <Hexagon className="text-white w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">G.Take</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.label)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${activePage === item.label 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 ${activePage === item.label ? 'animate-pulse' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {activePage === item.label && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto mb-4">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log out</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
