using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface ICheckingService
    {
        CheckingTimeDataModel saveChecking(CheckingTimeDataModel checkingdata);

        List<AgendaModel> getAgendas();

        List<NotiAgendaModel> getNotiAgenda();

        List<CheckingStatusModel> getCheckinStatus();

        List<CheckingTimeDataModel> getInvalidCheckTime();

        List<HeaderAgendaModel> getAgendaHeader();


    }

}
