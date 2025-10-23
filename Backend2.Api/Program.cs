using Backend2.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// MVC Controllers (Web API)
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core + SQL Server (läser "Default" från appsettings.json)
builder.Services.AddDbContext<FreakyDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// CORS för din frontend (Vite 5173, CRA 3000)
const string CorsPolicy = "_freakyCors";
builder.Services.AddCors(opts =>
{
    opts.AddPolicy(CorsPolicy, p => p
        .WithOrigins("http://localhost:5173", "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

// Swagger i Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(CorsPolicy);

// Koppla in controllers
app.MapControllers();

app.Run();
