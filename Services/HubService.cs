using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class HubService : IHubService
    {
        private readonly DbHelper _dbHelper;

        public HubService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<Hub>> GetHubsAsync()
        {
            var hubs = new List<Hub>();
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("SELECT * FROM Hub", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                hubs.Add(Hub.FromReader(reader));
            }
            return hubs;
        }

        public async Task AddHubAsync(Hub hub)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("DELETE FROM Hub WHERE HubID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }
    }
}
