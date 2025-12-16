using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.Interface
{
    public interface IPDFHelper
    {
        string SaveHTMLResult(string HTML);
    }
}
