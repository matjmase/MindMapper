using MindMapper.Data.Models;
using MindMapper.Data;
using MindMapper.Server.Services.Repository.Base;
using MindMapper.Server.Services.Repository.Interface;
using MindMapper.Server.Services.Validation.Implementation;

namespace MindMapper.Server.Services.Repository.Implementation
{
    public class OptionRepository : DbRepository<Option, OptionValidation>, IOptionRepository
    {
        public OptionRepository(MindMapperContext dbContext) : base(dbContext)
        {
        }
    }
}
