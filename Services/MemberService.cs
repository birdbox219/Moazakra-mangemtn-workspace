using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class MemberService : IMemberService
    {
        private readonly DbHelper _dbHelper;

        public MemberService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<Member>> GetMembersAsync()
        {
            var members = new List<Member>();
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("SELECT * FROM Member", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var member = Member.FromReader(reader);
                member.PhoneNumbers = new List<string>();
                members.Add(member);
            }
            await reader.CloseAsync();

            using var phoneCommand = new SqlCommand("SELECT MemberID, PhoneNumber FROM MemberPhone", connection);
            using var phoneReader = await phoneCommand.ExecuteReaderAsync();
            while (await phoneReader.ReadAsync())
            {
                int mid = phoneReader.GetInt32(0);
                string p = phoneReader.GetString(1);
                var m = members.Find(x => x.MemberID == mid);
                if (m != null)
                {
                    m.PhoneNumbers!.Add(p);
                }
            }

            return members;
        }

        public async Task AddMemberAsync(Member member)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand(@"
                INSERT INTO Member (FName, LName, NickName, Email, DigitalID, Company)
                OUTPUT INSERTED.MemberID
                VALUES (@fname, @lname, @nickname, @email, @digitalid, @company)", connection);
            command.Parameters.AddWithValue("@fname", member.FName);
            command.Parameters.AddWithValue("@lname", member.LName);
            command.Parameters.AddWithValue("@nickname", (object?)member.NickName ?? DBNull.Value);
            command.Parameters.AddWithValue("@email", member.Email);
            command.Parameters.AddWithValue("@digitalid", (object?)member.DigitalID ?? DBNull.Value);
            command.Parameters.AddWithValue("@company", member.Company);
            
            var result = await command.ExecuteScalarAsync();
            if (result != null)
            {
                int newId = Convert.ToInt32(result);
                if (member.PhoneNumbers != null && member.PhoneNumbers.Count > 0)
                {
                    foreach(var p in member.PhoneNumbers)
                    {
                        using var pc = new SqlCommand("INSERT INTO MemberPhone (MemberID, PhoneNumber) VALUES (@mid, @p)", connection);
                        pc.Parameters.AddWithValue("@mid", newId);
                        pc.Parameters.AddWithValue("@p", p);
                        await pc.ExecuteNonQueryAsync();
                    }
                }
            }
        }

        public async Task UpdateMemberAsync(Member member)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand(@"
                UPDATE Member
                SET FName = @fname,
                    LName = @lname,
                    NickName = @nickname,
                    Email = @email,
                    DigitalID = @digitalid,
                    Company = @company
                WHERE MemberID = @id", connection);
            command.Parameters.AddWithValue("@fname", member.FName);
            command.Parameters.AddWithValue("@lname", member.LName);
            command.Parameters.AddWithValue("@nickname", (object?)member.NickName ?? DBNull.Value);
            command.Parameters.AddWithValue("@email", member.Email);
            command.Parameters.AddWithValue("@digitalid", (object?)member.DigitalID ?? DBNull.Value);
            command.Parameters.AddWithValue("@company", member.Company);
            command.Parameters.AddWithValue("@id", member.MemberID);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteMemberAsync(int id)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("DELETE FROM Member WHERE MemberID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }

        public async Task<IEnumerable<MemberPhone>> GetMemberPhonesAsync(int memberId)
        {
            var phones = new List<MemberPhone>();
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand(@"
                SELECT MP.*, M.FName + ' ' + M.LName AS MemberName
                FROM MemberPhone MP
                JOIN Member M ON MP.MemberID = M.MemberID
                WHERE MP.MemberID = @id", connection);
            command.Parameters.AddWithValue("@id", memberId);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                phones.Add(MemberPhone.FromReader(reader));
            }
            return phones;
        }

        public async Task AddMemberPhoneAsync(MemberPhone phone)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand(@"
                INSERT INTO MemberPhone (MemberID, PhoneNumber)
                VALUES (@mid, @phone)", connection);
            command.Parameters.AddWithValue("@mid", phone.MemberID);
            command.Parameters.AddWithValue("@phone", phone.PhoneNumber);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteMemberPhoneAsync(int phoneId)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("DELETE FROM MemberPhone WHERE PhoneID = @id", connection);
            command.Parameters.AddWithValue("@id", phoneId);
            await command.ExecuteNonQueryAsync();
        }
    }
}
