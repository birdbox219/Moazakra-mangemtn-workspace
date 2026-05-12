using System;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IReportService
    {
        Task<DashboardReport> GetDashboardReportAsync(DateTime? startDate, DateTime? endDate);
    }
}
