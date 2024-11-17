
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MindMapper.Data.Models.Application
{
    public class ApplicationUser : IdentityUser
    {
        [InverseProperty(nameof(CanvasState.CreatedByUser))]
        public virtual ICollection<CanvasState> CanvasStates { get; set; }

        [InverseProperty(nameof(Card.CreatedByUser))]
        public virtual ICollection<Card> Cards { get; set; }

        [InverseProperty(nameof(Option.CreatedByUser))]
        public virtual ICollection<Option> Options { get; set; }
    }
}
