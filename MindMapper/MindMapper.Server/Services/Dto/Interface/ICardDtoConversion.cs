using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.CardDto;
using MindMapper.Server.Services.Dto.Base;

namespace MindMapper.Server.Services.Dto.Interface
{
    public interface ICardDtoConversion : IDtoConversion<CardDto, Card, CardSearch>
    {
    }
}
