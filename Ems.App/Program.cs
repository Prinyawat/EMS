using Microsoft.EntityFrameworkCore;
using Ems.App.Servies.IServices;
using Ems.App.Servies;
using Ems.App;
using Ems.Data.Entities;
using Ems.App.Middleware;
using YourNamespace;


var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<AppSetting>(builder.Configuration.GetSection("AppSettings"));

// Add services to the container.

builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<IHomeService, HomeService>();
builder.Services.AddTransient<ITokenService, TokenService>();
builder.Services.AddTransient<IUserService, UserService>();

//SignalR
builder.Services.AddSignalR();

//CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

//LeaveRequest Service
builder.Services.AddTransient<ILeaveRequestService, LeaveRequestService>();

// Check In Out Service
builder.Services.AddTransient<ICheckingService, CheckingTimeService>();

// Course Service
builder.Services.AddTransient<ICourseService, CourseService>();

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("KnownOrigin",
        builder => builder.WithOrigins("http://localhost")
        .AllowCredentials()
        .AllowAnyHeader()
        .AllowAnyMethod()
        );
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<EmsContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("DevConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors("CorsPolicy");
}

//app.UseCors(options =>
//options.WithOrigins("http://localhost:4200")
//.AllowAnyMethod()
//.AllowAnyHeader());

app.UseMiddleware<AuthorizationMiddleware>();

app.UseCors("KnownOrigin");
app.UseRouting();
app.MapControllers();

app.UseHttpsRedirection();

app.UseAuthorization();

//app.MapControllers();

app.MapHub<DataHub>("/datahub");
app.Run();
