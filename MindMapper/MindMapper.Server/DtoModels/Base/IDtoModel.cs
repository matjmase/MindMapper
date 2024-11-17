namespace MindMapper.Server.DtoModels.Base
{
    public interface IDtoModel<TDbEntity, tDtoResponse>
    {
        public string? Id { get; set; }
        public TDbEntity ToDbModel(string userId);
        public tDtoResponse ToResponse(TDbEntity entity);
    }
}
