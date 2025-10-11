using Hospital.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Entities.Models;

namespace Hospital.Services.Repositories
{
    public class UnitOfWork: IUnitOfWork
    {
        private readonly HospitalDbContext _dbContext;
        private Hashtable _repositories;
        public UnitOfWork(HospitalDbContext dbContext)
        {
            _dbContext = dbContext;
            _repositories = new Hashtable();
        }


        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class
        {
            var key = typeof(TEntity).Name;

            if (!_repositories.ContainsKey(key))
            {
                var repository = new GenericRepository<TEntity>(_dbContext);

                _repositories.Add(key, repository);
            }

            return _repositories[key] as IGenericRepository<TEntity>;
        }


        public async Task<int> CompleteAsync(CancellationToken cancellationToken)
         => await _dbContext.SaveChangesAsync(cancellationToken);

        public async ValueTask DisposeAsync()
         => await _dbContext.DisposeAsync();

        public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        }
    }
}
