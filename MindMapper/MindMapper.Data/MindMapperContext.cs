using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MindMapper.Data.Models.Application;
using MindMapper.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using static System.Formats.Asn1.AsnWriter;
using Microsoft.Extensions.DependencyInjection;
using MindMapper.Data.Roles;

namespace MindMapper.Data
{
    public class MindMapperContext : IdentityDbContext<ApplicationUser>
    {

        public MindMapperContext(DbContextOptions<MindMapperContext> options) : base(options)
        {
        }

        public DbSet<CanvasState> Canvases { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Option> Options { get; set; }

        public static async Task InitializeRoles(IServiceProvider serviceProvider)
        {
            var dbContext = serviceProvider.GetRequiredService<MindMapperContext>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            IEnumerable<string> currRoles = dbContext.Roles.Select(role => role.Name);

            IEnumerable<string> enumRoles = Enum.GetNames(typeof(ApplicationUserRole));

            IEnumerable<string> removables = currRoles.Except(enumRoles);
            IEnumerable<string> addables = enumRoles.Except(currRoles);

            foreach (string remove in removables)
            {
                dbContext.Roles.Remove(dbContext.Roles.First(role => role.Name == remove));
            }

            await dbContext.SaveChangesAsync();

            foreach (string add in addables)
            {
                await roleManager.CreateAsync(new IdentityRole(add));
            }

        }
    }


}
