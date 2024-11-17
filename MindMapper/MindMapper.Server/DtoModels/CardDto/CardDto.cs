using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.Base;

namespace MindMapper.Server.DtoModels.CardDto
{
    public class CardDto : IDtoModel<Card, CardDto>
    {
        public string? Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public int Top { get; set; }
        public int Left { get; set; }

        public string? CanvasStateId { get; set; }

        public Card ToDbModel(string userId)
        {
            return new Card
            {
                Id = !string.IsNullOrWhiteSpace(Id) ? new Guid(Id) : new Guid(),
                Title = Title,
                Description = Description,
                Top = Top,
                Left = Left,
                CanvasStateId = !string.IsNullOrWhiteSpace(CanvasStateId) ? new Guid(CanvasStateId) : null,
                CreatedByUserId = userId,
                UpdatedByUserId = userId    
            };
        }

        public CardDto ToResponse(Card entity)
        {
            return new CardDto
            {
                Id = entity.Id.ToString(),
                Title = entity.Title,
                Description = entity.Description,
                Top = entity.Top,
                Left = entity.Left,
                CanvasStateId = entity.CanvasStateId?.ToString()
            };
        }
    }
}
