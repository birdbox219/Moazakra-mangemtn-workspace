using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationsController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            var reservations = await _reservationService.GetReservationsAsync();
            return Ok(reservations);
        }

        [HttpPost]
        public async Task<IActionResult> AddReservation([FromBody] Reservation res)
        {
            await _reservationService.AddReservationAsync(res);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] Reservation res)
        {
            res.ReservationID = id;
            await _reservationService.UpdateReservationAsync(res);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            await _reservationService.DeleteReservationAsync(id);
            return Ok();
        }

        // Equipment per reservation
        [HttpGet("{id}/equipment")]
        public async Task<IActionResult> GetEquipment(int id)
        {
            var reservationEquipment = await _reservationService.GetReservationEquipmentAsync(id);
            return Ok(reservationEquipment);
        }

        [HttpPost("{id}/equipment")]
        public async Task<IActionResult> AddEquipment(int id, [FromBody] ReservationEquipment re)
        {
            re.ReservationID = id;
            await _reservationService.AddReservationEquipmentAsync(re);
            return Ok();
        }

        [HttpPut("{id}/equipment/{equipmentId}")]
        public async Task<IActionResult> UpdateEquipment(int id, int equipmentId, [FromBody] ReservationEquipment re)
        {
            re.ReservationID = id;
            re.EquipmentID = equipmentId;
            await _reservationService.UpdateReservationEquipmentAsync(re);
            return Ok();
        }

        [HttpDelete("{id}/equipment/{equipmentId}")]
        public async Task<IActionResult> DeleteEquipment(int id, int equipmentId)
        {
            await _reservationService.DeleteReservationEquipmentAsync(id, equipmentId);
            return Ok();
        }
    }
}
