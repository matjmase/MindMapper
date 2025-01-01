using MindMapper.Data.Models;

namespace MindMapper.Server.DtoModels.CompositeCanvasStateDto
{
    public class CompositeCanvasStateDtoRequest
    {
        public CanvasStateDto.CanvasStateDto Canvas { get; set; } 
        public NaiveCardDto[] Cards { get; set; }   
        public NaiveOptionDto[] Options { get; set; }   
    }
}
