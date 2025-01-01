namespace MindMapper.Server.DtoModels.CompositeCanvasStateDto
{
    public class CompositeCanvasStateDtoResponse
    {
        public CanvasStateDto.CanvasStateDto Canvas { get; set; }
        public IEnumerable<CardDto.CardDto> Cards { get; set; }
        public IEnumerable<OptionDto.OptionDto> Options { get; set; }
    }
}
