import { useEffect, useState } from "react";
import { api } from "../api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

interface ChartPoint {
  label: string;
  value: number;
}

interface EquipmentHubUsage {
  hubName: string;
  equipmentItems: string[];
}

interface MemberHoursReport {
  memberID: number;
  fullName: string;
  email: string;
  company: string;
  totalReservedHours: number;
}

interface AdvancedDashboardInsights {
  mostPopularWorkspaceType: string;

  hubsWithoutReservationsLastMonth: string[];

  topEquipmentMember: string;

  membersWithoutReservationsLastMonth: string[];

  equipmentUsedPerHub: EquipmentHubUsage[];

  memberHoursReports: MemberHoursReport[];
}

interface DashboardReport {
  totalMembers: number;
  totalReservations: number;
  totalWorkspaces: number;

  averageReservationDuration: number;
  medianReservationDuration: number;
  standardDeviationDuration: number;

  reservationsPerMonth: ChartPoint[];
  workspaceUsage: ChartPoint[];

  insights: AdvancedDashboardInsights;
}

export default function ReportDashboard() {

  const [report, setReport] =
    useState<DashboardReport | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {

    try {

      setLoading(true);

      const data =
        await api.report.getDashboard(
          startDate,
          endDate
        );

      setReport(data);

    } catch (error) {

      console.error(
        "Failed to load report:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  if (loading) {

    return (
      <div className="text-center py-20 text-lg">
        Loading analytics...
      </div>
    );
  }

  if (!report) {

    return (
      <div className="text-red-500">
        Failed to load report.
      </div>
    );
  }

  return (

    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-main tracking-tight glitch-hover cursor-default">
            Performance <span className="text-primary">Analytics</span>
          </h1>
          <p className="text-text-muted font-medium mt-1">Real-time hub operations and member engagement.</p>
        </div>

        <button
          onClick={loadReport}
          className="bg-primary text-surface px-8 py-3 rounded-2xl font-display font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* FILTERS */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-border shadow-xl shadow-black/5 flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Range Start</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-4 bg-surface-hover border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main"
          />
        </div>

        <div className="flex-1 space-y-2 w-full">
          <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Range End</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-4 bg-surface-hover border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text-main"
          />
        </div>

        <button
          onClick={loadReport}
          className="bg-text-main text-surface px-8 py-4 rounded-2xl font-display font-bold hover:bg-primary transition-all w-full md:w-auto"
        >
          Apply Filter
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-3xl border border-border shadow-xl shadow-black/5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Total Members</p>
          <h2 className="text-5xl font-display font-black text-text-main group-hover:text-primary transition-colors">
            {report.totalMembers}
          </h2>
        </div>

        <div className="glass p-8 rounded-3xl border border-border shadow-xl shadow-black/5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Reservations</p>
          <h2 className="text-5xl font-display font-black text-text-main group-hover:text-accent transition-colors">
            {report.totalReservations}
          </h2>
        </div>

        <div className="glass p-8 rounded-3xl border border-border shadow-xl shadow-black/5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Workspaces</p>
          <h2 className="text-5xl font-display font-black text-text-main group-hover:text-primary transition-colors">
            {report.totalWorkspaces}
          </h2>
        </div>
      </div>

      {/* STATISTICS & ADVANCED INSIGHTS */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-border shadow-2xl shadow-black/5">
        <h2 className="text-2xl font-display font-black text-text-main mb-10 flex items-center gap-3">
          <span className="w-2 h-8 bg-accent rounded-full" />
          Operational Efficiency
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-surface-hover/50 rounded-2xl border border-border/50">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Mean Duration</p>
            <p className="text-3xl font-display font-bold text-text-main">{report.averageReservationDuration.toFixed(2)}<span className="text-sm font-medium text-text-muted ml-2">hrs</span></p>
          </div>
          <div className="p-6 bg-surface-hover/50 rounded-2xl border border-border/50">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Median Duration</p>
            <p className="text-3xl font-display font-bold text-text-main">{report.medianReservationDuration.toFixed(2)}<span className="text-sm font-medium text-text-muted ml-2">hrs</span></p>
          </div>
          <div className="p-6 bg-surface-hover/50 rounded-2xl border border-border/50">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Duration StdDev</p>
            <p className="text-3xl font-display font-bold text-text-main">{report.standardDeviationDuration.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
            </div>
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Most Popular Workspace</h3>
            <p className="text-2xl font-display font-bold text-text-main uppercase tracking-tight">
              {report.insights?.mostPopularWorkspaceType}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-accent/5 border border-accent/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
            </div>
            <h3 className="text-xs font-black text-accent uppercase tracking-[0.2em] mb-4">Top Equipment Member</h3>
            <p className="text-2xl font-display font-bold text-text-main uppercase tracking-tight">
              {report.insights?.topEquipmentMember}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surface-hover/50 border border-border relative">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6">Inactive Hubs (Last Month)</h3>
            <ul className="space-y-3">
              {report.insights?.hubsWithoutReservationsLastMonth?.map((hub, index) => (
                <li key={index} className="flex items-center gap-3 text-text-main font-bold">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {hub}
                </li>
              ))}
              {(!report.insights?.hubsWithoutReservationsLastMonth || report.insights.hubsWithoutReservationsLastMonth.length === 0) && (
                <li className="text-text-muted italic opacity-50 text-sm">All hubs active.</li>
              )}
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-surface-hover/50 border border-border relative">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6">Inactive Members (Last Month)</h3>
            <ul className="space-y-3">
              {report.insights?.membersWithoutReservationsLastMonth?.map((member, index) => (
                <li key={index} className="flex items-center gap-3 text-text-main font-bold">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  {member}
                </li>
              ))}
              {(!report.insights?.membersWithoutReservationsLastMonth || report.insights.membersWithoutReservationsLastMonth.length === 0) && (
                <li className="text-text-muted italic opacity-50 text-sm">All members active.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* EQUIPMENT PER HUB */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-border shadow-2xl shadow-black/5">
        <h2 className="text-2xl font-display font-black text-text-main mb-10 flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full" />
          Asset Distribution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {report.insights?.equipmentUsedPerHub?.map((hub, index) => (
            <div key={index} className="p-6 rounded-3xl bg-surface-hover/30 border border-border/50 group hover:border-primary/30 transition-all">
              <h3 className="font-display font-black text-text-main text-lg mb-4 flex items-center justify-between">
                {hub.hubName}
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {hub.equipmentItems.length} Items
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {hub.equipmentItems.map((item, idx) => (
                  <span key={idx} className="text-[10px] font-black text-text-muted bg-border/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESERVATIONS PER MONTH */}
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-border shadow-2xl shadow-black/5">
        <h2 className="text-2xl font-display font-black text-text-main mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full" />
          Growth Trajectory
        </h2>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.reservationsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800}}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800}}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                  padding: '16px'
                }}
                itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
              />
              <Line
                type="stepAfter"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={5}
                dot={{ fill: 'var(--primary)', strokeWidth: 3, r: 5, stroke: 'var(--surface)' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={2500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WORKSPACE ANALYTICS (Bar & Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-border shadow-2xl">
          <h2 className="text-xl font-display font-black text-text-main mb-8 uppercase tracking-widest">Workspace Utilization</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.workspaceUsage}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.2} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800}} />
                <Tooltip cursor={{fill: 'var(--primary)', opacity: 0.05}} contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {report.workspaceUsage.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? 'var(--primary)' : 'var(--accent)'} 
                      fillOpacity={0.6 + (index * 0.1)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-border shadow-2xl">
          <h2 className="text-xl font-display font-black text-text-main mb-8 uppercase tracking-widest">Capacity Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.workspaceUsage}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  stroke="none"
                >
                  {report.workspaceUsage.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? 'var(--primary)' : 'var(--accent)'} 
                      fillOpacity={0.5 + (index * 0.1)}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MEMBER HOURS TABLE */}
      <div className="glass rounded-[2.5rem] border border-border shadow-2xl shadow-black/5 overflow-hidden">
        <div className="p-8 border-b border-border bg-surface-hover/50">
          <h2 className="text-xl font-display font-black text-text-main uppercase tracking-widest">Member Contribution Registry</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-hover text-text-muted text-[10px] uppercase tracking-[0.3em]">
              <tr>
                <th className="px-8 py-5 font-black">Entity ID</th>
                <th className="px-8 py-5 font-black">Operative Name</th>
                <th className="px-8 py-5 font-black">Contact Vector</th>
                <th className="px-8 py-5 font-black text-right">Operational Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {report.insights?.memberHoursReports?.map((member) => (
                <tr key={member.memberID} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6 font-mono text-xs text-text-muted">#{member.memberID.toString().padStart(4, '0')}</td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-text-main uppercase tracking-tight">{member.fullName}</div>
                    <div className="text-[10px] text-primary font-black uppercase opacity-60">{member.company}</div>
                  </td>
                  <td className="px-8 py-6 text-xs text-text-muted">{member.email}</td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-lg font-display font-black text-text-main">{member.totalReservedHours}</span>
                    <span className="ml-2 text-[10px] font-black text-text-muted uppercase">Hrs</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}