using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MindMapper.Data;
using MindMapper.Data.Models.Application;
using System.Text.Json.Serialization;
using System.Text;
using MindMapper.Server.Services.Dto.Implementation;
using MindMapper.Server.Services.Dto.Interface;
using MindMapper.Server.Services.Repository.Implementation;
using MindMapper.Server.Services.Repository.Interface;
using MindMapper.Server.Services.Composite;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
IConfiguration configuration = builder.Configuration;

builder.Services.AddDbContext<MindMapperContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

//services
builder.Services.AddTransient<ICanvasStateRepository, CanvasStateRepository>();
builder.Services.AddTransient<ICardRepository, CardRepository>();
builder.Services.AddTransient<IOptionRepository, OptionRepository>();

builder.Services.AddTransient<ICanvasStateDtoConversion, CanvasStateDtoConversion>();
builder.Services.AddTransient<ICardDtoConversion, CardDtoConversion>();
builder.Services.AddTransient<IOptionDtoConversion, OptionDtoConversion>();
builder.Services.AddTransient<ICanvasStateComposite, CanvasStateComposite>();

// identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password = new PasswordOptions()
    {
        RequireDigit = false,
        RequiredLength = 0,
        RequiredUniqueChars = 0,
        RequireLowercase = false,
        RequireNonAlphanumeric = false,
        RequireUppercase = false,
    };
})
    .AddEntityFrameworkStores<MindMapperContext>()
    .AddDefaultTokenProviders();

// Authentication
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}
            )
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration["Jwt:Issuer"],
                        ValidAudience = configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
                    };
                });


// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Migrate DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MindMapperContext>();
    db.Database.Migrate();
    db.SaveChanges();
}

// Update roles
using (var scope = app.Services.CreateScope())
{
    await MindMapperContext.InitializeRoles(scope.ServiceProvider);
}

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
