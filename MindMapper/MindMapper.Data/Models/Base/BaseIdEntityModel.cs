using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MindMapper.Data.Models.Application;

namespace MindMapper.Data.Models.Base
{
    public abstract class BaseIdEntityModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public string? CreatedByUserId { get; set; }
        [ForeignKey(nameof(CreatedByUserId))]
        public virtual ApplicationUser? CreatedByUser { get; set; }

        public string? UpdatedByUserId { get; set; }
        [ForeignKey(nameof(UpdatedByUserId))]
        public virtual ApplicationUser? UpdatedByUser { get; set; }
    }
}
