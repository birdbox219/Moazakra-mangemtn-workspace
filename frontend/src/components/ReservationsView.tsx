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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Create New Reservation</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 ml-1">Member</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-indigo-500"
              value={formData.memberID}
              onChange={(e) => setFormData({ ...formData, memberID: parseInt(e.target.value) })}
              required
            >
              {members.map(m => <option key={m.memberID} value={m.memberID}>{m.fullName || `${m.fName} ${m.lName}`}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 ml-1">Workspace</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-indigo-500"
              value={formData.workspaceID}
              onChange={(e) => setFormData({ ...formData, workspaceID: parseInt(e.target.value) })}
              required
            >
              {workspaces.map(w => <option key={w.workspaceID} value={w.workspaceID}>{w.type} (${w.price})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 ml-1">Status</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-indigo-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 ml-1">Start Date</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 ml-1">End Date</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Reserve
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="font-bold text-gray-700">Recent Reservations</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading reservations...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-semibold">Member</th>
                <th className="px-8 py-4 font-semibold">Workspace</th>
                <th className="px-8 py-4 font-semibold">Duration</th>
                <th className="px-8 py-4 font-semibold">Status</th>
                <th className="px-8 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((res) => (
                <tr key={res.reservationID} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-4">
                    <div className="font-medium text-gray-900">{res.memberName}</div>
                    <div className="text-xs text-gray-400">ID: {res.memberID}</div>
                  </td>
                  <td className="px-8 py-4 text-gray-600">{res.workspaceType}</td>
                  <td className="px-8 py-4 text-gray-600 text-sm">
                    {new Date(res.startDate).toLocaleDateString()} - {new Date(res.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      res.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      res.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => handleDelete(res.reservationID!)}
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">
                    No reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
