import { useEffect, useState } from 'react';
import { api, type Equipment } from '../api';

export default function EquipmentView() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [formData, setFormData] = useState<Equipment>({ name: '', type: '' });
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    try {
      const data = await api.equipment.getAll();
      setEquipment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.equipment.add(formData);
    setFormData({ name: '', type: '' });
    fetchEquipment();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await api.equipment.delete(id);
      fetchEquipment();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Add New Equipment</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            placeholder="Equipment Name"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Type (e.g. Monitor, Keyboard)"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Add Equipment
          </button>
        </form>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="font-bold text-gray-700">Inventory</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading inventory...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-semibold">Equipment Name</th>
                <th className="px-8 py-4 font-semibold">Type</th>
                <th className="px-8 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {equipment.map((item) => (
                <tr key={item.equipmentID} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-8 py-4 text-gray-600">{item.type}</td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => handleDelete(item.equipmentID!)}
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {equipment.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-gray-400 italic">
                    No equipment found.
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
