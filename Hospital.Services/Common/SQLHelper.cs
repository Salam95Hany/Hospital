using Hospital.Interfaces.Common;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.Common
{
    public class SQLHelper: ISQLHelper
    {
        private readonly IAppSettings _appSettings;
        int Timeout = 9999;
        private string ConnectionString;
        public SQLHelper(IAppSettings appSettings)
        {
            _appSettings = appSettings;
            ConnectionString = appSettings.ConnectionStrings.DBConnection;

        }
        public async Task<List<TElement>> SQLQueryAsync<TElement>(string commandText, params SqlParameter[] parameters)
        {
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(commandText, sqlConn))
                {
                    cmd.CommandText = commandText;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.CommandTimeout = (int)TimeSpan.FromMinutes(5).TotalSeconds;

                    foreach (var parameter in parameters)
                    {
                        var paramter = cmd.CreateParameter();
                        paramter.ParameterName = parameter.ParameterName;
                        paramter.Value = parameter.Value;
                        if (!string.IsNullOrEmpty(parameter.TypeName))
                        {
                            paramter.SqlDbType = SqlDbType.Structured;
                            paramter.TypeName = parameter.TypeName;
                        }
                        cmd.Parameters.Add(paramter);
                    }

                    await sqlConn.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        var result = MapToList<TElement>(reader);
                        return result;
                    }
                }
            }
        }

        public async Task<DataTable> ExecuteDataTableAsync(string commandText, params SqlParameter[] parameters)
        {
            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandTimeout = Timeout;

                    if (parameters != null && parameters.Length > 0)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        DataTable dt = new DataTable();
                        dt.Load(reader);
                        return dt;
                    }
                }
            }
        }

        public async Task<DataSet> ExecuteDatasetAsync(string commandText, SqlParameter[] commandParameters)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand sqlCommand = new SqlCommand())
                    {
                        PrepareCommand(connection, sqlCommand, transaction: null, CommandType.StoredProcedure, commandText, commandParameters);
                        sqlCommand.CommandTimeout = Timeout;

                        using (var reader = await sqlCommand.ExecuteReaderAsync())
                        {
                            DataSet dataSet = new DataSet();
                            dataSet.Load(reader, LoadOption.PreserveChanges, new string[] { "Table", "Table1" });
                            sqlCommand.Parameters.Clear();
                            return dataSet;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<int> ExecuteScalarAsync(string procName, params SqlParameter[] sqlParameters)
        {
            using (var con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand sqlCommand = new SqlCommand())
                {
                    if (sqlParameters != null && sqlParameters.Length > 0)
                        sqlCommand.Parameters.AddRange(sqlParameters);

                    sqlCommand.Connection = con;
                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.CommandText = procName;

                    await con.OpenAsync();

                    object result = await sqlCommand.ExecuteScalarAsync();

                    return result != null ? Convert.ToInt32(result) : 0;
                }
            }
        }

        private void PrepareCommand(SqlConnection connection, SqlCommand command, SqlTransaction transaction, CommandType commandType, string commandText, SqlParameter[] commandParameters)
        {
            if (connection.State != ConnectionState.Open)
                connection.Open();
            command.Connection = connection;
            command.CommandTimeout = Timeout;
            command.CommandText = commandText;
            if (transaction != null)
                command.Transaction = transaction;
            command.CommandType = commandType;
            if (commandParameters == null)
                return;
            SQLHelper.AttachParameters(command, commandParameters);
        }

        private static void AttachParameters(SqlCommand command, SqlParameter[] commandParameters)
        {
            foreach (SqlParameter sqlParameter in commandParameters)
            {
                if (sqlParameter.Direction == ParameterDirection.InputOutput && sqlParameter.Value == null)
                    sqlParameter.Value = (object)DBNull.Value;
                command.Parameters.Add(sqlParameter);
            }
        }

        private List<T> MapToList<T>(DbDataReader dr)
        {
            var objList = new List<T>();
            var props = typeof(T).GetRuntimeProperties();

            List<string> drColumnsName = new List<string>();
            for (int i = 0; i < dr.FieldCount; i++)
            {
                drColumnsName.Add(dr.GetName(i));
            }


            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    T obj = Activator.CreateInstance<T>();
                    foreach (var prop in props)
                    {
                        if (drColumnsName.Contains(prop.Name))
                        {
                            var ordinal = dr.GetOrdinal(prop.Name);
                            var val = dr.GetValue(ordinal);
                            prop.SetValue(obj, val == DBNull.Value ? null : val);
                        }
                    }
                    objList.Add(obj);
                }
            }
            return objList;
        }

        public async Task<int> GenerateCode(string procName)
        {
            return await ExecuteScalarAsync(procName, Array.Empty<SqlParameter>());
            //return await ExecuteScalarAsync("web.SP_GetBeneFactorCodeSequences", Array.Empty<SqlParameter>());
        }
    }
}
