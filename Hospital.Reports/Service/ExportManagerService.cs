using Hospital.Entities.Reports;
using Hospital.Reports.Interface;
using Microsoft.AspNetCore.Hosting;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Reports.Service
{
    public class ExportManagerService : IExportManagerService
    {
        private readonly IWebHostEnvironment _environment;
        public ExportManagerService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public string Export(ExportTemplateBase exportTemplateBase, DataTable data)
        {
            var localPath = GetLocalPath(exportTemplateBase.TemplateName, ".xlsx");
            Export(localPath, data, _environment, exportTemplateBase);
            return GetDownloadUrl(Path.GetFileName(localPath));
        }

        public void Export(string fullPath, DataTable data, IWebHostEnvironment hostingEnvironment, ExportTemplateBase exportTemplateBase)
        {
            int startrow = 5;
            try
            {
                var temp = new FileInfo(Path.Combine(hostingEnvironment.WebRootPath, @"Template\", "UrologyTemplate.xlsx"));
                ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
                using (var package = new ExcelPackage(new FileInfo(fullPath), temp))
                {
                    var sheet = package.Workbook.Worksheets["Sheet1"];
                    var worksheet = package.Workbook.Worksheets.Add("RightToLeft");
                    WriteHeader(sheet, data.Columns.Cast<DataColumn>().Select(e => e.ColumnName).ToList());
                    for (var i = 0; i < data.Rows.Count; ++i)
                    {
                        WriteRow(sheet, data.Rows[i].ItemArray, startrow);
                        startrow++;
                    }
                    var substitutionValue = exportTemplateBase.SubstitutionDictionary();
                    SetTemplateValues(ref sheet, substitutionValue);
                    worksheet.View.RightToLeft = true;
                    package.Save();
                }
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
            }
        }

        private void WriteRow(ExcelWorksheet worksheet, IList<object> values, int rowId)
        {
            ExcelRange cells = worksheet.Cells[rowId, 1, rowId, values.Count];
            cells.Style.Font.Name = "Arial";
            cells.Style.Font.Size = 12;
            cells.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            cells.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            try
            {
                for (var i = 0; i < values.Count; i++)
                {
                    worksheet.Cells[rowId, i + 1].Value = values[i];
                }
            }
            catch (Exception ex)
            { }
        }

        private void SetTemplateValues(ref ExcelWorksheet worksheet, Dictionary<string, string> substitutionValue)
        {
            var TimeCell = worksheet.Cells[2, 10];
            TimeCell.Value = "Exported At : " + DateTime.Now.ToString("dddd d MMMM , yyyy");
            var ByCell = worksheet.Cells[3, 10];
            ByCell.Value = "Exported By : " + substitutionValue["UserName"];
            var IsValidSheetName = substitutionValue.TryGetValue("SheetName", out string sheetName);
            worksheet.Name = IsValidSheetName && !string.IsNullOrEmpty(sheetName) ? sheetName : "Sheet1";
        }

        private void WriteHeader(ExcelWorksheet worksheet, IList<string> headers)
        {
            try
            {
                for (var i = 0; i < headers.Count; i++)
                {
                    var headerValue = headers[i];
                    var headerCell = worksheet.Cells[4, i + 1];
                    headerCell.Value = headerValue;
                    headerCell.AutoFitColumns(20);
                }
                ExcelRange cells = worksheet.Cells[4, 1, 4, headers.Count];
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetDownloadUrl(string FileName)
        {
            string URL = Path.Combine(_environment.WebRootPath, "Reports", FileName);
            return URL;
        }
        private string GetLocalPath(string fileTitle, string extension)
        {
            string WEBurl = Path.Combine(_environment.WebRootPath, @"Reports\", $"{fileTitle}_{DateTime.Now:yyyyMMddHHmmssfff}{extension}");
            return WEBurl;
        }

        public List<string> GetMainSurgeons(string filePath)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            var result = new List<string>();

            using (var package = new ExcelPackage(new FileInfo(filePath)))
            {
                var sheet = package.Workbook.Worksheets[0];
                int totalRows = sheet.Dimension.Rows;
                int totalColumns = sheet.Dimension.Columns;

                // Define ALL the columns we want to extract doctors from
                var targetColumnHeaders = new List<string>
        {
            "Main Surgeon",
            "Assistants",
            "Resident",
            "Off-field supervisor"
        };

                // Find column indices for ALL target columns
                var columnIndices = new List<int>();

                for (int col = 1; col <= totalColumns; col++)
                {
                    var header = sheet.Cells[1, col].Text.Trim();
                    if (targetColumnHeaders.Contains(header))
                    {
                        columnIndices.Add(col);
                    }
                }

                // If no columns found, throw exception
                if (!columnIndices.Any())
                    throw new Exception("No doctor columns found in sheet!");

                // Extract data from ALL found columns
                foreach (int colIndex in columnIndices)
                {
                    for (int row = 2; row <= totalRows; row++)
                    {
                        var doctorName = sheet.Cells[row, colIndex].Text.Trim();
                        if (!string.IsNullOrEmpty(doctorName))
                        {
                            result.Add(doctorName);
                        }
                    }
                }
            }

            // Remove duplicates while preserving order
            return result.Distinct().ToList();
        }

        public List<(string DoctorName, string AcademicDegree)> GetDoctorsWithRoles(string filePath)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var result = new List<(string, string)>();

            using (var package = new ExcelPackage(new FileInfo(filePath)))
            {
                var sheet = package.Workbook.Worksheets[0]; // Use index 1 for first sheet

                if (sheet.Dimension == null) return result;

                // Define column mappings: Excel header -> AcademicDegree value
                var columnMapping = new Dictionary<string, string>
                {
                    ["Main Surgeon"] = "Main Surgeon",
                    ["Assistants"] = "Assistant",
                    ["Resident"] = "Resident",
                    ["Off-field supervisor"] = "Supervisor"
                };

                // Scan first row for headers
                for (int col = 1; col <= sheet.Dimension.Columns; col++)
                {
                    var header = sheet.Cells[1, col].Text.Trim();

                    if (columnMapping.TryGetValue(header, out string academicDegree))
                    {
                        // Collect all non-empty names in this column
                        for (int row = 2; row <= sheet.Dimension.Rows; row++)
                        {
                            var doctorName = sheet.Cells[row, col].Text.Trim();
                            if (!string.IsNullOrEmpty(doctorName))
                            {
                                result.Add((doctorName, academicDegree));
                            }
                        }
                    }
                }
            }

            return result;
        }
    }
}
