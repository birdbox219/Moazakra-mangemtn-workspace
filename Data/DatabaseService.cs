using Microsoft.Data.SqlClient;
using System.Data;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        private async Task<SqlConnection> GetConnectionAsync()
        {
            var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            return connection;
        }

        #region Members
        public async Task<IEnumerable<Member>> GetMembersAsync()
        {
            var members = new List<Member>();
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("SELECT * FROM Member", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                members.Add(new Member
                {
                    MemberID = reader.GetInt32("MemberID"),
                    FName = reader.GetString("FName"),
                    LName = reader.GetString("LName"),
                    NickName = reader.IsDBNull(reader.GetOrdinal("NickName"))  ? null : reader.GetString("NickName"),
                    Email = reader.GetString("Email"),
                    DigitalID = reader.IsDBNull(reader.GetOrdinal("DigitalID")) ? null : reader.GetString("DigitalID"),
                    Company = reader.GetString("Company")
                });
            }
            return members;
        }

        public async Task AddMemberAsync(Member member)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                INSERT INTO Member (FName, LName, NickName, Email, DigitalID, Company)
                VALUES (@fname, @lname, @nickname, @email, @digitalid, @company)", connection);
            command.Parameters.AddWithValue("@fname", member.FName);
            command.Parameters.AddWithValue("@lname", member.LName);
            command.Parameters.AddWithValue("@nickname", (object?)member.NickName  ?? DBNull.Value);
            command.Parameters.AddWithValue("@email", member.Email);
            command.Parameters.AddWithValue("@digitalid", (object?)member.DigitalID ?? DBNull.Value);
            command.Parameters.AddWithValue("@company", member.Company);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateMemberAsync(Member member)
        {
            using var connection = await GetConnectionAsync();
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
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("DELETE FROM Member WHERE MemberID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }
        #endregion

        #region Workspaces
        public async Task<IEnumerable<Workspace>> GetWorkspacesAsync()
        {
            var workspaces = new List<Workspace>();
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                SELECT W.*, H.Name AS HubName
                FROM Workspace W
                JOIN Hub H ON W.HubID = H.HubID", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                workspaces.Add(new Workspace
                {
                    WorkspaceID = reader.GetInt32("WorkspaceID"),
                    Type = reader.GetString("Type"),
                    Price = reader.GetDecimal("Price"),
                    Capacity = reader.GetInt32("Capacity"),
                    HubID = reader.GetInt32("HubID"),
                    HubName = reader.GetString("HubName")
                });
            }
            return workspaces;
        }

        public async Task AddWorkspaceAsync(Workspace ws)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                INSERT INTO Workspace (Type, Price, Capacity, HubID)
                VALUES (@type, @price, @cap, @hub)", connection);
            command.Parameters.AddWithValue("@type", ws.Type);
            command.Parameters.AddWithValue("@price", ws.Price);
            command.Parameters.AddWithValue("@cap", ws.Capacity);
            command.Parameters.AddWithValue("@hub", ws.HubID);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateWorkspaceAsync(Workspace ws)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                UPDATE Workspace
                SET Type = @type,
                    Price = @price,
                    Capacity = @cap,
                    HubID = @hub
                WHERE WorkspaceID = @id", connection);
            command.Parameters.AddWithValue("@type", ws.Type);
            command.Parameters.AddWithValue("@price", ws.Price);
            command.Parameters.AddWithValue("@cap", ws.Capacity);
            command.Parameters.AddWithValue("@hub", ws.HubID);
            command.Parameters.AddWithValue("@id", ws.WorkspaceID);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteWorkspaceAsync(int id)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("DELETE FROM Workspace WHERE WorkspaceID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }
        #endregion

        #region Reservations
        public async Task<IEnumerable<Reservation>> GetReservationsAsync()
        {
            var reservations = new List<Reservation>();
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                SELECT R.*,
                       M.FName + ' ' + M.LName AS MemberName,
                       W.Type                  AS WorkspaceType
                FROM Reservation R
                JOIN Member M ON R.MemberID = M.MemberID
                JOIN Workspace W ON R.WorkspaceID = W.WorkspaceID", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                reservations.Add(new Reservation
                {
                    ReservationID = reader.GetInt32("ReservationID"),
                    MemberID = reader.GetInt32("MemberID"),
                    WorkspaceID = reader.GetInt32("WorkspaceID"),
                    StartDate = reader.GetDateTime("StartDate"),
                    EndDate = reader.GetDateTime("EndDate"),
                    Status = reader.GetString("Status"),
                    MemberName = reader.GetString("MemberName"),
                    WorkspaceType = reader.GetString("WorkspaceType")
                });
            }
            return reservations;
        }

        public async Task AddReservationAsync(Reservation res)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                INSERT INTO Reservation (MemberID, WorkspaceID, StartDate, EndDate, Status)
                VALUES (@m, @w, @s, @e, @st)", connection);
            command.Parameters.AddWithValue("@m", res.MemberID);
            command.Parameters.AddWithValue("@w", res.WorkspaceID);
            command.Parameters.AddWithValue("@s", res.StartDate);
            command.Parameters.AddWithValue("@e", res.EndDate);
            command.Parameters.AddWithValue("@st", res.Status);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateReservationAsync(Reservation res)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                UPDATE Reservation
                SET MemberID = @m,
                    WorkspaceID = @w,
                    StartDate = @s,
                    EndDate = @e,
                    Status = @st
                WHERE ReservationID = @id", connection);
            command.Parameters.AddWithValue("@m", res.MemberID);
            command.Parameters.AddWithValue("@w", res.WorkspaceID);
            command.Parameters.AddWithValue("@s", res.StartDate);
            command.Parameters.AddWithValue("@e", res.EndDate);
            command.Parameters.AddWithValue("@st", res.Status);
            command.Parameters.AddWithValue("@id", res.ReservationID);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteReservationAsync(int id)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("DELETE FROM Reservation WHERE ReservationID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }
        #endregion

        #region Equipment
        public async Task<IEnumerable<Equipment>> GetEquipmentAsync()
        {
            var equipment = new List<Equipment>();
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("SELECT * FROM Equipment", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                equipment.Add(new Equipment
                {
                    EquipmentID = reader.GetInt32("EquipmentID"),
                    Name = reader.GetString("Name"),
                    Type = reader.GetString("Type")
                });
            }
            return equipment;
        }

        public async Task AddEquipmentAsync(Equipment eq)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                INSERT INTO Equipment (Name, Type)
                VALUES (@name, @type)", connection);
            command.Parameters.AddWithValue("@name", eq.Name);
            command.Parameters.AddWithValue("@type", eq.Type);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateEquipmentAsync(Equipment eq)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                UPDATE Equipment
                SET Name = @name,
                    Type = @type
                WHERE EquipmentID = @id", connection);
            command.Parameters.AddWithValue("@name", eq.Name);
            command.Parameters.AddWithValue("@type", eq.Type);
            command.Parameters.AddWithValue("@id", eq.EquipmentID);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteEquipmentAsync(int id)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("DELETE FROM Equipment WHERE EquipmentID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }
        #endregion

        #region Hubs
        public async Task<IEnumerable<Hub>> GetHubsAsync()
        {
            var hubs = new List<Hub>();
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("SELECT * FROM Hub", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                hubs.Add(new Hub
                {
                    HubID = reader.GetInt32("HubID"),
                    Name = reader.GetString("Name"),
                    Street = reader.IsDBNull(reader.GetOrdinal("Street")) ? null : reader.GetString("Street"),
                    City = reader.IsDBNull(reader.GetOrdinal("City")) ? null : reader.GetString("City"),
                    District = reader.IsDBNull(reader.GetOrdinal("District")) ? null : reader.GetString("District"),
                    Building = reader.IsDBNull(reader.GetOrdinal("Building")) ? null : reader.GetString("Building"),
                    Layout = reader.IsDBNull(reader.GetOrdinal("Layout")) ? null : reader.GetString("Layout")
                });
            }
            return hubs;
        }

        public async Task AddHubAsync(Hub hub)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                INSERT INTO Hub (Name, Street, City, District, Building, Layout)
                VALUES (@name, @street, @city, @district, @building, @layout)", connection);
            command.Parameters.AddWithValue("@name", hub.Name);
            command.Parameters.AddWithValue("@street", (object?)hub.Street ?? DBNull.Value);
            command.Parameters.AddWithValue("@city", (object?)hub.City ?? DBNull.Value);
            command.Parameters.AddWithValue("@district", (object?)hub.District ?? DBNull.Value);
            command.Parameters.AddWithValue("@building", (object?)hub.Building ?? DBNull.Value);
            command.Parameters.AddWithValue("@layout", (object?)hub.Layout ?? DBNull.Value);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateHubAsync(Hub hub)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                UPDATE Hub
                SET Name = @name,
                    Street = @street,
                    City = @city,
                    District = @district,
                    Building = @building,
                    Layout = @layout
                WHERE HubID = @id", connection);
            command.Parameters.AddWithValue("@name", hub.Name);
            command.Parameters.AddWithValue("@street", (object?)hub.Street ?? DBNull.Value);
            command.Parameters.AddWithValue("@city", (object?)hub.City ?? DBNull.Value);
            command.Parameters.AddWithValue("@district", (object?)hub.District ?? DBNull.Value);
            command.Parameters.AddWithValue("@building", (object?)hub.Building ?? DBNull.Value);
            command.Parameters.AddWithValue("@layout", (object?)hub.Layout ?? DBNull.Value);
            command.Parameters.AddWithValue("@id", hub.HubID);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteHubAsync(int id)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("DELETE FROM Hub WHERE HubID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }
        #endregion
        
        #region MemberPhone
        public async Task<IEnumerable<MemberPhone>> GetMemberPhonesAsync(int memberId)
        {
            var phones = new List<MemberPhone>();
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                SELECT MP.*, M.FName + ' ' + M.LName AS MemberName
                FROM MemberPhone MP
                JOIN Member M ON MP.MemberID = M.MemberID
                WHERE MP.MemberID = @id", connection);
            command.Parameters.AddWithValue("@id", memberId);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                phones.Add(new MemberPhone
                {
                    PhoneID = reader.GetInt32("PhoneID"),
                    MemberID = reader.GetInt32("MemberID"),
                    PhoneNumber = reader.GetString("PhoneNumber"),
                    MemberName = reader.GetString("MemberName")
                });
            }
            return phones;
        }

        public async Task AddMemberPhoneAsync(MemberPhone phone)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                INSERT INTO MemberPhone (MemberID, PhoneNumber)
                VALUES (@mid, @phone)", connection);
            command.Parameters.AddWithValue("@mid", phone.MemberID);
            command.Parameters.AddWithValue("@phone", phone.PhoneNumber);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteMemberPhoneAsync(int phoneId)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("DELETE FROM MemberPhone WHERE PhoneID = @id", connection);
            command.Parameters.AddWithValue("@id", phoneId);
            await command.ExecuteNonQueryAsync();
        }
        #endregion

        #region ReservationEquipment
        public async Task<IEnumerable<ReservationEquipment>> GetReservationEquipmentAsync(int reservationId)
        {
            var list = new List<ReservationEquipment>();
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                SELECT RE.*,
                       E.Name AS EquipmentName,
                       E.Type AS EquipmentType,
                       M.FName + ' ' + M.LName AS MemberName,
                       W.Type AS WorkspaceType
                FROM ReservationEquipment RE
                JOIN Equipment E ON RE.EquipmentID = E.EquipmentID
                JOIN Reservation R ON RE.ReservationID = R.ReservationID
                JOIN Member M ON R.MemberID = M.MemberID
                JOIN Workspace W ON R.WorkspaceID = W.WorkspaceID
                WHERE RE.ReservationID = @id", connection);
            command.Parameters.AddWithValue("@id", reservationId);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new ReservationEquipment
                {
                    ReservationID = reader.GetInt32("ReservationID"),
                    EquipmentID = reader.GetInt32("EquipmentID"),
                    HoursUsed = reader.GetInt32("HoursUsed"),
                    EquipmentName = reader.GetString("EquipmentName"),
                    EquipmentType = reader.GetString("EquipmentType"),
                    MemberName = reader.GetString("MemberName"),
                    WorkspaceType = reader.GetString("WorkspaceType")
                });
            }
            return list;
        }

        public async Task AddReservationEquipmentAsync(ReservationEquipment re)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                INSERT INTO ReservationEquipment (ReservationID, EquipmentID, HoursUsed)
                VALUES (@rid, @eid, @hours)", connection);
            command.Parameters.AddWithValue("@rid", re.ReservationID);
            command.Parameters.AddWithValue("@eid",re.EquipmentID);
            command.Parameters.AddWithValue("@hours", re.HoursUsed);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateReservationEquipmentAsync(ReservationEquipment re)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                UPDATE ReservationEquipment
                SET HoursUsed = @hours
                WHERE ReservationID = @rid AND EquipmentID = @eid", connection);
            command.Parameters.AddWithValue("@hours", re.HoursUsed);
            command.Parameters.AddWithValue("@rid", re.ReservationID);
            command.Parameters.AddWithValue("@eid", re.EquipmentID);
            await command.ExecuteNonQueryAsync();
        }

        public async Task DeleteReservationEquipmentAsync(int reservationId, int equipmentId)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand(@"
                DELETE FROM ReservationEquipment
                WHERE ReservationID = @rid AND EquipmentID = @eid", connection);
            command.Parameters.AddWithValue("@rid", reservationId);
            command.Parameters.AddWithValue("@eid", equipmentId);
            await command.ExecuteNonQueryAsync();
        }
        #endregion
    }
}
