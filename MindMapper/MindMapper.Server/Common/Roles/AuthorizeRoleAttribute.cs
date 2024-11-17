using Microsoft.AspNetCore.Authorization;
using MindMapper.Data.Roles;
using System.Text;

namespace MindMapper.Server.Common.Roles
{
    public class AuthorizeRoleAttribute : AuthorizeAttribute
    {
        public ApplicationUserRole[] EnumRoles;

        public AuthorizeRoleAttribute(params ApplicationUserRole[] enumRoles)
        {
            EnumRoles = enumRoles;

            var strBuilder = new StringBuilder();

            for (var i = 0; i < EnumRoles.Length; i++)
            {
                // Not last
                if (i != EnumRoles.Length - 1)
                {
                    strBuilder.Append(EnumRoles[i] + ",");
                }
                else
                {
                    strBuilder.Append(EnumRoles[i]);
                }
            }

            base.Roles = strBuilder.ToString();
        }
    }
}
