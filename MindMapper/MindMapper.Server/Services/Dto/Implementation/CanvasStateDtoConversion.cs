using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.CanvasStateDto;
using MindMapper.Server.Services.Dto.Base;
using MindMapper.Server.Services.Dto.Interface;
using MindMapper.Server.Services.Repository.Interface;

namespace MindMapper.Server.Services.Dto.Implementation
{
    public class CanvasStateDtoConversion : DtoConversion<CanvasStateDto, CanvasState, CanvasStateSearch, ICanvasStateRepository>, ICanvasStateDtoConversion
    {
        public CanvasStateDtoConversion(ICanvasStateRepository repository) : base(repository)
        {
        }
    }
}
