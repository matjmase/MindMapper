namespace MindMapper.Server.DtoModels.Authentication
{
    public class SessionModelDto
    {
        public string Jwt { get; set; }
        public string Refresh { get; set; }

        public PrimaryUserDto PrimaryUser { get; set; }
    }
}
