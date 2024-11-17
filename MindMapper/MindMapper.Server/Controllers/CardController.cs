using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMapper.Data.Models;
using MindMapper.Server.Common.Roles;
using MindMapper.Server.Controllers.Base;
using MindMapper.Server.DtoModels.CardDto;
using MindMapper.Server.Services.Dto.Interface;

namespace MindMapper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CardController : BaseDtoController<Card, CardDto, CardSearch, ICardDtoConversion>
    {
        public CardController(ICardDtoConversion service) : base(service)
        {
        }
    }
}
