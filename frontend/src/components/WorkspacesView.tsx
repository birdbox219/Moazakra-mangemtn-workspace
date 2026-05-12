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
    <div className="space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Card */}
      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Add New Workspace</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <input
            type="text"
            placeholder="Type (e.g. Desk, Office)"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.capacity || ''}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
          />
          <select
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
            value={formData.hubID}
            onChange={(e) => setFormData({ ...formData, hubID: parseInt(e.target.value) })}
            required
          >
            {hubs.map(hub => (
              <option key={hub.hubID} value={hub.hubID}>{hub.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Add
          </button>
        </form>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="font-bold text-gray-700">Workspace List</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading workspaces...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-semibold">Type</th>
                <th className="px-8 py-4 font-semibold">Price</th>
                <th className="px-8 py-4 font-semibold">Capacity</th>
                <th className="px-8 py-4 font-semibold">Hub</th>
                <th className="px-8 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workspaces.map((ws) => (
                <tr key={ws.workspaceID} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">{ws.type}</td>
                  <td className="px-8 py-4 text-gray-600">${ws.price}</td>
                  <td className="px-8 py-4 text-gray-600">{ws.capacity} people</td>
                  <td className="px-8 py-4 text-gray-600">
                    {hubs.find(h => h.hubID === ws.hubID)?.name || ws.hubID}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => handleDelete(ws.workspaceID!)}
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {workspaces.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 italic">
                    No workspaces found.
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
