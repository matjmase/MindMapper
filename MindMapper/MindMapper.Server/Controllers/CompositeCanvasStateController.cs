using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMapper.Server.Controllers.Base;
using MindMapper.Server.DtoModels.CompositeCanvasStateDto;
using MindMapper.Server.Services.Composite;

namespace MindMapper.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CompositeCanvasStateController : BaseClaimsController
    {
        private ICanvasStateComposite _service;

        public CompositeCanvasStateController(ICanvasStateComposite service)
        {
            _service = service; 
        }

        [HttpGet("{id:guid}")]
        public async Task<CompositeCanvasStateDtoResponse?> GetById(Guid id)
        {
            return await _service.GetById(id.ToString(), GetUserId(), GetRoles());
        }

        [HttpPost]
        public async Task<CompositeCanvasStateDtoResponse> Post(CompositeCanvasStateDtoRequest dtoObject)
        {
            return await _service.Add(dtoObject, GetUserId(), GetRoles());
        }

        [HttpPut]
        public async Task<CompositeCanvasStateDtoResponse> Put(CompositeCanvasStateDtoRequest dtoObject)
        {
            return await _service.Update(dtoObject, GetUserId(), GetRoles());
        }
    }
}
