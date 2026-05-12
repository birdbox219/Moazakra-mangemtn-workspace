using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IHubService
    {
        Task<IEnumerable<Hub>> GetHubsAsync();
        Task AddHubAsync(Hub hub);
        Task UpdateHubAsync(Hub hub);
        Task DeleteHubAsync(int id);
    }
}
