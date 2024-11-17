using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.CardDto;
using MindMapper.Server.Services.Dto.Base;
using MindMapper.Server.Services.Dto.Interface;
using MindMapper.Server.Services.Repository.Interface;

namespace MindMapper.Server.Services.Dto.Implementation
{
    public class CardDtoConversion : DtoConversion<CardDto, Card, CardSearch, ICardRepository>, ICardDtoConversion
    {
        public CardDtoConversion(ICardRepository repository) : base(repository)
        {
        }
    }
}
