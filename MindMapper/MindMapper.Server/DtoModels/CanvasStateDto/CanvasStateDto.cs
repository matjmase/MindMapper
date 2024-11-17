using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.Base;

namespace MindMapper.Server.DtoModels.CanvasStateDto
{
    public class CanvasStateDto : IDtoModel<CanvasState, CanvasStateDto>
    {
        public string? Id { get; set; }

        public string Name { get; set; }
        public double Scale { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }

        public string? SeedCardId { get; set; }

        public CanvasState ToDbModel(string userId)
        {
            return new CanvasState
            {
                Id = !string.IsNullOrWhiteSpace(Id) ? new Guid(Id) : new Guid(),
                Name = Name,
                Scale = Scale,
                Height = Height,
                Width = Width,
                SeedCardId = !string.IsNullOrWhiteSpace(SeedCardId) ? new Guid(SeedCardId) : null,
                CreatedByUserId = userId,
                UpdatedByUserId = userId
            };
        }

        public CanvasStateDto ToResponse(CanvasState entity)
        {
            return new CanvasStateDto
            {
                Id = entity.Id.ToString(),
                Name = entity.Name,
                Scale = entity.Scale,
                Height = entity.Height,
                Width = entity.Width,
                SeedCardId = entity.SeedCardId?.ToString(),
            };
        }
    }
}
