using MindMapper.Data.Models;
using MindMapper.Server.DtoModels.CardDto;
using MindMapper.Server.DtoModels.OptionDto;
using MindMapper.Server.Services.Dto.Base;
using MindMapper.Server.Services.Dto.Interface;
using MindMapper.Server.Services.Repository.Interface;

namespace MindMapper.Server.Services.Dto.Implementation
{
    public class OptionDtoConversion : DtoConversion<OptionDto, Option, OptionSearch, IOptionRepository>, IOptionDtoConversion
    {
        public OptionDtoConversion(IOptionRepository repository) : base(repository)
        {
        }
    }
}
