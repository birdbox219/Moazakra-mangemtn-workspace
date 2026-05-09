namespace WebApplication1.Models
{
    public class Workspace
    {
        public int WorkspaceID { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public int HubID { get; set; }
    }
}
