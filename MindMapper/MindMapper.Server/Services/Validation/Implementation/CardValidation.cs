using Microsoft.EntityFrameworkCore;
using MindMapper.Data;
using MindMapper.Data.Models;
using MindMapper.Data.Roles;
using MindMapper.Server.Services.Validation.Base;
using System.Linq.Expressions;

namespace MindMapper.Server.Services.Validation.Implementation
{
    public class CardValidation : IDbValidation<Card>
    {
        public static string GetId(Card entity)
        {
            return entity.Id.ToString();
        }

        public static IQueryable<Card> GetUserEntities(MindMapperContext dbContext, string userId, HashSet<ApplicationUserRole> roles)
        {
            return dbContext.Canvases
                .Include(canvas => canvas.Cards)
                .Where(canvas => canvas.CreatedByUserId == userId)
                .SelectMany(canvas => canvas.Cards);
        }

        public static Expression<Func<Card, bool>> Match(string entityId)
        {
            return entity => entity.Id.ToString() == entityId;
        }

        public static async Task<bool> ValidateForeignKeys(MindMapperContext dbContext, Card entity, string userId, HashSet<ApplicationUserRole> roles)
        {
            return await CanvasStateValidation.ValidateForeignKeys(dbContext, await dbContext.Canvases.FirstAsync(canvas => canvas.Id == entity.CanvasStateId), userId, roles);
        }
    }
}
