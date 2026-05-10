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

interface DashboardReport {
  totalMembers: number;
  totalReservations: number;
  totalWorkspaces: number;

  averageReservationDuration: number;
  medianReservationDuration: number;
  standardDeviationDuration: number;

  reservationsPerMonth: ChartPoint[];
  workspaceUsage: ChartPoint[];
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

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Analytics Dashboard
        </h1>

        <button
          onClick={loadReport}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      
      <div className="bg-white shadow rounded-xl p-4 flex gap-4 items-end">
        <div>
          <label className="block mb-1 text-sm">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            className="border rounded px-3 py-2"
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
              setEndDate(
                e.target.value
              )
            }
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={loadReport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Apply Filter
        </button>
      </div>

      
      <div className="grid grid-cols-3 gap-4">
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

      
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Statistics
        </h2>

        <p>
          Average:
          {" "}
          {report.averageReservationDuration.toFixed(2)}
        </p>

        <p>
          Median:
          {" "}
          {report.medianReservationDuration.toFixed(2)}
        </p>

        <p>
          Std Dev:
          {" "}
          {report.standardDeviationDuration.toFixed(2)}
        </p>
      </div>

      
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Reservations Per Month
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
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

      
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Workspace Usage
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={report.workspaceUsage}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#10b981"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Workspace Distribution
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <PieChart>
            <Pie
              data={report.workspaceUsage}
              dataKey="value"
              nameKey="label"
              outerRadius={120}
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}