using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.Base;

namespace MindMapper.Server.DtoModels.OptionDto
{
    public class OptionDto : IDtoModel<Option, OptionDto>
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string CardId { get; set; }
        public string? PointToCardId { get; set; }

        public Option ToDbModel(string userId)
        {
            return new Option
            {
                Id = !string.IsNullOrEmpty(Id) ? new Guid(Id) : new Guid(),
                Text = Text,
                CardId = new Guid(CardId),
                PointToCardId = !string.IsNullOrWhiteSpace(PointToCardId) ? new Guid(PointToCardId) : null,
                CreatedByUserId = userId,
                UpdatedByUserId = userId,
            };
        }
        public Option ToDbModel(string userId, Guid cardId)
        {
            return new Option
            {
                Id = !string.IsNullOrEmpty(Id) ? new Guid(Id) : new Guid(),
                Text = Text,
                CardId = cardId,
                PointToCardId = !string.IsNullOrWhiteSpace(PointToCardId) ? new Guid(PointToCardId) : null,
                CreatedByUserId = userId,
                UpdatedByUserId = userId,
            };
        }

        public OptionDto ToResponse(Option entity)
        {
            return new OptionDto
            {
                Id = entity.Id.ToString(),
                Text = entity.Text,
                CardId = entity.CardId.ToString(),
                PointToCardId = entity.PointToCardId?.ToString(),
            };
        }
    }
}
