import { useEffect, useState } from 'react';
import { api, type Member } from '../api';

export default function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<Member>({ fName: '', lName: '', nickName: '', email: '', digitalID: '', company: '' });
  const [phoneInput, setPhoneInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    memberId: number | null;
    memberName: string;
    hasReservations: boolean;
    reservationCount: number;
  }>({
    isOpen: false,
    memberId: null,
    memberName: '',
    hasReservations: false,
    reservationCount: 0,
  });

  const fetchMembers = async () => {
    try {
      const data = await api.members.getAll();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fName?.trim()) {
      newErrors.fName = 'First Name is required';
    }
    if (!formData.lName?.trim()) {
      newErrors.lName = 'Last Name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    try {
      const payload = { 
        ...formData, 
        phoneNumbers: phoneInput.split(',').map(p => p.trim()).filter(p => p) 
      };
      await api.members.add(payload);
      setFormData({ fName: '', lName: '', nickName: '', email: '', digitalID: '', company: '' });
      setPhoneInput('');
      setErrors({});
      fetchMembers();
    } catch (err) {
      console.error('Error adding member:', err);
      setErrors({ submit: 'Failed to add member' });
    }
  };

  // Check if member has reservations
  const checkReservations = async (memberId: number, memberName: string) => {
    try {
      // Fetch all reservations
      const reservations = await api.reservations.getAll();
      
      // Filter reservations for this member
      const memberReservations = reservations.filter(
        (res: any) => res.memberID === memberId
      );

      // Open delete modal with reservation info
      setDeleteModal({
        isOpen: true,
        memberId,
        memberName,
        hasReservations: memberReservations.length > 0,
        reservationCount: memberReservations.length,
      });
    } catch (err) {
      console.error('Error checking reservations:', err);
      // If we can't fetch reservations, allow delete anyway
      setDeleteModal({
        isOpen: true,
        memberId,
        memberName,
        hasReservations: false,
        reservationCount: 0,
      });
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteModal.memberId === null) return;

    try {
      // If member has reservations, delete them first
      if (deleteModal.hasReservations) {
        const reservations = await api.reservations.getAll();
        const memberReservations = reservations.filter(
          (res: any) => res.memberID === deleteModal.memberId
        );

        // Delete all reservations for this member
        for (const reservation of memberReservations) {
          await api.reservations.delete(reservation.reservationID);
        }
      }

      // Then delete the member
      await api.members.delete(deleteModal.memberId);
      
      // Close modal and refresh
      setDeleteModal({
        isOpen: false,
        memberId: null,
        memberName: '',
        hasReservations: false,
        reservationCount: 0,
      });
      
      fetchMembers();
    } catch (err) {
      console.error('Error deleting member:', err);
      alert('Failed to delete member');
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      memberId: null,
      memberName: '',
      hasReservations: false,
      reservationCount: 0,
    });
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Form Card */}
      <div className="glass p-6 md:p-10 rounded-2xl shadow-xl shadow-black/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 bg-primary h-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <h2 className="text-xl font-display font-bold text-text-main mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">＋</span>
          Add New Member
        </h2>

        {/* Display submit error if any */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium animate-shake">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* First Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">First Name</label>
            <input
              type="text"
              name="fName"
              placeholder="e.g. John"
              className={`w-full p-4 bg-surface-hover border rounded-xl focus:ring-2 outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30 ${
                errors.fName
                  ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
              value={formData.fName}
              onChange={handleInputChange}
            />
            {errors.fName && (
              <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.fName}</p>
            )}
          </div>

          {/* Last Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Last Name</label>
            <input
              type="text"
              name="lName"
              placeholder="e.g. Doe"
              className={`w-full p-4 bg-surface-hover border rounded-xl focus:ring-2 outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30 ${
                errors.lName
                  ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
              value={formData.lName}
              onChange={handleInputChange}
            />
            {errors.lName && (
              <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.lName}</p>
            )}
          </div>

          {/* Nick Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Nick Name</label>
            <input
              type="text"
              name="nickName"
              placeholder="Cool Alias"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={formData.nickName}
              onChange={handleInputChange}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className={`w-full p-4 bg-surface-hover border rounded-xl focus:ring-2 outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30 ${
                errors.email
                  ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.email}</p>
            )}
          </div>

          {/* Digital ID Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Digital ID</label>
            <input
              type="text"
              name="digitalID"
              placeholder="ID-12345"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30 font-mono"
              value={formData.digitalID}
              onChange={handleInputChange}
            />
          </div>

          {/* Company Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Company</label>
            <input
              type="text"
              name="company"
              placeholder="Tech Corp"
              className={`w-full p-4 bg-surface-hover border rounded-xl focus:ring-2 outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30 ${
                errors.company
                  ? 'border-red-500/50 bg-red-500/5 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
              value={formData.company}
              onChange={handleInputChange}
            />
            {errors.company && (
              <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors.company}</p>
            )}
          </div>

          {/* Phone Numbers Field */}
          <div className="md:col-span-2 lg:col-span-3 space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Phone Numbers (comma separated)</label>
            <input
              type="text"
              placeholder="0123456789, 0987654321"
              className="w-full p-4 bg-surface-hover border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main placeholder:text-text-muted/30"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-primary text-surface px-10 py-4 rounded-2xl font-display font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 w-full md:w-auto glitch-hover"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="glass rounded-2xl shadow-xl shadow-black/5 overflow-hidden border border-border">
        <div className="p-6 md:p-8 border-b border-border bg-surface-hover/50 flex justify-between items-center">
          <h2 className="font-display font-bold text-text-main text-lg">Member Registry</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
            {members.length} Total
          </span>
        </div>
        {loading ? (
          <div className="p-20 text-center text-text-muted font-medium animate-pulse">Scanning database...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-surface-hover text-text-muted text-xs uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 font-black">Full Name</th>
                <th className="px-8 py-5 font-black">Nickname</th>
                <th className="px-8 py-5 font-black">Digital ID</th>
                <th className="px-8 py-5 font-black">Contact</th>
                <th className="px-8 py-5 font-black">Company</th>
                <th className="px-8 py-5 font-black text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr key={member.memberID} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6 font-bold text-text-main">{member.fullName || `${member.fName} ${member.lName}`}</td>
                  <td className="px-8 py-6 text-text-muted font-medium">{member.nickName || <span className="opacity-20 italic">None</span>}</td>
                  <td className="px-8 py-6">
                    {member.digitalID ? (
                      <span className="font-mono text-[10px] text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 font-bold tracking-widest">
                        {member.digitalID}
                      </span>
                    ) : (
                      <span className="opacity-20 italic">-</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-text-main">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold">{member.email}</span>
                      {member.phoneNumbers && member.phoneNumbers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.phoneNumbers.map((p, idx) => (
                            <span key={idx} className="text-[10px] bg-border/50 px-1.5 py-0.5 rounded font-mono text-text-muted">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-text-muted font-medium">{member.company}</td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => checkReservations(member.memberID!, member.fullName || `${member.fName} ${member.lName}`)}
                      className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-text-muted italic opacity-50">
                    No registry data found. Initialize system by adding a member.
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
              Terminate Entry?
            </h3>

            {deleteModal.hasReservations ? (
              <div className="mb-8 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <p className="text-text-main mb-3 text-center">
                  <span className="font-black">{deleteModal.memberName}</span> has{' '}
                  <span className="text-red-500 font-black">{deleteModal.reservationCount}</span>{' '}
                  active reservations.
                </p>
                <p className="text-sm text-text-muted text-center leading-relaxed">
                  Proceeding will result in a cascade deletion of all associated reservation data.
                </p>
              </div>
            ) : (
              <p className="text-text-muted mb-8 text-center leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-text-main">{deleteModal.memberName}</span> from the registry? This action is irreversible.
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