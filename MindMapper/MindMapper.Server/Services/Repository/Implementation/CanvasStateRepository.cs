using MindMapper.Data;
using MindMapper.Data.Models;
using MindMapper.Server.Services.Repository.Base;
using MindMapper.Server.Services.Repository.Interface;
using MindMapper.Server.Services.Validation.Implementation;

namespace MindMapper.Server.Services.Repository.Implementation
{
    public class CanvasStateRepository : DbRepository<CanvasState, CanvasStateValidation>, ICanvasStateRepository
    {
        public CanvasStateRepository(MindMapperContext dbContext) : base(dbContext)
        {
        }
    }
}
