using Microsoft.Data.SqlClient;

namespace WebApplication1.Models
{
    public class MemberPhone
    {
        public int PhoneID { get; set; }
        public int MemberID { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;

        // Navigation
        public string? MemberName { get; set; }

        public static MemberPhone FromReader(SqlDataReader reader)
        {
            return new MemberPhone
            {
                PhoneID = reader.GetInt32(reader.GetOrdinal("PhoneID")),
                MemberID = reader.GetInt32(reader.GetOrdinal("MemberID")),
                PhoneNumber = reader.GetString(reader.GetOrdinal("PhoneNumber")),
                MemberName = reader.GetString(reader.GetOrdinal("MemberName"))
            };
        }
    }
}
