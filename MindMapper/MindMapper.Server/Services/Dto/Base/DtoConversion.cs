using Microsoft.EntityFrameworkCore;
using MindMapper.Data.Models.Base;
using MindMapper.Data.Roles;
using MindMapper.Server.DtoModels.Base;
using MindMapper.Server.Services.Repository.Base;

namespace MindMapper.Server.Services.Dto.Base
{
    public abstract class DtoConversion<TDto, TEntity, TSearch, IRepository> : IDtoConversion<TDto, TEntity, TSearch>
    where TEntity : BaseIdEntityModel
    where TSearch : IEntitySearch<TEntity>
    where TDto : IDtoModel<TEntity, TDto>, new()
    where IRepository : IDbRepository<TEntity>
    {
        private IRepository _repository;

        public DtoConversion(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<TDto> Add(TDto addDto, string userId, HashSet<ApplicationUserRole> roles)
        {
            TEntity dbEntity = await _repository.Add(addDto.ToDbModel(userId), userId, roles);

            return new TDto().ToResponse(dbEntity);
        }

        public IQueryable<TDto> Get(string userId, HashSet<ApplicationUserRole> roles)
        {
            return _repository.Get(userId, roles).Select(entity => new TDto().ToResponse(entity));
        }

        public async Task<TDto?> GetById(string entityId, string userId, HashSet<ApplicationUserRole> roles)
        {
            return new TDto().ToResponse(await _repository.Get(userId, roles).FirstAsync(entity => entity.Id.ToString() == entityId));
        }

        public IQueryable<TDto> GetBySearch(TSearch search, string userId, HashSet<ApplicationUserRole> roles)
        {
            return _repository.Get(userId, roles).Where(search.Filter()).Select(entity => new TDto().ToResponse(entity));
        }

        public async Task Remove(TDto deleteDto, string userId, HashSet<ApplicationUserRole> roles)
        {
            await _repository.Remove(deleteDto.ToDbModel(userId), userId, roles);
        }

        public async Task<TDto> Update(TDto updateDto, string userId, HashSet<ApplicationUserRole> roles)
        {
            TEntity dbEntity = await _repository.Update(updateDto.ToDbModel(userId), userId, roles);

            return new TDto().ToResponse(dbEntity);
        }
    }
}
