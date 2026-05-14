using Microsoft.Data.SqlClient;

namespace WebApplication1.Models
{
    public class ReservationEquipment
    {
        public int ReservationID { get; set; }
        public int EquipmentID { get; set; }
        public int HoursUsed { get; set; }

        // Navigation
        public string? EquipmentName { get; set; }
        public string? EquipmentType { get; set; }
        public string? MemberName { get; set; }
        public string? WorkspaceType { get; set; }

        public static ReservationEquipment FromReader(SqlDataReader reader)
        {
            return new ReservationEquipment
            {
                ReservationID = reader.GetInt32(reader.GetOrdinal("ReservationID")),
                EquipmentID = reader.GetInt32(reader.GetOrdinal("EquipmentID")),
                HoursUsed = reader.GetInt32(reader.GetOrdinal("HoursUsed")),
                EquipmentName = reader.GetString(reader.GetOrdinal("EquipmentName")),
                EquipmentType = reader.GetString(reader.GetOrdinal("EquipmentType")),
                MemberName = reader.GetString(reader.GetOrdinal("MemberName")),
                WorkspaceType = reader.GetString(reader.GetOrdinal("WorkspaceType"))
            };
        }
    }
}
