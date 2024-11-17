using MindMapper.Data.Models.Application;

namespace MindMapper.Server.DtoModels.Authentication
{
    public class PrimaryUserDto
    {
        public string Email { get; set; }
        public string UserName { get; set; }

        public static PrimaryUserDto ToDto(ApplicationUser user)
        {
            return new PrimaryUserDto
            {
                Email = user.Email,
                UserName = user.UserName,
            };
        }
    }
}
