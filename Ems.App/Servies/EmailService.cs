using Ems.App.Servies.IServices;
using Ems.Data.Entities;
using MailKit.Net.Smtp;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;
using System.Threading.Tasks;

namespace Ems.App.Servies
{
    public class EmailService
    {
        private readonly string _smtpServer = "smtp.gmail.com";
        private readonly int _smtpPort = 587;
        private readonly string _smtpUser = "website.system.ems@gmail.com"; // เปลี่ยนเป็นอีเมลของคุณ
        private readonly string _smtpPassword = "ozreqhuznjabzhae"; // ใช้ App Password ที่สร้าง

        public async Task SendEmailAsync(string toEmail, string subject, string messageBody)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("EMS", _smtpUser));
            emailMessage.To.Add(new MailboxAddress(toEmail, toEmail));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("html") { Text = messageBody };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtpUser, _smtpPassword);
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
        }
    }
}
