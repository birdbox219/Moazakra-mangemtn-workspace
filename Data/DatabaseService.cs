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
                    Name = reader.GetString("Name"),
                    Email = reader.GetString("Email"),
                    Company = reader.GetString("Company")
                });
            }
            return members;
        }

        public async Task AddMemberAsync(Member member)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("INSERT INTO Member (Name, Email, Company) VALUES (@name, @email, @company)", connection);
            command.Parameters.AddWithValue("@name", member.Name);
            command.Parameters.AddWithValue("@email", member.Email);
            command.Parameters.AddWithValue("@company", member.Company);
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
            using var command = new SqlCommand("SELECT * FROM Workspace", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                workspaces.Add(new Workspace
                {
                    WorkspaceID = reader.GetInt32("WorkspaceID"),
                    Type = reader.GetString("Type"),
                    Price = reader.GetDecimal("Price"),
                    Capacity = reader.GetInt32("Capacity"),
                    HubID = reader.GetInt32("HubID")
                });
            }
            return workspaces;
        }

        public async Task AddWorkspaceAsync(Workspace ws)
        {
            using var connection = await GetConnectionAsync();
            using var command = new SqlCommand("INSERT INTO Workspace (Type, Price, Capacity, HubID) VALUES (@type, @price, @cap, @hub)", connection);
            command.Parameters.AddWithValue("@type", ws.Type);
            command.Parameters.AddWithValue("@price", ws.Price);
            command.Parameters.AddWithValue("@cap", ws.Capacity);
            command.Parameters.AddWithValue("@hub", ws.HubID);
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
                SELECT R.*, M.Name as MemberName, W.Type as WorkspaceType 
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
            using var command = new SqlCommand("INSERT INTO Reservation (MemberID, WorkspaceID, StartDate, EndDate, Status) VALUES (@m, @w, @s, @e, @st)", connection);
            command.Parameters.AddWithValue("@m", res.MemberID);
            command.Parameters.AddWithValue("@w", res.WorkspaceID);
            command.Parameters.AddWithValue("@s", res.StartDate);
            command.Parameters.AddWithValue("@e", res.EndDate);
            command.Parameters.AddWithValue("@st", res.Status);
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
            using var command = new SqlCommand("INSERT INTO Equipment (Name, Type) VALUES (@n, @t)", connection);
            command.Parameters.AddWithValue("@n", eq.Name);
            command.Parameters.AddWithValue("@t", eq.Type);
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
            using var command = new SqlCommand("SELECT HubID, Name FROM Hub", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                hubs.Add(new Hub
                {
                    HubID = reader.GetInt32("HubID"),
                    Name = reader.GetString("Name")
                });
            }
            return hubs;
        }
        #endregion
    }
}
