namespace Ems.App.Models
{
    public class DataHubs
    {
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string phone { get; set; }
        public Guid positionId { get; set; }
        public string positionName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
