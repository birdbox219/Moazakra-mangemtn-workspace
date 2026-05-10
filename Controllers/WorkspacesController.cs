using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkspacesController : ControllerBase
    {
        private readonly DatabaseService _db;

        public WorkspacesController(DatabaseService db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Workspace>>> GetWorkspaces()
        {
            var workspaces = await _db.GetWorkspacesAsync();
            return Ok(workspaces);
        }

        [HttpPost]
        public async Task<IActionResult> AddWorkspace([FromBody] Workspace ws)
        {
            await _db.AddWorkspaceAsync(ws);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkspace(int id, [FromBody] Workspace ws)
        {
            ws.WorkspaceID = id;
            await _db.UpdateWorkspaceAsync(ws);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkspace(int id)
        {
            await _db.DeleteWorkspaceAsync(id);
            return Ok();
        }
        
        // Hubs
        [HttpGet("hubs")]
        public async Task<ActionResult<IEnumerable<Hub>>> GetHubs()
        {
            var  hubs = await _db.GetHubsAsync();
            return Ok(hubs);
        }

        [HttpPost("hubs")]
        public async Task<IActionResult> AddHub([FromBody] Hub hub)
        {
            await _db.AddHubAsync(hub);
            return Ok();
        }

        [HttpPut("hubs/{id}")]
        public async Task<IActionResult> UpdateHub(int id, [FromBody] Hub hub)
        {
            hub.HubID = id;
            await _db.UpdateHubAsync(hub);
            return Ok();
        }

        [HttpDelete("hubs/{id}")]
        public async Task<IActionResult> DeleteHub(int id)
        {
            await _db.DeleteHubAsync(id);
            return Ok();
        }
    }
}
