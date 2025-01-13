namespace Ems.App.Models
{
    public class UserModel
    {
        public Guid UserId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }


        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
