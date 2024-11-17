using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.CanvasStateDto;
using MindMapper.Server.Services.Dto.Base;

namespace MindMapper.Server.Services.Dto.Interface
{
    public interface ICanvasStateDtoConversion : IDtoConversion<CanvasStateDto, CanvasState, CanvasStateSearch>
    {
    }
}
