using MindMapper.Data.Roles;

namespace MindMapper.Server.Services.Repository.Base
{
    public interface IDbRepository<TEntity> where TEntity : class
    {
        public IQueryable<TEntity> Get(string userId, HashSet<ApplicationUserRole> roles);
        public Task<TEntity> Add(TEntity addEntity, string userId, HashSet<ApplicationUserRole> roles);
        public Task<TEntity> Update(TEntity updateEntity, string userId, HashSet<ApplicationUserRole> roles);
        public Task Remove(TEntity deleteEntity, string userId, HashSet<ApplicationUserRole> roles);
    }
}
