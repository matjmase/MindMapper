using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.Base;
using System.Linq.Expressions;

namespace MindMapper.Server.DtoModels.CanvasStateDto
{
    public class CanvasStateSearch : IEntitySearch<CanvasState>
    {
        public string? Id { get; set; }

        public string? Name { get; set; }

        public string? SeedCardId { get; set; }

        public Expression<Func<CanvasState, bool>> Filter()
        {
            return canvas => (
            (Id == null || canvas.Id.ToString() == Id) &&
            (Name == null || EF.Functions.Like(canvas.Name, "%" + Name + "%")) &&
            (SeedCardId == null || canvas.SeedCardId.ToString() == SeedCardId));
        }
    }
}
