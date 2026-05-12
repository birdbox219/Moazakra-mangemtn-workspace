using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class WorkspaceService : IWorkspaceService
    {
        private readonly DbHelper _dbHelper;

        public WorkspaceService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<Workspace>> GetWorkspacesAsync()
        {
            var workspaces = new List<Workspace>();
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand(@"
                SELECT W.*, H.Name AS HubName
                FROM Workspace W
                JOIN Hub H ON W.HubID = H.HubID", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                workspaces.Add(Workspace.FromReader(reader));
            }
            return workspaces;
        }

        public async Task AddWorkspaceAsync(Workspace ws)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("DELETE FROM Workspace WHERE WorkspaceID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }
    }
}
