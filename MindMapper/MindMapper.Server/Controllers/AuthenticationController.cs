using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MindMapper.Data.Models.Application;
using MindMapper.Data.Roles;
using MindMapper.Server.Common.Claims;
using MindMapper.Server.DtoModels.Authentication;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace MindMapper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private IConfiguration _config;
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;

        private readonly TimeSpan _jwtLifespan = new TimeSpan(0, 15, 0);
        private readonly TimeSpan _RefreshLifespan = new TimeSpan(7, 0, 0, 0);

        private readonly string _loginProvider = "MindMapper";
        private readonly string _tokenName = "refresh";

        private byte[] _jwtKey;
        private string _tokenProvider;
        public AuthenticationController(
            IConfiguration config,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _config = config;
            _userManager = userManager;
            _roleManager = roleManager;

            _jwtKey = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            _tokenProvider = _config["Jwt:Issuer"];
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<SessionModelDto> Login([FromBody] LoginModelDto login)
        {
            var user = await AuthenticateUser(login);
            var roles = await _userManager.GetRolesAsync(user);

            return await GetSession(user, roles);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<SessionModelDto> Register([FromBody] RegisterModelDto register)
        {
            var firstUser = (await _userManager.Users.CountAsync()) == 0;

            var createResult = await _userManager.CreateAsync(register.ToDbModel(), register.Password);

            if (!createResult.Succeeded)
            {
                throw new System.Web.Http.HttpResponseException(HttpStatusCode.InternalServerError);
            }

            var user = await AuthenticateUser(register);

            // Special logic for first user.
            if (firstUser)
            {
                var totalRoles = await _roleManager.Roles.Select(role => role.Name).ToArrayAsync();

                await _userManager.AddToRolesAsync(user, totalRoles);
            }
            else
            {
                await _userManager.AddToRoleAsync(user, ApplicationUserRole.User.ToString());
            }

            var roles = await _userManager.GetRolesAsync(user);

            return await GetSession(user, roles);
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<SessionModelDto> Refresh(RefreshTokenModeDto oldRefresh)
        {
            var principle = GetPrincipalFromExpiredToken(oldRefresh.ExpiredJwt);

            var userId = principle.Claims.FirstOrDefault(claim => claim.Type.ToString() == CustomTokenClaim.UserId.ToString())?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                throw new System.Web.Http.HttpResponseException(HttpStatusCode.Forbidden);
            }

            var user = await GetUserFromId(userId);
            var roles = await _userManager.GetRolesAsync(user);

            return await GetSession(user, roles);
        }

        [NonAction]
        private async Task<ApplicationUser> AuthenticateUser(LoginModelDto login)
        {
            ApplicationUser? applicationUser = await GetUser(login);

            if (applicationUser != null)
            {
                bool result = await _userManager.CheckPasswordAsync(applicationUser, login.Password);

                return result ? applicationUser : null;
            }

            if (applicationUser == null)
            {
                throw new System.Web.Http.HttpResponseException(HttpStatusCode.Forbidden);
            }

            return applicationUser;
        }

        [NonAction]
        private async Task<ApplicationUser?> GetUser(LoginModelDto login)
        {
            ApplicationUser? applicationUser = await _userManager.Users
                .FirstOrDefaultAsync(appUser => appUser.Email.ToLower() == login.Email.ToLower());

            return applicationUser;
        }

        [NonAction]
        private async Task<ApplicationUser?> GetUserFromId(string id)
        {
            ApplicationUser? applicationUser = await _userManager.Users
                .FirstOrDefaultAsync(appUser => appUser.Id == id);

            return applicationUser;
        }

        [NonAction]
        private async Task<SessionModelDto> GetSession(ApplicationUser user, IEnumerable<string> roles)
        {
            GetTokens(user.Id, roles, out var jwt, out var refresh);

            return new SessionModelDto
            {
                Jwt = jwt,
                Refresh = refresh,
                PrimaryUser = PrimaryUserDto.ToDto(user),
            };
        }

        [NonAction]
        private void GetTokens(string userId, IEnumerable<string> roles, out string jwt, out string refresh)
        {
            jwt = GenerateJSONWebToken(userId, roles, DateTime.Now.Add(_jwtLifespan));
            refresh = GenerateJSONWebToken(userId, roles, DateTime.Now.Add(_RefreshLifespan));
        }

        [NonAction]
        private string GenerateJSONWebToken(string userId, IEnumerable<string> roles, DateTime expiration)
        {
            var securityKey = new SymmetricSecurityKey(_jwtKey);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(new[]
            {
                new Claim(CustomTokenClaim.UserId.ToString(), userId)
            });

            foreach (var role in roles)
            {
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(_tokenProvider,
              _tokenProvider,
              claimsIdentity.Claims,
              DateTime.Now,
              expiration,
              credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [NonAction]
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(_jwtKey),
                ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");
            return principal;
        }
    }
}
