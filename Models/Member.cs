namespace WebApplication1.Models
{
    public class Member
    {
        public int MemberID { get; set; }
        public string FName { get; set; } = string.Empty;
        public string LName { get; set; } = string.Empty;
        public string? NickName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? DigitalID { get; set; }
        public string Company { get; set; } = string.Empty;

        // Helper (مش column في الداتا بيز)
        public string FullName => $"{FName} {LName}";

        // Navigation
        public List<string>? PhoneNumbers { get; set; }
    }
}
