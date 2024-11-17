using MindMapper.Data.Models.Application;

namespace MindMapper.Server.DtoModels.Authentication
{
    public class RegisterModelDto : LoginModelDto
    {
        public string UserName { get; set; }

        public ApplicationUser ToDbModel()
        {
            return new ApplicationUser { UserName = UserName, Email = Email };
        }
    }
}
