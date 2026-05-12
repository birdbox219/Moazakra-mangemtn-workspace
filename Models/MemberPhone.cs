namespace WebApplication1.Models
{
    public class MemberPhone
    {
        public int PhoneID { get; set; }
        public int MemberID { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;

        // Navigation
        public string? MemberName { get; set; }
    }
}
