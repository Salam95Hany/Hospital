using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class FormDropdownModel
    {
        public string? Value { get; set; }
        public string? Name { get; set; }
        public bool IsSelected { get; set; } = false;
        public Dictionary<string, object> ExtraData { get; set; } = new();
    }
}
