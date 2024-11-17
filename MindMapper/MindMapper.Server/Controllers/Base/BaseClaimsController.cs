using Microsoft.AspNetCore.Mvc;
using MindMapper.Data.Roles;
using MindMapper.Server.Common.Claims;
using System.Net;
using System.Security.Claims;
using System.Web.Http;
using NonActionAttribute = Microsoft.AspNetCore.Mvc.NonActionAttribute;

namespace MindMapper.Server.Controllers.Base
{
    public abstract class BaseClaimsController : ControllerBase
    {
        [NonAction]
        protected string GetUserId()
        {
            var identity = User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                Claim? claim = identity.Claims.FirstOrDefault(claim => claim.Type == CustomTokenClaim.UserId.ToString());

                if (claim != null)
                {
                    return claim.Value;
                }
                else
                {
                    throw new HttpResponseException(HttpStatusCode.Forbidden);
                }
            }

            throw new HttpResponseException(HttpStatusCode.Forbidden);
        }

        [NonAction]
        protected HashSet<ApplicationUserRole> GetRoles()
        {
            var identity = User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                var roles = identity.Claims.Where(claim => claim.Type == ClaimTypes.Role).Select(claim => claim.Value);

                return roles.Select(role => (ApplicationUserRole)Enum.Parse(typeof(ApplicationUserRole), role)).ToHashSet();
            }

            throw new HttpResponseException(HttpStatusCode.Forbidden);
        }
    }
}
