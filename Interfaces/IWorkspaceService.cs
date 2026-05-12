using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IWorkspaceService
    {
        Task<IEnumerable<Workspace>> GetWorkspacesAsync();
        Task AddWorkspaceAsync(Workspace ws);
        Task UpdateWorkspaceAsync(Workspace ws);
        Task DeleteWorkspaceAsync(int id);
    }
}
