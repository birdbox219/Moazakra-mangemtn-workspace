using Microsoft.Data.SqlClient;

namespace WebApplication1.Models
{
    public class Equipment
    {
        public int EquipmentID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;

        public static Equipment FromReader(SqlDataReader reader)
        {
            return new Equipment
            {
                EquipmentID = reader.GetInt32(reader.GetOrdinal("EquipmentID")),
                Name = reader.GetString(reader.GetOrdinal("Name")),
                Type = reader.GetString(reader.GetOrdinal("Type"))
            };
        }
    }
}
