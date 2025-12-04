using Hospital.Entities.Reports;
using Hospital.Reports.Interface;
using Hospital.Reports.Model;
using Microsoft.AspNetCore.Hosting;
using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.PdfTemplate
{
    public class TestPdfTempGenerator: IReportGenerator
    {
        private readonly IWebHostEnvironment _environment;
        public ReportType ReportType => ReportType.TestReportPdf;

        public TestPdfTempGenerator(IWebHostEnvironment environment)
        {
            _environment = environment;
        }


        public async Task<string> Generate(SearchReportModel Model)
        {
            var FullPath = Path.Combine(_environment.WebRootPath, "ExportFiles", "UrologyReport" + ".pdf"); // path for saving file in wwwroot folder
            var ImgPath = Path.Combine(_environment.WebRootPath, "Template", "ZayirAlkhayrLogo2.jpeg"); // path for logo
            //var DT = await _beneFactorService.GetExportBeneFactorsData(Model.FilterItems); // call template data

            var document = Document.Create(container =>
            {
                container
                .Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(20);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontFamily("Times New Roman").FontSize(14));
                    page.Content().Column(column =>
                    {
                        column.Spacing(5);

                        // Header
                        column.Item().Row(row =>
                        {
                            // left
                            row.RelativeItem(1).AlignCenter().Column(col =>
                            {
                                col.Item().Text("Al-Azhar").FontSize(18).Bold().AlignCenter();
                                col.Item().Text("Urology Department").FontSize(16).AlignCenter();
                            });

                            // center logo circle
                            //row.ConstantItem(120).AlignCenter().Column(col =>
                            //{
                            //    col.Item().AlignCenter().Image(ImgPath, ImageScaling.FitArea);
                            //});

                            // right
                            row.RelativeItem(1).AlignCenter().Column(col =>
                            {
                                col.Item().Text("Patients' Database").FontSize(18).Bold().AlignCenter();
                                col.Item().Text("Intervention Report").FontSize(16).AlignCenter();
                            });
                        });

                        // Row 1
                        column.Item().Element(c => ComposeFormRow(c,
                            leftWeight: 3, leftText: "الرقم القومي",
                            midWeight: 1, midText: "السن",
                            rightWeight: 3, rightText: "الاسم", rightFull: true));

                        // Row 2
                        column.Item().Element(c => ComposeFormRow(c,
                            leftWeight: 1, leftText: "رقم ملف المستشفى",
                            midWeight: 1, midText: "تاريخ الدخول",
                            rightWeight: 1, rightText: "الرقم الداخلي", rightFull: true));

                        // C/O full row
                        column.Item().Element(c => ComposeFullRow(c, "C/O"));

                        // Duration centered box
                        column.Item().Element(c => ComposeCenterBox(c, "Duration"));

                        // Provisional Diagnosis
                        column.Item().Element(c => ComposeSectionTitle(c, "Provisional Diagnosis"));

                        // Row 3
                        column.Item().Element(c => ComposeFormRow(c,
                            leftWeight: 1, leftText: "Date of intervention",
                            midWeight: 1, midText: "Theatre",
                            rightWeight: 2, rightText: "Main Surgeon"));

                        // Assistants full row
                        column.Item().Element(c => ComposeFullRow(c, "Assistants"));

                        // Row 4
                        column.Item().Element(c => ComposeFormRow(c,
                            leftWeight: 1, leftText: "Resident",
                            midWeight: 1, midText: "Other Surgeons",
                            rightWeight: 1, rightText: "Off-field supervisor", rightFull: true));

                        // Anaesthesia center box
                        column.Item().Element(c => ComposeCenterBox(c, "Anaesthesia"));

                        // Intervention section title
                        column.Item().Element(c => ComposeSectionTitle(c, "Intervention"));

                        // Intervention details (large text area)
                        column.Item().Element(c => ComposeLargeTextArea(c, "Intervention Details"));

                        // Tubes Fixed full row
                        column.Item().Element(c => ComposeFullRow(c, "Tubes Fixed"));

                        // Row 5
                        column.Item().Element(c => ComposeFormRow(c,
                            leftWeight: 1, leftText: "Category",
                            midWeight: 1, midText: "Approach",
                            rightWeight: 1, rightText: "Organ", rightFull: true));

                        // Intra-operative Course full row
                        column.Item().Element(c => ComposeFullRow(c, "Intra-operative Course"));

                        // Details of the intra-op adverse events (medium)
                        column.Item().Element(c => ComposeMediumTextArea(c, "Details of the intra-op adverse events"));

                        // Blood transfusion center box
                        column.Item().Element(c => ComposeCenterBox(c, "Blood transfusion"));

                        // Post-op Recommendations last section
                        column.Item().Element(c => ComposeLastSection(c, "Post-op Recommendations"));

                    });
                });
            });

            document.GeneratePdf(FullPath);

            return FullPath;
        }

        void ComposeFormRow(IContainer container,
            int leftWeight, string leftText,
            int midWeight, string midText,
            int rightWeight, string rightText,
            bool rightFull = false)
        {
            container.Row(row =>
            {
                row.RelativeItem(leftWeight).Element(c => ComposeCell(c, leftText, minHeight: 30));

                // small gap
                row.Spacing(5);

                row.RelativeItem(midWeight).Element(c => ComposeCell(c, midText, minHeight: 30));

                row.Spacing(5);

                // If rightFull true we give it larger available space (but here weights control widths)
                row.RelativeItem(rightWeight).Element(c => ComposeCell(c, rightText, minHeight: 30));
            });
        }

        void ComposeCell(IContainer container, string text, int minHeight = 30)
        {
            container.Padding(5).Border(1).MinHeight(minHeight).AlignMiddle().Text(text).FontSize(14);
        }

        void ComposeFullRow(IContainer container, string text)
        {
            container.Padding(5).Border(1).MinHeight(30).Text(text).FontSize(14);
        }

        void ComposeSectionTitle(IContainer container, string text)
        {
            // خلفية تقريبية للون #F5DEB3 (Wheat)
            container.Background(Colors.Grey.Lighten4).Padding(5).Border(1).MinHeight(30).Text(text).Bold().FontSize(14);
            // ملاحظة: لتلوين مطابق بدقة استخدم لون مخصص (تحت)
            // container.Background(new QuestPDF.Drawing.Color(245/255f,222/255f,179/255f));
        }

        void ComposeLargeTextArea(IContainer container, string text)
        {
            container.Padding(10).Border(1).MinHeight(200).Text(text).FontSize(14);
        }

        void ComposeMediumTextArea(IContainer container, string text)
        {
            container.Padding(10).Border(1).MinHeight(80).Text(text).FontSize(14);
        }

        void ComposeCenterBox(IContainer container, string text)
        {
            container.AlignCenter().Padding(5).Element(c =>
            {
                c.Width(255).Border(1).Padding(5).MinHeight(30).AlignCenter().Text(text).FontSize(14);
            });
        }

        void ComposeLastSection(IContainer container, string text)
        {
            container.Padding(10).Border(1).MinHeight(100).Background(Colors.Grey.Lighten4).Text(text).Bold().FontSize(14);
        }
    }
}
