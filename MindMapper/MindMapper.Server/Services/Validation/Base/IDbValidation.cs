using MindMapper.Data;
using MindMapper.Data.Roles;
using System.Linq.Expressions;

namespace MindMapper.Server.Services.Validation.Base
{
    public interface IDbValidation<TDbEntity>
        where TDbEntity : class
    {
        public static abstract Task<bool> ValidateForeignKeys(MindMapperContext dbContext, TDbEntity entity, string userId, HashSet<ApplicationUserRole> roles);
        public static abstract IQueryable<TDbEntity> GetUserEntities(MindMapperContext dbContext, string userId, HashSet<ApplicationUserRole> roles);
        public static abstract string GetId(TDbEntity entity);
        public static abstract Expression<Func<TDbEntity, bool>> Match(string entityId);
    }
}
