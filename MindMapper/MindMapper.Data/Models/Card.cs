using MindMapper.Data.Models.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MindMapper.Data.Models
{
    public class Card : BaseIdEntityModel
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public int Top { get; set; }
        public int Left { get; set; }

        public Guid? CanvasStateId { get; set; }
        [ForeignKey(nameof(CanvasStateId))]
        public virtual CanvasState? CanvasState { get; set; }


        [InverseProperty(nameof(Option.Card))]
        public virtual ICollection<Option> ChildOptions { get; set; }


        [InverseProperty(nameof(Option.PointToCard))]
        public virtual ICollection<Option> PointingOptions { get; set; }
    }
}
