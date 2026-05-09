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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkspace(int id)
        {
            await _db.DeleteWorkspaceAsync(id);
            return Ok();
        }
        
        [HttpGet("hubs")]
        public async Task<ActionResult<IEnumerable<Hub>>> GetHubs()
        {
            var hubs = await _db.GetHubsAsync();
            return Ok(hubs);
        }
    }
}
