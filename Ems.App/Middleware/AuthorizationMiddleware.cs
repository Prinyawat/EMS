namespace Ems.App.Middleware
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;
        //private readonly IUserService DB;
        public AuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {

            if (httpContext.Request.Headers["Authorization"].Count == 0)
            {
                string username = httpContext.Request.Headers.Where(x => x.Key == "username").Select(x => x.Value).FirstOrDefault();
                string password = httpContext.Request.Headers.Where(x => x.Key == "password").Select(x => x.Value).FirstOrDefault();

                if (!string.IsNullOrWhiteSpace(username) &&
                    !string.IsNullOrWhiteSpace(password))
                {
                    //User user = UserService.Login(username, password);
                    //httpContext.Request.Headers.Add("Authorization", "bearer " + user.Token);
                }
            }

            await _next(httpContext);
        }
    }
}
