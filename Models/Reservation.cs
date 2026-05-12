using Microsoft.Data.SqlClient;
using System;

namespace WebApplication1.Models
{
    public class Reservation
    {
        public int ReservationID { get; set; }
        public int MemberID { get; set; }
        public int WorkspaceID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;

        // Navigation properties
        public string? MemberName { get; set; }
        public string? WorkspaceType { get; set; }

        public static Reservation FromReader(SqlDataReader reader)
        {
            return new Reservation
            {
                ReservationID = reader.GetInt32(reader.GetOrdinal("ReservationID")),
                MemberID = reader.GetInt32(reader.GetOrdinal("MemberID")),
                WorkspaceID = reader.GetInt32(reader.GetOrdinal("WorkspaceID")),
                StartDate = reader.GetDateTime(reader.GetOrdinal("StartDate")),
                EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                Status = reader.GetString(reader.GetOrdinal("Status")),
                MemberName = reader.GetString(reader.GetOrdinal("MemberName")),
                WorkspaceType = reader.GetString(reader.GetOrdinal("WorkspaceType"))
            };
        }
    }
}
