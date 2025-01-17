using NuGet.Packaging.Signing;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Ems.App.Models
{
    public class AgendaModel
    {
        public string name { get; set; }
        public string day { get; set; }
        public Date checkdate { get; set; }
        public Date checkin { get; set; }
        public Date dacheckout { get; set; }
        public string status { get; set; }
    }
}