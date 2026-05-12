import { useState } from 'react';
import MembersView from './components/MembersView';
import WorkspacesView from './components/WorkspacesView';
import ReservationsView from './components/ReservationsView';
import EquipmentView from './components/EquipmentView';
import ReportDashboard from "./components/ReportDashboard";
import HubsView from './components/HubsView';
function App() {
  const [activeTab, setActiveTab] = useState('members');

  const tabs = [
  { id: 'members', name: 'Members', icon: '👥' },
  { id: 'hubs', name: 'Hubs', icon: '📍' },
  { id: 'workspaces', name: 'Workspaces', icon: '🏢' },
  { id: 'reservations', name: 'Reservations', icon: '📅' },
  { id: 'equipment', name: 'Equipment', icon: '🛠️' },
  { id: 'report', name: 'Report', icon: '📊' },
];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold border-b border-indigo-600 bg-indigo-800">
          Mozakrah Management Hub
        </div>
        <nav className="flex-1 mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        <div className="p-4 text-xs text-indigo-300 text-center border-t border-indigo-600">
          © 2026 Mozakrah Management
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
            {activeTab} Management
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
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
