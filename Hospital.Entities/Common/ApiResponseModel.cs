using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Common
{
    public class ApiResponseModel<T>
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public int TotalCount { get; set; }
        public T? Results { get; set; }

        public static ApiResponseModel<T> Success(Error SuccessError, T? value = default, int? TotalCount = null)
        {
            return new ApiResponseModel<T>
            {
                IsSuccess = true,
                Message = SuccessError.Message,
                TotalCount = TotalCount ?? GetCount(value),
                Results = value
            };
        }

        public static ApiResponseModel<T> Failure(Error Error)
        {
            return new ApiResponseModel<T>
            {
                IsSuccess = false,
                Message = Error.Message,
                TotalCount = 0,
                Results = default
            };
        }

        private static int GetCount(T? value)
        {
            if (value is System.Data.DataTable dt)
            {
                if (dt.Rows.Count > 0 && dt.Columns.Contains("TotalCount"))
                    return int.TryParse(dt.Rows[0]["TotalCount"]?.ToString(), out var totalCount) ? totalCount : 0;
                return 0;
            }
            if (value is ICollection collection)
                return collection.Count;
            if (value is IEnumerable<object> enumerable)
                return enumerable.Count();

            return 0;
        }
    }
}
