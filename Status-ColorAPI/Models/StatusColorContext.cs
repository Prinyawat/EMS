using Microsoft.EntityFrameworkCore;


namespace Status_ColorAPI.Models
{
    public class StatusColorContext : DbContext
    {
        public StatusColorContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<StatusColor> StatusColors { get; set; }
    }
}

