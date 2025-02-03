using Microsoft.AspNetCore.SignalR;

public class ValidCheckingTime : Hub
{
    public async Task sendValidCheckingTime(string message)
    {
        await Clients.All.SendAsync("ReceiveNotification", message);
    }
}
