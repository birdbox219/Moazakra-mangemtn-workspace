using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class ChartPoint
    {
        public string Label { get; set; } = "";
        public double Value { get; set; }
    }

    public class DashboardReport
    {
        public int TotalMembers { get; set; }
        public int TotalReservations { get; set; }
        public int TotalWorkspaces { get; set; }

        public double AverageReservationDuration { get; set; }
        public double MedianReservationDuration { get; set; }
        public double StandardDeviationDuration { get; set; }

        public List<ChartPoint> ReservationsPerMonth { get; set; } = new();
        public List<ChartPoint> WorkspaceUsage { get; set; } = new();
    }
}