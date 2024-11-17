using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMapper.Server.DtoModels.Base;
using MindMapper.Server.Services.Dto.Base;

namespace MindMapper.Server.Controllers.Base
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseDtoController<TEntity, TDto, TSearch, TDtoService> : BaseClaimsController
        where TSearch : IEntitySearch<TEntity>, new()
        where TDto : IDtoModel<TEntity, TDto>, new()
        where TDtoService : IDtoConversion<TDto, TEntity, TSearch>
    {
        private TDtoService _service;

        public BaseDtoController(TDtoService service)
        {
            _service = service;
        }

        [HttpGet]
        public IEnumerable<TDto> GetAll()
        {
            return _service.Get(GetUserId(), GetRoles());
        }

        [HttpGet("{id:guid}")]
        public async Task<TDto?> GetById(Guid id)
        {
            return await _service.GetById(id.ToString(), GetUserId(), GetRoles());
        }

        [HttpGet("search")]
        public IEnumerable<TDto> GetBySearch([FromQuery] TSearch? search)
        {
            search = search ?? new TSearch();

            return _service.GetBySearch(search, GetUserId(), GetRoles());
        }

        [HttpPost]
        public async Task<TDto> Post(TDto dtoObject)
        {
            return await _service.Add(dtoObject, GetUserId(), GetRoles());
        }

        [HttpPut]
        public async Task<TDto> Put(TDto dtoObject)
        {
            return await _service.Update(dtoObject, GetUserId(), GetRoles());
        }

        [HttpDelete]
        public async Task Delete(TDto dtoObject)
        {
            await _service.Remove(dtoObject, GetUserId(), GetRoles());
        }
    }
}
