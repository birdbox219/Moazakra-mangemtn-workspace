using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using MathNet.Numerics.Statistics;

namespace WebApplication1.Services
{
    public class ReportService : IReportService
    {
        private readonly DbHelper _dbHelper;

        public ReportService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<DashboardReport> GetDashboardReportAsync(DateTime? startDate, DateTime? endDate)
        {
            var report = new DashboardReport();

            using var conn = _dbHelper.GetConnection();
            await conn.OpenAsync();

            string filter = "";

            if (startDate.HasValue && endDate.HasValue)
            {
                filter =
                    " WHERE StartDate >= @startDate " +
                    " AND EndDate <= @endDate ";
            }

            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Member", conn))
            {
                var result = await cmd.ExecuteScalarAsync();
                report.TotalMembers = result == DBNull.Value ? 0 : Convert.ToInt32(result);
            }

            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Reservation" + filter, conn))
            {
                if (startDate.HasValue) cmd.Parameters.AddWithValue("@startDate", startDate.Value);
                if (endDate.HasValue) cmd.Parameters.AddWithValue("@endDate", endDate.Value);
                var result = await cmd.ExecuteScalarAsync();
                report.TotalReservations = result == DBNull.Value ? 0 : Convert.ToInt32(result);
            }

            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM Workspace", conn))
            {
                var result = await cmd.ExecuteScalarAsync();
                report.TotalWorkspaces = result == DBNull.Value ? 0 : Convert.ToInt32(result);
            }

            var durations = new List<double>();

            using (var cmd = new SqlCommand("SELECT DATEDIFF(HOUR, StartDate, EndDate) FROM Reservation" + filter, conn))
            {
                if (startDate.HasValue) cmd.Parameters.AddWithValue("@startDate", startDate.Value);
                if (endDate.HasValue) cmd.Parameters.AddWithValue("@endDate", endDate.Value);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    if (!reader.IsDBNull(0))
                    {
                        durations.Add(Convert.ToDouble(reader[0]));
                    }
                }
            }

            if (durations.Count > 0)
            {
                report.AverageReservationDuration = durations.Mean();
                report.MedianReservationDuration = durations.Median();
                report.StandardDeviationDuration = durations.StandardDeviation();
            }

            using (var cmd = new SqlCommand(@"
                SELECT
                    DATENAME(MONTH, StartDate) AS Label,
                    COUNT(*) AS Value
                FROM Reservation
                " + filter + @"
                GROUP BY
                    DATENAME(MONTH, StartDate),
                    MONTH(StartDate)
                ORDER BY
                    MONTH(StartDate)
            ", conn))
            {
                if (startDate.HasValue) cmd.Parameters.AddWithValue("@startDate", startDate.Value);
                if (endDate.HasValue) cmd.Parameters.AddWithValue("@endDate", endDate.Value);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    report.ReservationsPerMonth.Add(new ChartPoint
                    {
                        Label = reader["Label"].ToString()!,
                        Value = Convert.ToDouble(reader["Value"])
                    });
                }
            }

            using (var cmd = new SqlCommand(@"
                SELECT
                    W.Type AS Label,
                    COUNT(*) AS Value
                FROM Reservation R
                JOIN Workspace W ON R.WorkspaceID = W.WorkspaceID
                " + filter + @"
                GROUP BY W.Type
            ", conn))
            {
                if (startDate.HasValue) cmd.Parameters.AddWithValue("@startDate", startDate.Value);
                if (endDate.HasValue) cmd.Parameters.AddWithValue("@endDate", endDate.Value);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    report.WorkspaceUsage.Add(new ChartPoint
                    {
                        Label = reader["Label"].ToString()!,
                        Value = Convert.ToDouble(reader["Value"])
                    });
                }
            }

            return report;
        }
    }
}
