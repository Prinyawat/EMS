namespace Ems.App.Models
{
    public class AgendaModel
    {
        public string firstName { get; set; }
        public string lastName {  get; set; }
        public DateTime? checkingDate { get; set; }
        public DateTime? checkIn { get; set; }
        public DateTime? checkOut { get; set; }
        public string checkingStatus { get; set; }

    }

}
