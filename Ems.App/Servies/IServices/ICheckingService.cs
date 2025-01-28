using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface ICheckingService
    {
        CheckingTimeDataModel saveChecking(CheckingTimeDataModel checkingdata);

        List<AgendaModel> getAgendas();

        List<CheckingStatusModel> getCheckinStatus();
    }

}
