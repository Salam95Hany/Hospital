using Hospital.Entities.Auth;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Models
{
    public partial class HospitalDbContext : IdentityDbContext<AdminUser>
    {
        public HospitalDbContext(DbContextOptions<HospitalDbContext> options)
        : base(options)
        {
        }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Admission> Admissions { get; set; }
        public DbSet<SurgicalIntervention> SurgicalInterventions { get; set; }
        public DbSet<FollowUp> FollowUps { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<SurgicalDoctor> SurgicalDoctors { get; set; }
        


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Patient>()
        .HasMany(p => p.Admissions)
        .WithOne(a => a.Patient)
        .HasForeignKey(a => a.PatientId)
        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Admission>()
                .HasMany(a => a.SurgicalInterventions)
                .WithOne(s => s.Admission)
                .HasForeignKey(s => s.AdmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Admission>()
                .HasMany(a => a.FollowUps)
                .WithOne(f => f.Admission)
                .HasForeignKey(f => f.AdmissionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SurgicalIntervention>()
                .HasMany<FollowUp>()
                .WithOne(f => f.SurgicalIntervention)
                .HasForeignKey(f => f.SurgicalInterventionId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
        }
    }
}
