using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly DatabaseService _db;

        public ReservationsController(DatabaseService db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            var reservations = await _db.GetReservationsAsync();
            return Ok(reservations);
        }

        [HttpPost]
        public async Task<IActionResult> AddReservation([FromBody] Reservation res)
        {
            await _db.AddReservationAsync(res);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            await _db.DeleteReservationAsync(id);
            return Ok();
        }
    }
}
