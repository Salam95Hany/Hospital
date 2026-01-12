using Hospital.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.Reports
{
    public interface IReportsDataService
    {
        Task<Dictionary<string, string>> GetAdmissionTempData(int? PatientId, int? AdmissionId, int? SurgicalId = null);
    }
}
