using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Status_ColorAPI.Models
{
    public class StatusColor
    {
        [Key]

        [Column(TypeName = "bigserial")]
        public long StatusId { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string StatusType { get; set; } = "";

        [Column(TypeName = "varchar(50)")]
        public string StatusCode { get; set; } = "";

        [Column(TypeName = "varchar(50)")]
        public string StatusName { get; set; } = "";

        [Column(TypeName = "bool")]
        public bool Active { get; set; } = true;
    }
}
