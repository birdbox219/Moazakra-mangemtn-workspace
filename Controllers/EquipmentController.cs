using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _equipmentService;

        public EquipmentController(IEquipmentService equipmentService)
        {
            _equipmentService = equipmentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
        {
            var equipments = await _equipmentService.GetEquipmentAsync();
            return Ok(equipments);
        }

        [HttpPost]
        public async Task<IActionResult> AddEquipment([FromBody] Equipment eq)
        {
            await _equipmentService.AddEquipmentAsync(eq);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, [FromBody] Equipment eq)
        {
            eq.EquipmentID = id;
            await _equipmentService.UpdateEquipmentAsync(eq);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            await _equipmentService.DeleteEquipmentAsync(id);
            return Ok();
        }
    }
}
