using Microsoft.EntityFrameworkCore;
using MindMapper.Data;
using MindMapper.Data.Models;
using MindMapper.Data.Roles;
using MindMapper.Server.Services.Validation.Base;
using System.Linq.Expressions;

namespace MindMapper.Server.Services.Validation.Implementation
{
    public class OptionValidation : IDbValidation<Option>
    {
        public static string GetId(Option entity)
        {
            return entity.Id.ToString();
        }

        public static IQueryable<Option> GetUserEntities(MindMapperContext dbContext, string userId, HashSet<ApplicationUserRole> roles)
        {
            return dbContext.Canvases
                .Include(canvas => canvas.Cards)
                .ThenInclude(card => card.ChildOptions)
                .Where(canvas => canvas.CreatedByUserId == userId)
                .SelectMany(canvas => canvas.Cards)
                .SelectMany(card => card.ChildOptions);
        }

        public static Expression<Func<Option, bool>> Match(string entityId)
        {
            return entity => entity.Id.ToString() == entityId;
        }

        public static async Task<bool> ValidateForeignKeys(MindMapperContext dbContext, Option entity, string userId, HashSet<ApplicationUserRole> roles)
        {
            return await CardValidation.ValidateForeignKeys(dbContext, await dbContext.Cards.FirstAsync(card => card.Id == entity.CardId), userId, roles) &&
                (entity.PointToCard == null || await CardValidation.ValidateForeignKeys(dbContext, await dbContext.Cards.FirstAsync(card => card.Id == entity.PointToCardId), userId, roles));
        }
    }
}
