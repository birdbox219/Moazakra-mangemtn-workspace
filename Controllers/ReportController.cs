using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly DatabaseService _db;

        public ReportController(
            DatabaseService db
        )
        {
            _db = db;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult>
            GetDashboard(
                DateTime? startDate,
                DateTime? endDate
            )
        {
            var report =
                await _db
                    .GetDashboardReportAsync(
                        startDate,
                        endDate
                    );

            return Ok(report);
        }
    }
}