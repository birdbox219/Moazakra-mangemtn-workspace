namespace WebApplication1.Models
{
    public class ReservationEquipment
    {
        public int ReservationID { get; set; }
        public int EquipmentID { get; set; }
        public int HoursUsed { get; set; }

        // Navigation
        public string? EquipmentName { get; set; }
        public string? EquipmentType { get; set; }
        public string? MemberName { get; set; }
        public string? WorkspaceType { get; set; }
    }
}
