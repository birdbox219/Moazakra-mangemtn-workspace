import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import MembersView from './components/MembersView';
import WorkspacesView from './components/WorkspacesView';
import ReservationsView from './components/ReservationsView';
import EquipmentView from './components/EquipmentView';
import ReportDashboard from "./components/ReportDashboard";
import HubsView from './components/HubsView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('members');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { 
      id: 'members', 
      name: 'Members', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 'hubs', 
      name: 'Hubs', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'workspaces', 
      name: 'Workspaces', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: 'reservations', 
      name: 'Reservations', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'equipment', 
      name: 'Equipment', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    { 
      id: 'report', 
      name: 'Analytics', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex h-[100dvh] bg-surface font-body overflow-hidden transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 glass flex flex-col shadow-2xl transform transition-all duration-500 ease-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div 
          className="p-8 border-b border-border flex justify-between items-center shrink-0"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-surface shadow-lg shadow-primary/20">
              <span className="text-2xl">M</span>
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-text-main">
              Mozakrah Hub
            </span>
          </div>
          <button 
            className="md:hidden p-2 text-text-muted hover:text-primary transition-colors no-drag" 
            style={{ WebkitAppRegion: 'no-drag' } as any}
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 mt-8 px-4 overflow-y-auto space-y-2 no-drag">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === tab.id
                  ? 'bg-primary text-surface shadow-xl shadow-primary/20 font-semibold translate-x-2'
                  : 'hover:bg-surface-hover text-text-muted hover:text-text-main hover:translate-x-1'
              }`}
            >
              <div className={`
                mr-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110
                ${activeTab === tab.id ? 'text-surface' : 'text-primary/70'}
              `}>
                {tab.icon}
              </div>
              <span className="font-display tracking-wide">{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-border mt-auto no-drag">
          <div className="p-4 bg-surface-hover rounded-2xl border border-border">
            <p className="text-xs text-text-muted text-center font-medium opacity-60 uppercase tracking-widest">
              System v2.0
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header 
          className="h-20 flex items-center px-6 md:px-12 border-b border-border shrink-0 glass relative z-10"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          <button 
            className="mr-6 text-text-muted hover:text-primary md:hidden p-2.5 rounded-xl bg-surface-hover border border-border transition-all hover:scale-105 active:scale-95 no-drag"
            style={{ WebkitAppRegion: 'no-drag' } as any}
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-display font-black text-text-main capitalize tracking-tight glitch-hover cursor-default">
              {activeTab} <span className="text-primary font-light">Management</span>
            </h1>
            <p className="text-xs text-text-muted font-medium uppercase tracking-widest opacity-60">
              Control Center / {activeTab}
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12 relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[100px]" />
            <div className="absolute top-1/2 -left-24 w-64 h-64 bg-accent rounded-full blur-[80px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {activeTab === 'members' && <MembersView />}
            {activeTab === 'hubs' && <HubsView />}
            {activeTab === 'workspaces' && <WorkspacesView />}
            {activeTab === 'reservations' && <ReservationsView />}
            {activeTab === 'equipment' && <EquipmentView />}
            {activeTab === 'report' && <ReportDashboard />}
          </div>
        </main>
      </div>

      <ThemeSwitcher />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
