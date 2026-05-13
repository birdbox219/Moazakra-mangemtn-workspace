import { useEffect, useState } from 'react';
import { api, type Hub } from '../api';

export default function HubsView() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [formData, setFormData] = useState<Hub>({ name: '', street: '', city: '', district: '', building: '', layout: '' });
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this hub?')) {
      try {
        await api.hubs.delete(id);
        fetchHubs();
      } catch (err) {
        console.error('Error deleting hub:', err);
        alert('Failed to delete hub. Ensure there are no dependent workspaces.');
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Card */}
      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Add New Hub</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Hub Name"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="district"
              placeholder="District"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.district}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="street"
              placeholder="Street"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.street}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="building"
              placeholder="Building"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.building}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="layout"
              placeholder="Layout Info"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.layout}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 w-full md:w-auto"
            >
              Add Hub
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="font-bold text-gray-700">Hub List</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading hubs...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-semibold">Name</th>
                <th className="px-8 py-4 font-semibold">Location</th>
                <th className="px-8 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hubs.map((hub) => (
                <tr key={hub.hubID} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">{hub.name}</td>
                  <td className="px-8 py-4 text-gray-600">
                    {[hub.building, hub.street, hub.district, hub.city].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => handleDelete(hub.hubID!)}
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {hubs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-gray-400 italic">
                    No hubs found. Add your first hub above!
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
