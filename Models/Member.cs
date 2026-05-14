using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;

namespace WebApplication1.Models
{
    public class Member
    {
        public int MemberID { get; set; }
        public string FName { get; set; } = string.Empty;
        public string LName { get; set; } = string.Empty;
        public string? NickName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? DigitalID { get; set; }
        public string Company { get; set; } = string.Empty;

        // Helper (مش column في الداتا بيز)
        public string FullName => $"{FName} {LName}";

        // Navigation
        public List<string>? PhoneNumbers { get; set; }

        public static Member FromReader(SqlDataReader reader)
        {
            return new Member
            {
                MemberID = reader.GetInt32(reader.GetOrdinal("MemberID")),
                FName = reader.GetString(reader.GetOrdinal("FName")),
                LName = reader.GetString(reader.GetOrdinal("LName")),
                NickName = reader.IsDBNull(reader.GetOrdinal("NickName")) ? null : reader.GetString(reader.GetOrdinal("NickName")),
                Email = reader.GetString(reader.GetOrdinal("Email")),
                DigitalID = reader.IsDBNull(reader.GetOrdinal("DigitalID")) ? null : reader.GetString(reader.GetOrdinal("DigitalID")),
                Company = reader.GetString(reader.GetOrdinal("Company"))
            };
        }
    }
}
