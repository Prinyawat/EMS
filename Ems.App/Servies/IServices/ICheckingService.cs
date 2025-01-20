using Ems.App.Models;

namespace Ems.App.Servies.IServices
{
    public interface ICheckingService
    {
        CheckingModel saveChecking(CheckingModel data);

        List<AgendaModel> getAgendas();
    }

}
