using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IReservationService
    {
        Task<IEnumerable<Reservation>> GetReservationsAsync();
        Task AddReservationAsync(Reservation res);
        Task UpdateReservationAsync(Reservation res);
        Task DeleteReservationAsync(int id);
        
        Task<IEnumerable<ReservationEquipment>> GetReservationEquipmentAsync(int reservationId);
        Task AddReservationEquipmentAsync(ReservationEquipment re);
        Task UpdateReservationEquipmentAsync(ReservationEquipment re);
        Task DeleteReservationEquipmentAsync(int reservationId, int equipmentId);
    }
}
