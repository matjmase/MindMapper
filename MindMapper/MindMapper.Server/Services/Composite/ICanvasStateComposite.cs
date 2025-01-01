using MindMapper.Data.Roles;
using MindMapper.Server.DtoModels.CompositeCanvasStateDto;

namespace MindMapper.Server.Services.Composite
{
    public interface ICanvasStateComposite
    {
        public Task<CompositeCanvasStateDtoResponse?> GetById(string entityId, string userId, HashSet<ApplicationUserRole> roles);
        public Task<CompositeCanvasStateDtoResponse> Add(CompositeCanvasStateDtoRequest addDto, string userId, HashSet<ApplicationUserRole> roles);
        public Task<CompositeCanvasStateDtoResponse> Update(CompositeCanvasStateDtoRequest updateDto, string userId, HashSet<ApplicationUserRole> roles);
    }
}
