using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkspacesController : ControllerBase
    {
        private readonly IWorkspaceService _workspaceService;
        private readonly IHubService _hubService;

        public WorkspacesController(IWorkspaceService workspaceService, IHubService hubService)
        {
            _workspaceService = workspaceService;
            _hubService = hubService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Workspace>>> GetWorkspaces()
        {
            var workspaces = await _workspaceService.GetWorkspacesAsync();
            return Ok(workspaces);
        }

        [HttpPost]
        public async Task<IActionResult> AddWorkspace([FromBody] Workspace ws)
        {
            await _workspaceService.AddWorkspaceAsync(ws);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkspace(int id, [FromBody] Workspace ws)
        {
            ws.WorkspaceID = id;
            await _workspaceService.UpdateWorkspaceAsync(ws);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkspace(int id)
        {
            await _workspaceService.DeleteWorkspaceAsync(id);
            return Ok();
        }
        
        // Hubs
        [HttpGet("hubs")]
        public async Task<ActionResult<IEnumerable<Hub>>> GetHubs()
        {
            var  hubs = await _hubService.GetHubsAsync();
            return Ok(hubs);
        }

        [HttpPost("hubs")]
        public async Task<IActionResult> AddHub([FromBody] Hub hub)
        {
            await _hubService.AddHubAsync(hub);
            return Ok();
        }

        [HttpPut("hubs/{id}")]
        public async Task<IActionResult> UpdateHub(int id, [FromBody] Hub hub)
        {
            hub.HubID = id;
            await _hubService.UpdateHubAsync(hub);
            return Ok();
        }

        [HttpDelete("hubs/{id}")]
        public async Task<IActionResult> DeleteHub(int id)
        {
            await _hubService.DeleteHubAsync(id);
            return Ok();
        }
    }
}
