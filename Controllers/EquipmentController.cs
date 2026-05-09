using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly DatabaseService _db;

        public EquipmentController(DatabaseService db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
        {
            var equipment = await _db.GetEquipmentAsync();
            return Ok(equipment);
        }

        [HttpPost]
        public async Task<IActionResult> AddEquipment([FromBody] Equipment eq)
        {
            await _db.AddEquipmentAsync(eq);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            await _db.DeleteEquipmentAsync(id);
            return Ok();
        }
    }
}
