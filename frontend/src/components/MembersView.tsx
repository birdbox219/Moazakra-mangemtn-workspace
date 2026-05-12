import { useEffect, useState } from 'react';
import { api, type Member } from '../api';

export default function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<Member>({ fName: '', lName: '', email: '', company: '' });
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

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
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
    await api.members.add(formData);
    setFormData({ fName: '', lName: '', email: '', company: '' });
    fetchMembers();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    try {
      await api.members.add(formData);
      setFormData({ name: '', email: '', company: '' });
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Form Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Add New Member</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <input
            type="text"
            placeholder="First Name"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.fName}
            onChange={(e) => setFormData({ ...formData, fName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.lName}
            onChange={(e) => setFormData({ ...formData, lName: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="flex gap-4">

        {/* Display submit error if any */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Name Field */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={`w-full p-3 border rounded-xl focus:ring-2 outline-none transition-all ${
                errors.name
                  ? 'border-red-500 bg-red-50 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-indigo-500'
              }`}
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full p-3 border rounded-xl focus:ring-2 outline-none transition-all ${
                errors.email
                  ? 'border-red-500 bg-red-50 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-indigo-500'
              }`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Company & Submit */}
          <div className="flex gap-4 flex-col md:flex-row md:col-span-1">
            <div className="flex-1">
              <input
                type="text"
                name="company"
                placeholder="Company"
                className={`w-full p-3 border rounded-xl focus:ring-2 outline-none transition-all ${
                  errors.company
                    ? 'border-red-500 bg-red-50 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-indigo-500'
                }`}
                value={formData.company}
                onChange={handleInputChange}
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1 font-medium">{errors.company}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 h-fit"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="font-bold text-gray-700">Member List</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading members...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-semibold">Name</th>
                <th className="px-8 py-4 font-semibold">Email</th>
                <th className="px-8 py-4 font-semibold">Company</th>
                <th className="px-8 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.memberID} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-4 font-medium text-gray-900">{member.fullName || `${member.fName} ${member.lName}`}</td>
                  <td className="px-8 py-4 text-gray-600">{member.email}</td>
                  <td className="px-8 py-4 text-gray-600">{member.company}</td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => checkReservations(member.memberID!, member.name)}
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic">
                    No members found. Add your first member above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Delete
            </h3>

            {deleteModal.hasReservations ? (
              <>
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">{deleteModal.memberName}</span> has{' '}
                    <span className="font-bold text-yellow-600">{deleteModal.reservationCount}</span>{' '}
                    active reservation{deleteModal.reservationCount !== 1 ? 's' : ''}.
                  </p>
                  <p className="text-sm text-gray-600">
                    If you delete this member, all associated reservations will also be deleted.
                  </p>
                </div>
                <p className="text-gray-700 font-medium mb-6">
                  Are you sure you want to delete this member and all their reservations?
                </p>
              </>
            ) : (
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteModal.memberName}</span>?
              </p>
            )}

            <div className="flex gap-4 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}