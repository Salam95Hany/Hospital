using Hospital.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications.Attachments
{
    public class AttachmentByActionIdSpecification : BaseSpecification<Attachment>
    {
        public AttachmentByActionIdSpecification(int ActionId, int ActionTypeId) : base(i => i.ActionId == ActionId && i.ActionTypeId == ActionTypeId)
        {

        }
    }
}
