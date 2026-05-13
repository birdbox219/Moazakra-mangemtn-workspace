import { useEffect, useState } from 'react';
import { api, type Workspace, type Hub } from '../api';

export default function WorkspacesView() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [formData, setFormData] = useState<Workspace>({ type: '', price: 0, capacity: 0, hubID: 0 });
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    workspaceId: number | null;
    workspaceType: string;
    reservationCount: number;
  }>({
    isOpen: false,
    workspaceId: null,
    workspaceType: '',
    reservationCount: 0,
  });

  const fetchData = async () => {
    try {
      const [wsData, hubData] = await Promise.all([
        api.workspaces.getAll(),
        api.workspaces.getHubs()
      ]);
      setWorkspaces(wsData);
      setHubs(hubData);
      if (hubData.length > 0) setFormData(prev => ({ ...prev, hubID: hubData[0].hubID }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.workspaces.add(formData);
    setFormData({ ...formData, type: '', price: 0, capacity: 0 });
    fetchData();
  };

  const checkDependencies = async (id: number, type: string) => {
    try {
      const reservations = await api.reservations.getAll();
      const wsReservations = reservations.filter((res: any) => res.workspaceID === id);
      
      setDeleteModal({
        isOpen: true,
        workspaceId: id,
        workspaceType: type,
        reservationCount: wsReservations.length,
      });
    } catch (err) {
      console.error('Error checking dependencies:', err);
      setDeleteModal({
        isOpen: true,
        workspaceId: id,
        workspaceType: type,
        reservationCount: 0,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.workspaceId === null) return;

    try {
      if (deleteModal.reservationCount > 0) {
        const reservations = await api.reservations.getAll();
        const wsReservations = reservations.filter((res: any) => res.workspaceID === deleteModal.workspaceId);
        
        for (const res of wsReservations) {
          await api.reservations.delete(res.reservationID);
        }
      }

      await api.workspaces.delete(deleteModal.workspaceId);
      setDeleteModal({ isOpen: false, workspaceId: null, workspaceType: '', reservationCount: 0 });
      fetchData();
    } catch (err) {
      console.error('Error deleting workspace:', err);
      alert('Failed to remove unit');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, workspaceId: null, workspaceType: '', reservationCount: 0 });
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Form Card */}
      <div className="glass p-6 md:p-10 rounded-2xl shadow-xl shadow-black/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 bg-primary h-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <h2 className="text-xl font-display font-bold text-text-main mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">＋</span>
          Add New Workspace
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="space-y-2 lg:col-span-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Type</label>
            <input
              type="text"
              placeholder="e.g. Desk"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2 lg:col-span-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Price ($)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2 lg:col-span-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Capacity</label>
            <input
              type="number"
              placeholder="1"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main"
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2 lg:col-span-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Location Hub</label>
            <select
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main appearance-none"
              value={formData.hubID}
              onChange={(e) => setFormData({ ...formData, hubID: parseInt(e.target.value) })}
              required
            >
              {hubs.map(hub => (
                <option key={hub.hubID} value={hub.hubID}>{hub.name}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-primary text-surface px-6 py-4 rounded-xl font-display font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 glitch-hover"
            >
              Add Unit
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="glass rounded-2xl shadow-xl shadow-black/5 overflow-hidden border border-border">
        <div className="p-6 md:p-8 border-b border-border bg-surface-hover/50 flex justify-between items-center">
          <h2 className="font-display font-bold text-text-main text-lg">Inventory Management</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
            {workspaces.length} Units
          </span>
        </div>
        {loading ? (
          <div className="p-20 text-center text-text-muted font-medium animate-pulse">Fetching inventory...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[800px]">
            <thead className="bg-surface-hover text-text-muted text-xs uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 font-black">Workspace Type</th>
                <th className="px-8 py-5 font-black">Price / Hour</th>
                <th className="px-8 py-5 font-black">Capacity</th>
                <th className="px-8 py-5 font-black">Hub</th>
                <th className="px-8 py-5 font-black text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {workspaces.map((ws) => (
                <tr key={ws.workspaceID} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-bold text-text-main">{ws.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-primary font-bold">${ws.price.toFixed(2)}</td>
                  <td className="px-8 py-6 text-text-muted font-medium">
                    <span className="text-text-main font-bold">{ws.capacity}</span> Guests
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-text-muted bg-border/50 px-2 py-1 rounded">
                      {hubs.find(h => h.hubID === ws.hubID)?.name || ws.hubID}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => checkDependencies(ws.workspaceID!, ws.type)}
                      className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {workspaces.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-text-muted italic opacity-50">
                    No workspaces in inventory.
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
              Remove Workspace?
            </h3>

            {deleteModal.reservationCount > 0 ? (
              <div className="mb-8 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <p className="text-text-main mb-3 text-center">
                  <span className="font-black">{deleteModal.workspaceType}</span> has{' '}
                  <span className="text-red-500 font-black">{deleteModal.reservationCount}</span>{' '}
                  active reservations.
                </p>
                <p className="text-sm text-text-muted text-center leading-relaxed font-medium">
                  Proceeding will result in a <span className="text-red-500 font-bold uppercase">cascade deletion</span> of all associated reservation data.
                </p>
              </div>
            ) : (
              <p className="text-text-muted mb-8 text-center leading-relaxed font-medium">
                Are you sure you want to remove <span className="font-bold text-text-main">{deleteModal.workspaceType}</span> from the inventory? This action is irreversible.
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
