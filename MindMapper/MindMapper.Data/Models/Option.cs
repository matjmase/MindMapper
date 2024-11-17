using MindMapper.Data.Models.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MindMapper.Data.Models
{
    public class Option : BaseIdEntityModel
    {
        public string Text { get; set; }

        public Guid CardId { get; set; }

        [ForeignKey(nameof(CardId))]
        public virtual Card Card { get; set; }

        public Guid? PointToCardId { get; set; }

        [ForeignKey(nameof(PointToCardId))]
        public virtual Card? PointToCard { get; set; }

    }
}
