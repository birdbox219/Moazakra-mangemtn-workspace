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
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Form Card */}
      <div className="glass p-6 md:p-10 rounded-2xl shadow-xl shadow-black/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 bg-primary h-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <h2 className="text-xl font-display font-bold text-text-main mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">＋</span>
          Catalog New Assets
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Asset Name</label>
            <input
              type="text"
              placeholder="e.g. UltraWide Monitor"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Category</label>
            <input
              type="text"
              placeholder="Hardware / Peripheral"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary text-surface px-10 py-4 rounded-2xl font-display font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 glitch-hover"
            >
              Add to Inventory
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="glass rounded-2xl shadow-xl shadow-black/5 overflow-hidden border border-border">
        <div className="p-6 md:p-8 border-b border-border bg-surface-hover/50 flex justify-between items-center">
          <h2 className="font-display font-bold text-text-main text-lg">Asset Repository</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
            {equipment.length} Units
          </span>
        </div>
        {loading ? (
          <div className="p-20 text-center text-text-muted font-medium animate-pulse">Scanning assets...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[600px]">
            <thead className="bg-surface-hover text-text-muted text-xs uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 font-black">Equipment / Asset</th>
                <th className="px-8 py-5 font-black">Classification</th>
                <th className="px-8 py-5 font-black text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {equipment.map((item) => (
                <tr key={item.equipmentID} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                      <span className="font-bold text-text-main text-base">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-text-muted bg-border/50 px-3 py-1 rounded-full uppercase tracking-widest border border-border/50">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleDelete(item.equipmentID!)}
                      className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                      Purge
                    </button>
                  </td>
                </tr>
              ))}
              {equipment.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-text-muted italic opacity-50">
                    No registered assets found.
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
