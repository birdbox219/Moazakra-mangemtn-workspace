using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IEquipmentService
    {
        Task<IEnumerable<Equipment>> GetEquipmentAsync();
        Task AddEquipmentAsync(Equipment eq);
        Task UpdateEquipmentAsync(Equipment eq);
        Task DeleteEquipmentAsync(int id);
    }
}
