using Microsoft.EntityFrameworkCore;
using Ems.App.Entities;
using Ems.App.Servies.IServices;
using Ems.App.Servies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<IHomeService, HomeService>();



builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("KnownOrigin",
        builder => builder.WithOrigins("http://localhost:4200")
        .AllowCredentials()
        .AllowAnyHeader()
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
}

//app.UseCors(options =>
//options.WithOrigins("http://localhost:4200")
//.AllowAnyMethod()
//.AllowAnyHeader());
app.UseCors("KnownOrigin");
app.UseRouting();
app.MapControllers();

app.UseHttpsRedirection();

app.UseAuthorization();

//app.MapControllers();

app.Run();
