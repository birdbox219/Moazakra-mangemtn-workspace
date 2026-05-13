import { useEffect, useState } from 'react';
import { api, type Workspace, type Hub } from '../api';

export default function WorkspacesView() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [formData, setFormData] = useState<Workspace>({ type: '', price: 0, capacity: 0, hubID: 0 });
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await api.workspaces.delete(id);
      fetchData();
    }
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
                      onClick={() => handleDelete(ws.workspaceID!)}
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
    </div>
  );
}
