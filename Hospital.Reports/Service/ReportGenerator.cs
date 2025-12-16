using Hospital.Reports.Interface;
using Hospital.Reports.Model;
using RazorLight;
using System.Text;

namespace Hospital.Reports.Service
{
    public abstract class ReportGenerator
    {
        private readonly IRazorLightEngine _razorEngine;
        private readonly IPDFHelper _pDFHelper;
        public ReportType ReportType { get; set; }

        protected ReportGenerator(IRazorLightEngine razorEngine, IPDFHelper pDFHelper)
        {
            _razorEngine = razorEngine;
            _pDFHelper = pDFHelper;
        }

        public string Build(object Model)
        {
            try
            {
                var html = _razorEngine.CompileRenderAsync($"{ReportType.ToString()}.cshtml", Model).GetAwaiter().GetResult();
                var FilePath = _pDFHelper.SaveHTMLResult(html);
                return FilePath;
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}
