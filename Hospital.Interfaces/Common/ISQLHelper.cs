using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Interfaces.Common
{
    public interface ISQLHelper
    {
        Task<List<TElement>> SQLQueryAsync<TElement>(string commandText, params SqlParameter[] parameters);
        Task<DataTable> ExecuteDataTableAsync(string commandText, params SqlParameter[] parameters);
        Task<DataSet> ExecuteDatasetAsync(string commandText, SqlParameter[] commandParameters);
        Task<int> ExecuteScalarAsync(string procName, params SqlParameter[] sqlParameters);
        Task<int> GenerateCode(string procName);
    }
}
