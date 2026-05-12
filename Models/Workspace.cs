using Microsoft.Data.SqlClient;

namespace WebApplication1.Models
{
    public class Workspace
    {
        public int WorkspaceID { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public int HubID { get; set; }

        // Navigation
        public string? HubName { get; set; }

        public static Workspace FromReader(SqlDataReader reader)
        {
            return new Workspace
            {
                WorkspaceID = reader.GetInt32(reader.GetOrdinal("WorkspaceID")),
                Type = reader.GetString(reader.GetOrdinal("Type")),
                Price = reader.GetDecimal(reader.GetOrdinal("Price")),
                Capacity = reader.GetInt32(reader.GetOrdinal("Capacity")),
                HubID = reader.GetInt32(reader.GetOrdinal("HubID")),
                HubName = reader.GetString(reader.GetOrdinal("HubName"))
            };
        }
    }
}
