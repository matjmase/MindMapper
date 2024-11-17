using Microsoft.EntityFrameworkCore;
using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.Base;
using System.Linq.Expressions;
using System.Xml.Serialization;

namespace MindMapper.Server.DtoModels.OptionDto
{
    public class OptionSearch : IEntitySearch<Option>
    {
        public string? Id { get; set; }
        public string? Text { get; set; }
        public string? CardId { get; set; }
        public string? PointToCardId { get; set; }

        public Expression<Func<Option, bool>> Filter()
        {
            return option => (
                (Id == null || Id == option.Id.ToString()) &&
                (Text == null || EF.Functions.Like(option.Text, "%" + Text + "%")) &&
                (CardId == null || CardId == option.CardId.ToString()) &&
                (PointToCardId == null || PointToCardId == option.PointToCardId.ToString()));
        }
    }
}
