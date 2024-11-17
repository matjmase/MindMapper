using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MindMapper.Data
{
    public class DbContextFactory : IDesignTimeDbContextFactory<MindMapperContext>
    {
        MindMapperContext IDesignTimeDbContextFactory<MindMapperContext>.CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var dbContextBuilder = new DbContextOptionsBuilder<MindMapperContext>();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            dbContextBuilder.UseSqlServer(connectionString);

            return new MindMapperContext(dbContextBuilder.Options);
        }
    }
}
