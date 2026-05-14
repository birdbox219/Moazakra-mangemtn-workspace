using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HubsController : ControllerBase
    {
        private readonly IHubService _hubService;

        public HubsController(IHubService hubService)
        {
            _hubService = hubService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hub>>> GetHubs()
        {
            var hubs = await _hubService.GetHubsAsync();
            return Ok(hubs);
        }

        [HttpPost]
        public async Task<IActionResult> AddHub([FromBody] Hub hub)
        {
            await _hubService.AddHubAsync(hub);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHub(int id, [FromBody] Hub hub)
        {
            hub.HubID = id;
            await _hubService.UpdateHubAsync(hub);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHub(int id)
        {
            await _hubService.DeleteHubAsync(id);
            return Ok();
        }
    }
}
