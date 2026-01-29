using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class FilterRequest<T>
    {
        public string CategoryName { get; set; }
        public string CategoryDisplayName { get; set; }
        public string FilterType { get; set; }
        public List<T> Source { get; set; } = new();
        public Func<T, string> ItemIdSelector { get; set; }
        public Func<T, string> ItemKeySelector { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsVisible { get; set; } = true;
    }
}
