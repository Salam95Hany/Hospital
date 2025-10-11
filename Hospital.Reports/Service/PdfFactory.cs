using Hospital.Entities.Reports;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.Service
{
    public static class PdfFactory
    {
        public static void AddHeaderContent(this IContainer Container, string ImgPath, string Header, string HeaderDetails)
        {
            Container.Column(col =>
            {
                col.Item().BackgroundLinearGradient(135,
                    new Color[]
                    {
                    Color.FromHex("#2d5016"),
                    Color.FromHex("#4a7c23")
                    }).Padding(5).Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("مؤسسة زائر الخیر")
                                .FontSize(24)
                                .Bold()
                                .FontColor(Colors.White);

                            c.Item().Text("المشھرة برقم 2424 لسنة 2424")
                                .FontSize(14)
                                .FontColor(Colors.White.WithAlpha(0.9f));

                            c.Item().Text("تحت رعایة وزارة التضامن الاجتماعي")
                                .FontSize(14)
                                .FontColor(Colors.White.WithAlpha(0.9f));
                        });

                        row.ConstantItem(70)
                           .Height(70)
                           .Width(70)
                           .Border(3, Colors.White.WithAlpha(0.3f))
                           .CornerRadius(35)
                           .AlignCenter()
                           .Image(ImgPath, ImageScaling.FitArea);
                    });

                col.Item().PaddingVertical(5).AlignCenter().Width(250).Element(container2 =>
                {
                    container2
                        .BorderRight(5)
                        .BorderLeft(5)
                        .BorderColor(Color.FromHex("#4a7c23"))
                        .BackgroundLinearGradient(
                            135,
                            new[]
                            {
                            Color.FromHex("#f8fdf8"),
                            Color.FromHex("#e8f5e8")
                            })
                        .CornerRadius(12)
                        .AlignCenter()
                        .Column(inner =>
                        {
                            inner.Item().Text(Header)
                                .FontSize(28)
                                .Bold()
                                .FontColor(Color.FromHex("#2d5016"))
                                .AlignCenter();

                            inner.Item().Text(HeaderDetails)
                                .FontSize(16)
                                .FontColor(Color.FromHex("#4a7c23"))
                                .AlignCenter();
                        });
                });
            });
        }

        public static void AddTableContent(this IContainer Container, DataTable dt, List<PDFHeaderSelected> HeaderNames)
        {
            Container.Column(col =>
            {
                col.Item().PaddingVertical(5).MaxHeight(620).Table(tbl =>
                {
                    IContainer DefaultCellStyle(IContainer container, string backgroundColor)
                    {
                        return container
                            .Border(1)
                            .BorderColor(Colors.Grey.Lighten1)
                            .Background(backgroundColor)
                            .PaddingVertical(5)
                            .PaddingHorizontal(5);
                    }

                    tbl.ColumnsDefinition(columns =>
                    {
                        for (int i = 0; i < HeaderNames.Count; i++)
                            columns.RelativeColumn();
                    });

                    tbl.Header(header =>
                    {
                        foreach (var name in HeaderNames)
                        {
                            header.Cell().Element(HeaderCellStyle).Text(name.NameAr);
                        }
                        IContainer HeaderCellStyle(IContainer container) => container
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .BackgroundLinearGradient(
                            135,
                            new[]
                            {
                                Color.FromHex("#f8fdf8"),
                                Color.FromHex("#e8f5e8")
                            })
                        .PaddingVertical(5)
                        .PaddingHorizontal(5);
                    });
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        foreach (var column in HeaderNames)
                        {
                            var cellValue = dt.Rows[i][column.NameEn]?.ToString() ?? "";
                            tbl.Cell().Element(CellStyle).ShowEntire().Text(cellValue);
                        }
                    }

                    IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.White).ShowOnce();
                });
            });
        }

        public static void AddFooterContent(this IContainer Container)
        {
            string currentDate = DateTime.Now.ToString("d MMMM , yyyy hh:mm t", new CultureInfo("ar-AE"));

            Container.Height(25).BackgroundLinearGradient(135,
                    new Color[]
                    {
                    Color.FromHex("#2d5016"),
                    Color.FromHex("#4a7c23")
                    }).PaddingVertical(5)
                .Row(row =>
                {
                    row.RelativeItem().PaddingLeft(70).AlignLeft().Text(text =>
                    {
                        text.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.White));
                        text.Span("📄 الصفحة ");
                        text.CurrentPageNumber();
                        text.Span(" من ");
                        text.TotalPages();
                    });

                    row.RelativeItem();
                    row.RelativeItem();

                    row.RelativeItem().PaddingRight(20).AlignRight().Text(text =>
                    {
                        text.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.White));
                        text.Span(" 📅 " + currentDate);
                    });
                });
        }
    }
}
