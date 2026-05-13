import { useEffect, useState } from 'react';
import { api, type Hub } from '../api';

export default function HubsView() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [formData, setFormData] = useState<Hub>({ name: '', street: '', city: '', district: '', building: '', layout: '' });
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    hubId: number | null;
    hubName: string;
    workspaceCount: number;
    reservationCount: number;
  }>({
    isOpen: false,
    hubId: null,
    hubName: '',
    workspaceCount: 0,
    reservationCount: 0,
  });

  const fetchHubs = async () => {
    try {
      const data = await api.hubs.getAll();
      setHubs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      await api.hubs.add(formData);
      setFormData({ name: '', street: '', city: '', district: '', building: '', layout: '' });
      fetchHubs();
    } catch (err) {
      console.error('Error adding hub:', err);
      alert('Failed to add hub');
    }
  };

  const checkDependencies = async (hubId: number, hubName: string) => {
    try {
      const [workspaces, reservations] = await Promise.all([
        api.workspaces.getAll(),
        api.reservations.getAll()
      ]);

      const hubWorkspaces = workspaces.filter((ws: any) => ws.hubID === hubId);
      const wsIds = hubWorkspaces.map((ws: any) => ws.workspaceID);
      const hubReservations = reservations.filter((res: any) => wsIds.includes(res.workspaceID));

      setDeleteModal({
        isOpen: true,
        hubId,
        hubName,
        workspaceCount: hubWorkspaces.length,
        reservationCount: hubReservations.length,
      });
    } catch (err) {
      console.error('Error checking dependencies:', err);
      setDeleteModal({
        isOpen: true,
        hubId,
        hubName,
        workspaceCount: 0,
        reservationCount: 0,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.hubId === null) return;

    try {
      // 1. Fetch dependencies
      const [workspaces, reservations] = await Promise.all([
        api.workspaces.getAll(),
        api.reservations.getAll()
      ]);

      const hubWorkspaces = workspaces.filter((ws: any) => ws.hubID === deleteModal.hubId);
      const wsIds = hubWorkspaces.map((ws: any) => ws.workspaceID);
      const hubReservations = reservations.filter((res: any) => wsIds.includes(res.workspaceID));

      // 2. Delete reservations first
      for (const res of hubReservations) {
        await api.reservations.delete(res.reservationID);
      }

      // 3. Delete workspaces
      for (const ws of hubWorkspaces) {
        await api.workspaces.delete(ws.workspaceID);
      }

      // 4. Delete hub
      await api.hubs.delete(deleteModal.hubId);
      
      setDeleteModal({ isOpen: false, hubId: null, hubName: '', workspaceCount: 0, reservationCount: 0 });
      fetchHubs();
    } catch (err) {
      console.error('Error deleting hub:', err);
      alert('Failed to decommission hub');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, hubId: null, hubName: '', workspaceCount: 0, reservationCount: 0 });
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Form Card */}
      <div className="glass p-6 md:p-10 rounded-2xl shadow-xl shadow-black/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 bg-primary h-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <h2 className="text-xl font-display font-bold text-text-main mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">＋</span>
          Establish New Hub
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Hub Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Neo Tokyo"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="Metropolis"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">District</label>
            <input
              type="text"
              name="district"
              placeholder="Central Sector"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.district}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Street</label>
            <input
              type="text"
              name="street"
              placeholder="Cyber Avenue 101"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.street}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Building</label>
            <input
              type="text"
              name="building"
              placeholder="Unit 7B"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.building}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Layout Info</label>
            <input
              type="text"
              name="layout"
              placeholder="3rd Floor, Open Space"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.layout}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-primary text-surface px-10 py-4 rounded-2xl font-display font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 w-full md:w-auto glitch-hover"
            >
              Initialize Hub
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="glass rounded-2xl shadow-xl shadow-black/5 overflow-hidden border border-border">
        <div className="p-6 md:p-8 border-b border-border bg-surface-hover/50 flex justify-between items-center">
          <h2 className="font-display font-bold text-text-main text-lg">Hub Network</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
            {hubs.length} Active Nodes
          </span>
        </div>
        {loading ? (
          <div className="p-20 text-center text-text-muted font-medium animate-pulse">Syncing network nodes...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[600px]">
            <thead className="bg-surface-hover text-text-muted text-xs uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 font-black">Designation</th>
                <th className="px-8 py-5 font-black">Coordinates / Address</th>
                <th className="px-8 py-5 font-black text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hubs.map((hub) => (
                <tr key={hub.hubID} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-main text-base">{hub.name}</span>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">HUB-ID: {hub.hubID}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-text-muted font-medium">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {[hub.building, hub.street, hub.district, hub.city].filter(Boolean).join(', ') || <span className="opacity-20 italic">No address data</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => checkDependencies(hub.hubID!, hub.name)}
                      className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                      Decommission
                    </button>
                  </td>
                </tr>
              ))}
              {hubs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-text-muted italic opacity-50">
                    No active hubs detected in the network.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="glass rounded-3xl shadow-2xl p-10 max-w-md w-full animate-in fade-in zoom-in duration-500 border border-red-500/20">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-display font-black text-text-main mb-4 text-center">
              Decommission Hub?
            </h3>

            {(deleteModal.workspaceCount > 0 || deleteModal.reservationCount > 0) ? (
              <div className="mb-8 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <p className="text-text-main mb-3 text-center">
                  <span className="font-black">{deleteModal.hubName}</span> contains:
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-surface rounded-xl border border-border">
                    <span className="block text-xl font-black text-primary">{deleteModal.workspaceCount}</span>
                    <span className="text-[10px] text-text-muted uppercase font-bold">Workspaces</span>
                  </div>
                  <div className="text-center p-2 bg-surface rounded-xl border border-border">
                    <span className="block text-xl font-black text-accent">{deleteModal.reservationCount}</span>
                    <span className="text-[10px] text-text-muted uppercase font-bold">Reservations</span>
                  </div>
                </div>
                <p className="text-sm text-text-muted text-center leading-relaxed font-medium">
                  Decommissioning will result in a <span className="text-red-500 font-bold uppercase">cascade deletion</span> of all associated node data.
                </p>
              </div>
            ) : (
              <p className="text-text-muted mb-8 text-center leading-relaxed font-medium">
                Are you sure you want to decommission <span className="font-bold text-text-main">{deleteModal.hubName}</span>? This node will be removed from the network permanently.
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-6 py-4 border border-border text-text-muted font-bold rounded-2xl hover:bg-surface-hover transition-all uppercase tracking-widest text-xs"
              >
                Abort
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all uppercase tracking-widest text-xs"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
