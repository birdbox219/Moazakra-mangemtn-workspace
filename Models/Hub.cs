using Microsoft.Data.SqlClient;
using System;

namespace WebApplication1.Models
{
    public class Hub
    {
        public int HubID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Building { get; set; }
        public string? Layout { get; set; }

        public static Hub FromReader(SqlDataReader reader)
        {
            return new Hub
            {
                HubID = reader.GetInt32(reader.GetOrdinal("HubID")),
                Name = reader.GetString(reader.GetOrdinal("Name")),
                Street = reader.IsDBNull(reader.GetOrdinal("Street")) ? null : reader.GetString(reader.GetOrdinal("Street")),
                City = reader.IsDBNull(reader.GetOrdinal("City")) ? null : reader.GetString(reader.GetOrdinal("City")),
                District = reader.IsDBNull(reader.GetOrdinal("District")) ? null : reader.GetString(reader.GetOrdinal("District")),
                Building = reader.IsDBNull(reader.GetOrdinal("Building")) ? null : reader.GetString(reader.GetOrdinal("Building")),
                Layout = reader.IsDBNull(reader.GetOrdinal("Layout")) ? null : reader.GetString(reader.GetOrdinal("Layout"))
            };
        }
    }
}
