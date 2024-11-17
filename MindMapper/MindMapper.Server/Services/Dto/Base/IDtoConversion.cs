using MindMapper.Data.Roles;
using MindMapper.Server.DtoModels.Base;

namespace MindMapper.Server.Services.Dto.Base
{
    public interface IDtoConversion<TDto, TEntity, TSearch>
        where TSearch : IEntitySearch<TEntity>
    where TDto : IDtoModel<TEntity, TDto>, new()
    {
        public Task<TDto> Add(TDto addDto, string userId, HashSet<ApplicationUserRole> roles);
        public IQueryable<TDto> Get(string userId, HashSet<ApplicationUserRole> roles);
        public Task<TDto?> GetById(string entityId, string userId, HashSet<ApplicationUserRole> roles);
        public IQueryable<TDto> GetBySearch(TSearch search, string userId, HashSet<ApplicationUserRole> roles);
        public Task Remove(TDto deleteDto, string userId, HashSet<ApplicationUserRole> roles);
        public Task<TDto> Update(TDto updateDto, string userId, HashSet<ApplicationUserRole> roles);
    }
}
