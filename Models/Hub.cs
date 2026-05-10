namespace WebApplication1.Models
{
    public class Hub
    {
        public int HubID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Building { get; set; }
        public string? Layout { get; set; }
    }
}
