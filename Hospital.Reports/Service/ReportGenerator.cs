using Hospital.Reports.Model;
using iText.Kernel.Pdf;
using iText.Forms;
using iText.Forms.Fields;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ICU4N.Text;
using System.Threading.Tasks;
using iText.IO.Font;
using iText.Kernel.Font;
using Microsoft.Extensions.Hosting;
using iText.Kernel.Pdf.Canvas;

namespace Hospital.Reports.Service
{
    public abstract class ReportGenerator
    {
        static ReportGenerator()
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }
        public ReportType ReportType { get; set; }


        public string Build(string RootPath, string TemplateName, Dictionary<string, string> FieldsValue)
        {
            try
            {
                var FontPath = Path.Combine(RootPath, "Fonts", "Cairo-Regular.ttf");
                string templatePath = Path.Combine(RootPath, "Template", TemplateName);
                string outputFolder = Path.Combine(RootPath, "ExportFiles");

                if (!Directory.Exists(outputFolder))
                    Directory.CreateDirectory(outputFolder);

                string outputFileName = $"AdmissionTemp_{Guid.NewGuid()}.pdf";

                string outputFullPath = Path.Combine(outputFolder, outputFileName);

                using (PdfReader reader = new PdfReader(templatePath))
                using (PdfWriter writer = new PdfWriter(outputFullPath))
                using (PdfDocument pdfDoc = new PdfDocument(reader, writer))
                {
                    PdfFont Font = PdfFontFactory.CreateFont(FontPath, PdfEncodings.IDENTITY_H, pdfDoc);
                    PdfAcroForm form = PdfAcroForm.GetAcroForm(pdfDoc, true);

                    foreach (var kvp in FieldsValue)
                    {
                        var field = form.GetField(kvp.Key);
                        if (field != null)
                        {
                            field.SetFont(Font);
                            field.SetFontSize(10);
                            field.SetValue(kvp.Value);
                        }
                    }

                    pdfDoc.Close();
                }

                return outputFullPath;
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}
