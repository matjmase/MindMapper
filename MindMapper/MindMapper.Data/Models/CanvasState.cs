using MindMapper.Data.Models.Application;
using MindMapper.Data.Models.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MindMapper.Data.Models
{
    public class CanvasState : BaseIdEntityModel
    {
        public string Name { get; set; }
        public double Scale { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }

        public Guid? SeedCardId { get; set; }
        [ForeignKey(nameof(SeedCardId))]
        public virtual Card? SeedCard { get; set; }

        [InverseProperty(nameof(Card.CanvasState))]
        public virtual ICollection<Card> Cards { get; set; }

    }
}
