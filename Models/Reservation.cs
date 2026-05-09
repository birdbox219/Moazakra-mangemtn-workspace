namespace WebApplication1.Models
{
    public class Reservation
    {
        public int ReservationID { get; set; }
        public int MemberID { get; set; }
        public int WorkspaceID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        
        // Navigation properties (optional for ADO.NET but useful for logic)
        public string? MemberName { get; set; }
        public string? WorkspaceType { get; set; }
    }
}
