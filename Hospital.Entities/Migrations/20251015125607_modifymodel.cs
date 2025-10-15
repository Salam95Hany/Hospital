using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hospital.Entities.Migrations
{
    /// <inheritdoc />
    public partial class modifymodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PatientRemarks",
                table: "FollowUps",
                newName: "PatientRemarksStatus");

            migrationBuilder.RenameColumn(
                name: "LabResults",
                table: "Admissions",
                newName: "UrineAnalysis");

            migrationBuilder.RenameColumn(
                name: "ImagingResults",
                table: "Admissions",
                newName: "Ultrasound");

            migrationBuilder.AddColumn<string>(
                name: "OffFieldSupervisor",
                table: "SurgicalInterventions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OtherSurgeons",
                table: "SurgicalInterventions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NationalIdImagePath",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CT",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CultureAndSensitivity",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "FastingBloodSugar",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "HbA1c",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Hemoglobin",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IsotopeStudies",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LiverEnzymes",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MRI",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OtherImaging",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OtherLabResults",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "PSAFree",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PSARatio",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PSATotal",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PT_PTT_INR",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PUT",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Platelets",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PostPrandialBloodSugar",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SerumCreatinine",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TRUS",
                table: "Admissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalLeukocyteCount",
                table: "Admissions",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OffFieldSupervisor",
                table: "SurgicalInterventions");

            migrationBuilder.DropColumn(
                name: "OtherSurgeons",
                table: "SurgicalInterventions");

            migrationBuilder.DropColumn(
                name: "NationalIdImagePath",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "CT",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "CultureAndSensitivity",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "FastingBloodSugar",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "HbA1c",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "Hemoglobin",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "IsotopeStudies",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "LiverEnzymes",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "MRI",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "OtherImaging",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "OtherLabResults",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "PSAFree",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "PSARatio",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "PSATotal",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "PT_PTT_INR",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "PUT",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "Platelets",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "PostPrandialBloodSugar",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "SerumCreatinine",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "TRUS",
                table: "Admissions");

            migrationBuilder.DropColumn(
                name: "TotalLeukocyteCount",
                table: "Admissions");

            migrationBuilder.RenameColumn(
                name: "PatientRemarksStatus",
                table: "FollowUps",
                newName: "PatientRemarks");

            migrationBuilder.RenameColumn(
                name: "UrineAnalysis",
                table: "Admissions",
                newName: "LabResults");

            migrationBuilder.RenameColumn(
                name: "Ultrasound",
                table: "Admissions",
                newName: "ImagingResults");
        }
    }
}
