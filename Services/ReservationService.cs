using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class ReservationService : IReservationService
    {
        private readonly DbHelper _dbHelper;

        public ReservationService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<Reservation>> GetReservationsAsync()
        {
            var reservations = new List<Reservation>();
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
                reservations.Add(Reservation.FromReader(reader));
            }
            return reservations;
        }

        public async Task AddReservationAsync(Reservation res)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand("DELETE FROM Reservation WHERE ReservationID = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            await command.ExecuteNonQueryAsync();
        }

        public async Task<IEnumerable<ReservationEquipment>> GetReservationEquipmentAsync(int reservationId)
        {
            var list = new List<ReservationEquipment>();
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
                list.Add(ReservationEquipment.FromReader(reader));
            }
            return list;
        }

        public async Task AddReservationEquipmentAsync(ReservationEquipment re)
        {
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
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
            using var connection = _dbHelper.GetConnection();
            await connection.OpenAsync();
            using var command = new SqlCommand(@"
                DELETE FROM ReservationEquipment
                WHERE ReservationID = @rid AND EquipmentID = @eid", connection);
            command.Parameters.AddWithValue("@rid", reservationId);
            command.Parameters.AddWithValue("@eid", equipmentId);
            await command.ExecuteNonQueryAsync();
        }
    }
}
