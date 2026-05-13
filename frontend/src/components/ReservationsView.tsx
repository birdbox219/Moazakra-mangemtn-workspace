import { useEffect, useState } from 'react';
import { api, type Reservation, type Member, type Workspace } from '../api';

export default function ReservationsView() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [formData, setFormData] = useState<Reservation>({
    memberID: 0,
    workspaceID: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'Confirmed'
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resData, memData, wsData] = await Promise.all([
        api.reservations.getAll(),
        api.members.getAll(),
        api.workspaces.getAll()
      ]);
      setReservations(resData);
      setMembers(memData);
      setWorkspaces(wsData);
      
      if (memData.length > 0 && wsData.length > 0) {
        setFormData(prev => ({
          ...prev,
          memberID: memData[0].memberID,
          workspaceID: wsData[0].workspaceID
        }));
      }
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
    await api.reservations.add(formData);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await api.reservations.delete(id);
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
          Create New Reservation
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Member</label>
            <select
              className="w-full p-4 bg-surface-hover border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-text-main appearance-none"
              value={formData.memberID}
              onChange={(e) => setFormData({ ...formData, memberID: parseInt(e.target.value) })}
              required
            >
              {members.map(m => <option key={m.memberID} value={m.memberID}>{m.fullName || `${m.fName} ${m.lName}`}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Workspace</label>
            <select
              className="w-full p-4 bg-surface-hover border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-text-main appearance-none"
              value={formData.workspaceID}
              onChange={(e) => setFormData({ ...formData, workspaceID: parseInt(e.target.value) })}
              required
            >
              {workspaces.map(w => <option key={w.workspaceID} value={w.workspaceID}>{w.type} (${w.price})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Status</label>
            <select
              className="w-full p-4 bg-surface-hover border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-text-main appearance-none"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Start Date</label>
            <input
              type="date"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-text-main"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">End Date</label>
            <input
              type="date"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-text-main"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary text-surface px-10 py-4 rounded-2xl font-display font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 glitch-hover"
            >
              Book Reservation
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="glass rounded-2xl shadow-xl shadow-black/5 overflow-hidden border border-border">
        <div className="p-6 md:p-8 border-b border-border bg-surface-hover/50 flex justify-between items-center">
          <h2 className="font-display font-bold text-text-main text-lg">Active Bookings</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
            {reservations.length} Entries
          </span>
        </div>
        {loading ? (
          <div className="p-20 text-center text-text-muted font-medium animate-pulse">Retrieving booking manifest...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[800px]">
            <thead className="bg-surface-hover text-text-muted text-xs uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 font-black">Member Entity</th>
                <th className="px-8 py-5 font-black">Resource Allocation</th>
                <th className="px-8 py-5 font-black">Time Window</th>
                <th className="px-8 py-5 font-black">System Status</th>
                <th className="px-8 py-5 font-black text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reservations.map((res) => (
                <tr key={res.reservationID} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-main text-base">{res.memberName}</span>
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">UID: {res.memberID}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-text-main flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {res.workspaceType}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-text-muted font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-border/50 px-2 py-0.5 rounded font-mono text-[11px]">{new Date(res.startDate).toLocaleDateString()}</span>
                      <span className="text-[10px] opacity-30">▶</span>
                      <span className="bg-border/50 px-2 py-0.5 rounded font-mono text-[11px]">{new Date(res.endDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      res.status === 'Confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      res.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleDelete(res.reservationID!)}
                      className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                      Void
                    </button>
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-text-muted italic opacity-50">
                    No active bookings found in the manifest.
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
