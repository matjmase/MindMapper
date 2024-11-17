using MindMapper.Data;
using MindMapper.Data.Models;
using MindMapper.Data.Roles;
using MindMapper.Server.Services.Validation.Base;
using System.Linq.Expressions;

namespace MindMapper.Server.Services.Validation.Implementation
{
    public class CanvasStateValidation : IDbValidation<CanvasState>
    {
        public static string GetId(CanvasState entity)
        {
            return entity.Id.ToString();
        }

        public static IQueryable<CanvasState> GetUserEntities(MindMapperContext dbContext, string userId, HashSet<ApplicationUserRole> roles)
        {
            return dbContext.Canvases.Where(canvas => canvas.CreatedByUserId == userId);
        }

        public static Expression<Func<CanvasState, bool>> Match(string entityId)
        {
            return entity => entity.Id.ToString() == entityId;  
        }

        public static async Task<bool> ValidateForeignKeys(MindMapperContext dbContext, CanvasState entity, string userId, HashSet<ApplicationUserRole> roles)
        {
            return entity.CreatedByUserId == userId;
        }
    }
}
