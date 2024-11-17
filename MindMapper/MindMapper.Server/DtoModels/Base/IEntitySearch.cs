using MindMapper.Data.Models;
using System.Linq.Expressions;

namespace MindMapper.Server.DtoModels.Base
{
    public interface IEntitySearch<TEntity>
    {
        public Expression<Func<TEntity, bool>> Filter();
    }
}
