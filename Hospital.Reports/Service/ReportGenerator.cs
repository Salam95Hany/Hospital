using Hospital.Reports.Interface;
using Hospital.Reports.Model;
using RazorLight;
using System.Text;

namespace Hospital.Reports.Service
{
    public abstract class ReportGenerator
    {
        public abstract ReportType ReportType { get; }
        private readonly IRazorLightEngine _razorEngine;
        private readonly IPDFHelper _pDFHelper;

        protected ReportGenerator(IRazorLightEngine razorEngine, IPDFHelper pDFHelper)
        {
            _razorEngine = razorEngine;
            _pDFHelper = pDFHelper;
        }

        public async Task<string> Build(object Model)
        {
            try
            {
                var html = await _razorEngine.CompileRenderAsync(ReportType.ToString(), Model);
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
