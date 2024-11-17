using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMapper.Data.Models;
using MindMapper.Server.Common.Roles;
using MindMapper.Server.Controllers.Base;
using MindMapper.Server.DtoModels.OptionDto;
using MindMapper.Server.Services.Dto.Interface;

namespace MindMapper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OptionController : BaseDtoController<Option, OptionDto, OptionSearch, IOptionDtoConversion>
    {
        public OptionController(IOptionDtoConversion service) : base(service)
        {
        }
    }
}
