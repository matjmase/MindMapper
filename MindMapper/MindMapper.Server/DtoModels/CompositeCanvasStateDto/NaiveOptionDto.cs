namespace MindMapper.Server.DtoModels.CompositeCanvasStateDto
{
    public class NaiveOptionDto : OptionDto.OptionDto
    {
        public int NaiveCardId { get; set; }    
        public int? NaivePointToCardId { get; set; }
    }
}
