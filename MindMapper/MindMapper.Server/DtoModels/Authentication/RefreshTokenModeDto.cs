namespace MindMapper.Server.DtoModels.Authentication
{
    public class RefreshTokenModeDto
    {
        public string ExpiredJwt { get; set; }
        public string Refresh { get; set; }
    }
}
