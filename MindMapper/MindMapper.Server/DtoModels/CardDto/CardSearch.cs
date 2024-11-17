using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.Base;
using System.Linq.Expressions;

namespace MindMapper.Server.DtoModels.CardDto
{
    public class CardSearch : IEntitySearch<Card>
    {
        public string? Id { get; set; }

        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? CanvasStateId { get; set; }

        public Expression<Func<Card, bool>> Filter()
        {
            return card => (
            (Id == null || card.Id.ToString() == Id) &&
            (Title == null || card.Title == Title) &&
            (Description == null || card.Description == Description) &&
            (CanvasStateId == null || card.CanvasStateId.ToString() == CanvasStateId));
        }
    }
}
