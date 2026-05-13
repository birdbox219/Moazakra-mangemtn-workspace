import { useState } from 'react';
import MembersView from './components/MembersView';
import WorkspacesView from './components/WorkspacesView';
import ReservationsView from './components/ReservationsView';
import EquipmentView from './components/EquipmentView';
import ReportDashboard from "./components/ReportDashboard";
import HubsView from './components/HubsView';

function App() {
  const [activeTab, setActiveTab] = useState('members');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'members', name: 'Members', icon: '👥' },
    { id: 'hubs', name: 'Hubs', icon: '📍' },
    { id: 'workspaces', name: 'Workspaces', icon: '🏢' },
    { id: 'reservations', name: 'Reservations', icon: '📅' },
    { id: 'equipment', name: 'Equipment', icon: '🛠️' },
    { id: 'report', name: 'Report', icon: '📊' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-indigo-700 text-white flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 text-xl md:text-2xl font-bold border-b border-indigo-600 bg-indigo-800 flex justify-between items-center shrink-0">
          <span>Mozakrah Hub</span>
          <button 
            className="md:hidden text-indigo-200 hover:text-white" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false); // Auto close on mobile after selection
              }}
              className={`w-full flex items-center px-6 py-4 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 border-l-4 border-white font-semibold'
                  : 'hover:bg-indigo-600/50 text-indigo-100'
              }`}
            >
              <span className="mr-3 text-xl">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs text-indigo-300 text-center border-t border-indigo-600 shrink-0">
          © 2026 Mozakrah Management
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-8 border-b border-gray-200 shrink-0">
          <button 
            className="mr-4 text-gray-500 hover:text-indigo-600 md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-lg md:text-xl font-bold text-gray-800 capitalize truncate">
            {activeTab} Management
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'members' && <MembersView />}
            {activeTab === 'hubs' && <HubsView />}
            {activeTab === 'workspaces' && <WorkspacesView />}
            {activeTab === 'reservations' && <ReservationsView />}
            {activeTab === 'equipment' && <EquipmentView />}
            {activeTab === 'report' && <ReportDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
