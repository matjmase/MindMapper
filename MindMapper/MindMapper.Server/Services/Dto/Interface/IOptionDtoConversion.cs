using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.OptionDto;
using MindMapper.Server.Services.Dto.Base;

namespace MindMapper.Server.Services.Dto.Interface
{
    public interface IOptionDtoConversion : IDtoConversion<OptionDto, Option, OptionSearch>
    {
    }
}
