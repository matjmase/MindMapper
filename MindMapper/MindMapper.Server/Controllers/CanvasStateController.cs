using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMapper.Data.Models;
using MindMapper.Server.Common.Roles;
using MindMapper.Server.Controllers.Base;
using MindMapper.Server.DtoModels.CanvasStateDto;
using MindMapper.Server.Services.Dto.Interface;

namespace MindMapper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CanvasStateController : BaseDtoController<CanvasState, CanvasStateDto, CanvasStateSearch, ICanvasStateDtoConversion>
    {
        public CanvasStateController(ICanvasStateDtoConversion service) : base(service)
        {
        }
    }
}
