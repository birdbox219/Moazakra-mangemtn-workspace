import { useEffect, useState } from 'react';
import { api, type Member } from '../api';

export default function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<Member>({ fName: '', lName: '', email: '', company: '' });
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.members.add(formData);
    setFormData({ fName: '', lName: '', email: '', company: '' });
    fetchMembers();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await api.members.delete(id);
      fetchMembers();
    }
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
            <input
              type="text"
              placeholder="Company"
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
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
                      onClick={() => handleDelete(member.memberID!)}
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
    </div>
  );
}
