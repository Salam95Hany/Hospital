using Hospital.Reports.Interface;
using iText.Html2pdf;
using iText.Kernel.Pdf;
using iText.Kernel.Colors;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Font;
using iText.Layout.Font;
using iText.Kernel.Geom;
using iText.Layout;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Hospital.Reports.Service
{
    public class PDFHelper : IPDFHelper
    {
        private readonly IWebHostEnvironment _environment;
        private readonly PdfFont _pdfFont;

        public PDFHelper(IWebHostEnvironment environment)
        {
            _environment = environment;
            var fontPath = System.IO.Path.Combine(_environment.WebRootPath, "Fonts", "Cairo-Regular.ttf");
            _pdfFont = PdfFontFactory.CreateFont(fontPath, iText.IO.Font.PdfEncodings.IDENTITY_H);
        }

        public string SaveHTMLResult(string HTMLContent)
        {
            try
            {
                HTMLContent = ClearAngularAttrFromHTML(HTMLContent);
                var FolderPath = System.IO.Path.Combine(_environment.WebRootPath, "Reports");

                if (!Directory.Exists(FolderPath))
                    Directory.CreateDirectory(FolderPath);

                var FilePath = System.IO.Path.Combine(FolderPath, "Report_" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".pdf");
                ConvertHtmlToPdf(HTMLContent, FilePath);

                return FilePath;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void ConvertHtmlToPdf(string HTMLContent, string outputPath)
        {
            try
            {
                var html = @"
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset='UTF-8'>
                            <style>
                                @page {
                                    size: A4;
                                    margin: 5px !important;
                                    padding: 0 !important;
                                }
                                html, body {
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    width: 100%;
                                    height: 100%;
                                }
                                * {
                                    box-sizing: border-box;
                                    margin: 0;
                                    padding: 0;
                                }
                                body {
                                    -webkit-print-color-adjust: exact;
                                    print-color-adjust: exact;
                                }
                            </style>
                        </head>
                        <body>
                            {HTMLContent}
                        </body>
                        </html>";
                HTMLContent = html.Replace("{HTMLContent}", HTMLContent);
                string tempFile = System.IO.Path.GetTempFileName();
                WriterProperties writerProperties = new WriterProperties().SetFullCompressionMode(true);
                using (FileStream pdfStream = new FileStream(tempFile, FileMode.Create, FileAccess.Write, FileShare.None))
                using (PdfWriter writer = new PdfWriter(pdfStream, writerProperties))
                using (PdfDocument pdfDocument = new PdfDocument(writer))
                {
                    FontProvider fontProvider = new FontProvider();
                    fontProvider.AddFont(_pdfFont.GetFontProgram());
                    fontProvider.AddFont(System.IO.Path.Combine(_environment.WebRootPath, "Fonts", "Cairo-Black.ttf"));
                    ConverterProperties properties = new ConverterProperties();
                    properties.SetCharset("UTF-8");
                    properties.SetFontProvider(fontProvider);
                    Document document = HtmlConverter.ConvertToDocument(HTMLContent, pdfDocument, properties);
                    document.SetMargins(0, 0, 0, 0);
                    document.Close();
                }
                using (PdfReader reader = new PdfReader(tempFile))
                using (PdfWriter finalWriter = new PdfWriter(outputPath))
                using (PdfDocument finalPdfDocument = new PdfDocument(reader, finalWriter))
                {
                    finalPdfDocument.Close();
                }
                File.Delete(tempFile);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public string ClearAngularAttrFromHTML(string HTML)
        {
            try
            {
                if (string.IsNullOrEmpty(HTML))
                    return HTML;

                HTML = Regex.Replace(HTML, "( _nghost-ng-cli-universal-c| _ngcontent-ng-cli-universal-c)[1-9]*=\"\"", "");
                HTML = Regex.Replace(HTML, "<!--([a-z]+)(?![^>]*\\/>)[^>]*-->", "");
                HTML = Regex.Replace(HTML, @"\s_ngcontent-[a-zA-Z0-9\-]+?=""[^""]*""", "");
                HTML = HTML.Replace("&#x27;", "");

                return HTML;
            }
            catch (Exception)
            {
                return HTML;
            }
        }
    }
}
