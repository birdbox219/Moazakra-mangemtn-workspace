import { useEffect, useState } from 'react';
import { api, type Equipment } from '../api';

export default function EquipmentView() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [formData, setFormData] = useState<Equipment>({ name: '', type: '' });
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    equipmentId: number | null;
    equipmentName: string;
    usageCount: number;
  }>({
    isOpen: false,
    equipmentId: null,
    equipmentName: '',
    usageCount: 0,
  });

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

  const checkUsage = async (id: number, name: string) => {
    try {
      const data = await api.equipment.getUsage(id);
      setDeleteModal({
        isOpen: true,
        equipmentId: id,
        equipmentName: name,
        usageCount: data.count,
      });
    } catch (err) {
      console.error('Error checking usage:', err);
      setDeleteModal({
        isOpen: true,
        equipmentId: id,
        equipmentName: name,
        usageCount: 0,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.equipmentId === null) return;

    try {
      await api.equipment.delete(deleteModal.equipmentId);
      setDeleteModal({ isOpen: false, equipmentId: null, equipmentName: '', usageCount: 0 });
      fetchEquipment();
    } catch (err) {
      console.error('Error deleting equipment:', err);
      alert('Failed to purge asset');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, equipmentId: null, equipmentName: '', usageCount: 0 });
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
                      onClick={() => checkUsage(item.equipmentID!, item.name)}
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
              Purge Asset?
            </h3>

            {deleteModal.usageCount > 0 ? (
              <div className="mb-8 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <p className="text-text-main mb-3 text-center">
                  <span className="font-black">{deleteModal.equipmentName}</span> is currently assigned to{' '}
                  <span className="text-red-500 font-black">{deleteModal.usageCount}</span>{' '}
                  reservations.
                </p>
                <p className="text-sm text-text-muted text-center leading-relaxed font-medium">
                  Proceeding will remove this asset from all associated reservations.
                </p>
              </div>
            ) : (
              <p className="text-text-muted mb-8 text-center leading-relaxed font-medium">
                Are you sure you want to purge <span className="font-bold text-text-main">{deleteModal.equipmentName}</span> from the inventory?
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
