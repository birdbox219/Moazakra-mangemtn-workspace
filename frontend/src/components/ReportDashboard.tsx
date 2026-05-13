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

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Analytics Dashboard
        </h1>

        <button
          onClick={loadReport}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Refresh
        </button>

      </div>

      {/* FILTERS */}

      <div className="bg-white shadow rounded-xl p-4 flex gap-4 items-end">

        <div>

          <label className="block mb-1 text-sm">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            className="border rounded px-3 py-2 w-full"
          />

        </div>

        <div>

          <label className="block mb-1 text-sm">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
            className="border rounded px-3 py-2 w-full"
          />

        </div>

        <button
          onClick={loadReport}
          className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Apply Filter
        </button>

      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white shadow rounded-xl p-6">

          <p>Total Members</p>

          <h2 className="text-3xl font-bold">
            {report.totalMembers}
          </h2>

        </div>

        <div className="bg-white shadow rounded-xl p-6">

          <p>Total Reservations</p>

          <h2 className="text-3xl font-bold">
            {report.totalReservations}
          </h2>

        </div>

        <div className="bg-white shadow rounded-xl p-6">

          <p>Total Workspaces</p>

          <h2 className="text-3xl font-bold">
            {report.totalWorkspaces}
          </h2>

        </div>

      </div>

      {/* STATISTICS */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Statistics
        </h2>

        <div className="space-y-2">

          <p>
            mean of duration:
            {" "}
            {report.averageReservationDuration.toFixed(2)}
          </p>

          <p>
            median of duration:
            {" "}
            {report.medianReservationDuration.toFixed(2)}
          </p>

          <p>
            SD of duration:
            {" "}
            {report.standardDeviationDuration.toFixed(2)}
          </p>

        </div>

        {/* ADVANCED INSIGHTS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div className="border rounded-lg p-4 bg-gray-50">

            <h3 className="font-bold text-lg mb-2">
              Most Popular Workspace
            </h3>

            <p className="text-indigo-600 font-semibold">
              {report.insights?.mostPopularWorkspaceType}
            </p>

          </div>

          <div className="border rounded-lg p-4 bg-gray-50">

            <h3 className="font-bold text-lg mb-2">
              Top Equipment Member
            </h3>

            <p className="text-green-600 font-semibold">
              {report.insights?.topEquipmentMember}
            </p>

          </div>

          <div className="border rounded-lg p-4 bg-gray-50">

            <h3 className="font-bold text-lg mb-2">
              Hubs Without Reservations
            </h3>

            <ul className="list-disc pl-5 space-y-1">

              {report.insights
                ?.hubsWithoutReservationsLastMonth
                ?.map((hub, index) => (

                <li key={index}>
                  {hub}
                </li>

              ))}

            </ul>

          </div>

          <div className="border rounded-lg p-4 bg-gray-50">

            <h3 className="font-bold text-lg mb-2">
              Members Without Reservations
            </h3>

            <ul className="list-disc pl-5 space-y-1">

              {report.insights
                ?.membersWithoutReservationsLastMonth
                ?.map((member, index) => (

                <li key={index}>
                  {member}
                </li>

              ))}

            </ul>

          </div>

        </div>

      </div>

      {/* EQUIPMENT PER HUB */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-6">
          Equipment Used Per Hub
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {report.insights
            ?.equipmentUsedPerHub
            ?.map((hub, index) => (

            <div
              key={index}
              className="border rounded-xl p-4 bg-gray-50"
            >

              <h3 className="font-bold text-lg mb-3">
                {hub.hubName}
              </h3>

              <ul className="list-disc pl-5 space-y-1">

                {hub.equipmentItems.map(
                  (item, idx) => (

                  <li key={idx}>
                    {item}
                  </li>

                ))}

              </ul>

            </div>

          ))}

        </div>

      </div>

      {/* RESERVATIONS PER MONTH */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Reservations Per Month
        </h2>

        <ResponsiveContainer
          width="100%"
          height={250}
        >

          <LineChart
            data={report.reservationsPerMonth}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="label" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              dataKey="value"
              stroke="#4f46e5"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* WORKSPACE USAGE */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Workspace Usage
        </h2>

        <ResponsiveContainer
          width="100%"
          height={250}
        >

        <BarChart
          data={report.workspaceUsage}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar dataKey="value">

            {report.workspaceUsage.map(
              (_, index) => {

              const colors = [
                "#4f46e5",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#06b6d4",
                "#8b5cf6",
                "#ec4899",
                "#84cc16"
              ];

              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    colors[
                      index % colors.length
                    ]
                  }
                />
              );
            })}

          </Bar>

        </BarChart>

        </ResponsiveContainer>

      </div>

      {/* PIE CHART */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Workspace Distribution
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

          <Pie
            data={report.workspaceUsage}
            dataKey="value"
            nameKey="label"
            outerRadius={120}
            label
          >
            {report.workspaceUsage.map(
              (_, index) => {

              const colors = [
                "#4f46e5",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#06b6d4",
                "#8b5cf6",
                "#ec4899",
                "#84cc16"
              ];

              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    colors[
                      index % colors.length
                    ]
                  }
                />
              );
            })}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

        </ResponsiveContainer>

      </div>

      {/* MEMBER HOURS TABLE */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-6">
          Member Reservation Hours
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full border border-gray-300">

            <thead className="bg-gray-100">

              <tr>

                <th className="border p-3 text-left">
                  ID
                </th>

                <th className="border p-3 text-left">
                  Full Name
                </th>

                <th className="border p-3 text-left">
                  Email
                </th>

                <th className="border p-3 text-left">
                  Company
                </th>

                <th className="border p-3 text-left">
                  Total Hours
                </th>

              </tr>

            </thead>

            <tbody>

              {report.insights
                ?.memberHoursReports
                ?.map((member) => (

                <tr
                  key={member.memberID}
                  className="hover:bg-gray-50"
                >

                  <td className="border p-3">
                    {member.memberID}
                  </td>

                  <td className="border p-3">
                    {member.fullName}
                  </td>

                  <td className="border p-3">
                    {member.email}
                  </td>

                  <td className="border p-3">
                    {member.company}
                  </td>

                  <td className="border p-3 font-semibold">
                    {member.totalReservedHours}
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