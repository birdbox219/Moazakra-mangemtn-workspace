using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class EquipmentService : IEquipmentService
    {
        private readonly DbHelper _dbHelper;

        public EquipmentService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<Equipment>> GetEquipmentAsync()
        {
            var equipment = new List<Equipment>();
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("SELECT * FROM Equipment", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                equipment.Add(Equipment.FromReader(reader));
            }
            return equipment;
        }

        public async Task AddEquipmentAsync(Equipment eq)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand(@"
                INSERT INTO Equipment (Name, Type)
                VALUES (@name, @type)", connection);
            command.Parameters.AddWithValue("@name", eq.Name);
            command.Parameters.AddWithValue("@type", eq.Type);
            await command.ExecuteNonQueryAsync();
        }

        public async Task UpdateEquipmentAsync(Equipment eq)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("DELETE FROM Equipment WHERE EquipmentID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }
    }
}
