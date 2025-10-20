using Hospital.Entities.Models;
using Hospital.Entities.Specifications;
using Hospital.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly HospitalDbContext _dbContext;

        public GenericRepository(HospitalDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<T>> GetAllWithSpecAsync(ISpecification<T> spec, CancellationToken cancellationToken)
        {
            return await ApplySecifications(spec).ToListAsync(cancellationToken);
        }

        public async Task<List<T>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _dbContext.Set<T>().AsNoTracking().ToListAsync(cancellationToken);
        }

        public async Task<T?> GetByIdWithSpecAsync(ISpecification<T> spec, CancellationToken cancellationToken)
        {
            return await ApplySecifications(spec).FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _dbContext.Set<T>().FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<T?> GetByIdAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Set<T>().FirstOrDefaultAsync(predicate, cancellationToken);
        }

        public async Task AddAsync(T entity, CancellationToken cancellationToken)
        => await _dbContext.Set<T>().AddAsync(entity, cancellationToken);

        public void Update(T entity)
        => _dbContext.Set<T>().Update(entity);

        public void Delete(T entity)
        => _dbContext.Set<T>().Remove(entity);

        public void DeleteRange(IEnumerable<T> entities)
        => _dbContext.Set<T>().RemoveRange(entities);

        public async Task DeleteWhereAsync(Expression<Func<T, bool>> predicate)
        => await _dbContext.Set<T>().Where(predicate).ExecuteDeleteAsync();

        private IQueryable<T> ApplySecifications(ISpecification<T> spec)
        {
            return SpecificationsEvaluator<T>.GetQuery(_dbContext.Set<T>(), spec);
        }

        public Task<int> CountAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
        {
            return _dbContext.Set<T>().CountAsync(predicate, cancellationToken);
        }

        public Task<int> CountAsync(CancellationToken cancellationToken)
        {
            return _dbContext.Set<T>().CountAsync(cancellationToken);
        }

        public Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
        {
            return _dbContext.Set<T>().FirstOrDefaultAsync(predicate, cancellationToken); // => indexer.name == "x"
        }

        public async Task<int> GetCountAsync(ISpecification<T> spec, CancellationToken cancellationToken)
        {
            return await ApplySecifications(spec).CountAsync(cancellationToken);
        }

        public async Task<List<T>> GetAllAsQueryableAsync(ISpecification<T>? spec = null, CancellationToken cancellationToken = default)
        {
            var query = _dbContext.Set<T>().AsQueryable();

            if (spec != null)
            {
                query = SpecificationsEvaluator<T>.GetQuery(query, spec);
            }

            return await query.ToListAsync(cancellationToken);
        }

        public IQueryable<T> GetAllAsQueryable()
        {
            return _dbContext.Set<T>().AsQueryable();
        }

        public async Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken)
        => await _dbContext.Set<T>().AddRangeAsync(entities, cancellationToken);

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
        => await _dbContext.Set<T>().AnyAsync(predicate, cancellationToken);

        public async Task<bool> AnyAsync(CancellationToken cancellationToken = default)
        => await _dbContext.Set<T>().AnyAsync(cancellationToken);

        public async Task<TResult> MaxAsync<TResult>(Expression<Func<T, TResult>> selector, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Set<T>().MaxAsync(selector, cancellationToken);
        }
        public IQueryable<T> Where(Expression<Func<T, bool>> predicate)
        {
            return _dbContext.Set<T>().Where(predicate);
        }

        public async Task<List<T>> WhereAsync(Expression<Func<T, bool>> predicate, int? take = null, CancellationToken cancellationToken = default)
        {
            var query = _dbContext.Set<T>().Where(predicate);

            if (take.HasValue)
                query = query.Take(take.Value);

            return await query.ToListAsync(cancellationToken);
        }
    }
}
