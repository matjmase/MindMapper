using Microsoft.EntityFrameworkCore;
using MindMapper.Data;
using MindMapper.Data.Models.Base;
using MindMapper.Data.Roles;
using MindMapper.Server.Services.Validation.Base;
using System.Net;

namespace MindMapper.Server.Services.Repository.Base
{
    public abstract class DbRepository<TDbEntity, TDbValidation> : IDbRepository<TDbEntity>
        where TDbEntity : BaseIdEntityModel
        where TDbValidation : IDbValidation<TDbEntity>
    {
        private MindMapperContext _dbContext;

        public DbRepository(MindMapperContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TDbEntity> Add(TDbEntity addEntity, string userId, HashSet<ApplicationUserRole> roles)
        {
            if (await TDbValidation.ValidateForeignKeys(_dbContext, addEntity, userId, roles))
            {
                var tracked = _dbContext.Add(addEntity);
                await _dbContext.SaveChangesAsync();

                return tracked.Entity;
            }
            else
            {
                throw new System.Web.Http.HttpResponseException(HttpStatusCode.Forbidden);
            }
        }

        public IQueryable<TDbEntity> Get(string userId, HashSet<ApplicationUserRole> roles)
        {
            return TDbValidation.GetUserEntities(_dbContext, userId, roles);
        }

        public async Task Remove(TDbEntity deleteEntity, string userId, HashSet<ApplicationUserRole> roles)
        {
            if (await TDbValidation.GetUserEntities(_dbContext, userId, roles).AnyAsync(TDbValidation.Match(TDbValidation.GetId(deleteEntity))))
            {
                _dbContext.Attach(deleteEntity);
                _dbContext.Remove(deleteEntity);

                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new System.Web.Http.HttpResponseException(HttpStatusCode.Forbidden);
            }
        }

        public async Task<TDbEntity> Update(TDbEntity updateEntity, string userId, HashSet<ApplicationUserRole> roles)
        {
            if (await TDbValidation.GetUserEntities(_dbContext, userId, roles).AnyAsync(TDbValidation.Match(TDbValidation.GetId(updateEntity)))
                && await TDbValidation.ValidateForeignKeys(_dbContext, updateEntity, userId, roles))
            {
                _dbContext.Attach(updateEntity);
                var tracked = _dbContext.Update(updateEntity);

                tracked.Property(entity => entity.CreatedByUserId).IsModified = false;

                await _dbContext.SaveChangesAsync();

                return tracked.Entity;
            }
            else
            {
                throw new System.Web.Http.HttpResponseException(HttpStatusCode.Forbidden);
            }
        }
    }
}
