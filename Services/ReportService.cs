using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using MathNet.Numerics.Statistics;
using System.Data.SqlClient;
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
            report.Insights = new AdvancedDashboardInsights();
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

            string popularWorkspaceSql = @"
            SELECT TOP 1
                W.Type,
                COUNT(*) AS TotalReservations
            FROM Reservation R
            JOIN Workspace W
                ON R.WorkspaceID = W.WorkspaceID
            GROUP BY W.Type
            ORDER BY COUNT(*) DESC
            ";

            using (var cmd = new SqlCommand(popularWorkspaceSql, conn))
            {
                var result = await cmd.ExecuteScalarAsync();

                report.Insights.MostPopularWorkspaceType =
                    result?.ToString() ?? "No Data";
            }

            report.Insights.HubsWithoutReservationsLastMonth = new List<string>();

            string noReservationsSql = @"
            SELECT H.Name
            FROM Hub H
            WHERE H.HubID NOT IN
            (
                SELECT DISTINCT W.HubID
                FROM Reservation R
                JOIN Workspace W
                    ON R.WorkspaceID = W.WorkspaceID
                WHERE R.StartDate >= DATEADD(MONTH, -1, GETDATE())
            )
            ";

            using (var cmd = new SqlCommand(noReservationsSql, conn))
            using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    report.Insights.HubsWithoutReservationsLastMonth
                        .Add(reader.GetString(0));
                }
            }

            string topEquipmentMemberSql = @"
            SELECT TOP 1
                CONCAT(M.FName, ' ', M.LName) AS FullName,
                COUNT(DISTINCT RE.EquipmentID) AS EquipmentVariety
            FROM ReservationEquipment RE
            JOIN Reservation R
                ON RE.ReservationID = R.ReservationID
            JOIN Member M
                ON R.MemberID = M.MemberID
            WHERE R.StartDate >= DATEADD(MONTH, -1, GETDATE())
            GROUP BY M.FName, M.LName
            ORDER BY COUNT(DISTINCT RE.EquipmentID) DESC
            ";

            using (var cmd = new SqlCommand(topEquipmentMemberSql, conn))
            {
                var result = await cmd.ExecuteScalarAsync();

                report.Insights.TopEquipmentMember =
                    result?.ToString() ?? "No Data";
            }

            report.Insights.MembersWithoutReservationsLastMonth = new List<string>();
            string inactiveMembersSql = @"
            SELECT CONCAT(M.FName, ' ', M.LName)
            FROM Member M
            WHERE M.MemberID NOT IN
            (
                SELECT DISTINCT MemberID
                FROM Reservation
                WHERE StartDate >= DATEADD(MONTH, -1, GETDATE())
            )
            ";

            using (var cmd = new SqlCommand(inactiveMembersSql, conn))
            using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    report.Insights.MembersWithoutReservationsLastMonth
                        .Add(reader.GetString(0));
                }
            }



            report.Insights.EquipmentUsedPerHub =new List<EquipmentHubUsage>();

            string equipmentPerHubSql = @"
            SELECT
                H.Name AS HubName,
                E.Name AS EquipmentName
            FROM ReservationEquipment RE
            JOIN Equipment E
                ON RE.EquipmentID = E.EquipmentID
            JOIN Reservation R
                ON RE.ReservationID = R.ReservationID
            JOIN Workspace W
                ON R.WorkspaceID = W.WorkspaceID
            JOIN Hub H
                ON W.HubID = H.HubID
            WHERE R.StartDate >= DATEADD(MONTH, -1, GETDATE())
            ORDER BY H.Name
            ";

            var hubDictionary = new Dictionary<string, List<string>>();

            using (var cmd = new SqlCommand(equipmentPerHubSql, conn))
            using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    string hubName = reader.GetString(0);
                    string equipmentName = reader.GetString(1);

                    if (!hubDictionary.ContainsKey(hubName))
                    {
                        hubDictionary[hubName] = new List<string>();
                    }

                    if (!hubDictionary[hubName].Contains(equipmentName))
                    {
                        hubDictionary[hubName].Add(equipmentName);
                    }
                }
            }

            foreach (var item in hubDictionary)
            {
                report.Insights.EquipmentUsedPerHub.Add(
                    new EquipmentHubUsage
                    {
                        HubName = item.Key,
                        EquipmentItems = item.Value
                    }
                );
            }

            report.Insights.MemberHoursReports =
                new List<MemberHoursReport>();

            string memberHoursSql = @"
            SELECT
                M.MemberID,
                CONCAT(M.FName, ' ', M.LName) AS FullName,
                M.Email,
                M.Company,
                ISNULL(SUM(DATEDIFF(HOUR, R.StartDate, R.EndDate)), 0)
                    AS TotalHours
            FROM Member M
            LEFT JOIN Reservation R
                ON M.MemberID = R.MemberID
            GROUP BY
                M.MemberID,
                M.FName,
                M.LName,
                M.Email,
                M.Company
            ORDER BY TotalHours DESC
            ";

            using (var cmd = new SqlCommand(memberHoursSql, conn))
            using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    report.Insights.MemberHoursReports.Add(
                        new MemberHoursReport
                        {
                            MemberID = reader.GetInt32(0),
                            FullName = reader.GetString(1),
                            Email = reader.IsDBNull(2)
                                ? ""
                                : reader.GetString(2),
                            Company = reader.IsDBNull(3)
                                ? ""
                                : reader.GetString(3),
                            TotalReservedHours = Convert.ToDouble(reader[4])
                        }
                    );
                }
            }



            return report;
        }
    }
}
