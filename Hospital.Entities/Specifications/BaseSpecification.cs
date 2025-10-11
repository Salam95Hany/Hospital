using LinqKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Entities.Specifications
{
    public class BaseSpecification<T> : ISpecification<T> where T : class
    {
        private readonly ExpressionStarter<T> _criteria = PredicateBuilder.New<T>(true);

        public Expression<Func<T, bool>> Criteria => _criteria;
        public List<Expression<Func<T, object>>> Includes { get; set; } = new();
        public List<string> IncludeStrings { get; set; } = new();
        public Expression<Func<T, object>> OrderBy { get; set; }
        public Expression<Func<T, object>> OrderByDescending { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
        public bool IsPaginationEnabled { get; set; }

        public BaseSpecification()
        {
        }

        public BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            _criteria = PredicateBuilder.New<T>(criteria);
        }

        protected void AddCriteria(Expression<Func<T, bool>> newCriteria)
        {
            _criteria.And(newCriteria);
        }

        protected void AddInclude(Expression<Func<T, object>> include)
        {
            Includes.Add(include);
        }

        protected void AddInclude(string includeString)
        {
            IncludeStrings.Add(includeString);
        }

        protected void ApplyPaging(int skip, int take)
        {
            Skip = skip;
            Take = take;
            IsPaginationEnabled = true;
        }

        protected void ApplyOrderBy(Expression<Func<T, object>> orderBy)
        {
            OrderBy = orderBy;
        }

        protected void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescending)
        {
            OrderByDescending = orderByDescending;
        }
    }
}
