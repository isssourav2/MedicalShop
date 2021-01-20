using BaseRepository;
using BaseRepository.Interface;
using CoreModel.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace CoreModel.Repository
{
    public abstract class abstarctFactory<T> : IRepository<T> where T :class
    {
        public string ConnectionString { get; set; }
        ErpMedical medicalContext;
        public abstarctFactory(string connectionString)
        {
            this.ConnectionString = connectionString;
            
        }
        public virtual int Create(T entity)
        {
            throw new NotImplementedException();
        }

        public bool CreateRange(IEnumerable<T> entityList)
        {
            throw new NotImplementedException();
        }

        public int Delete(T entity)
        {
            throw new NotImplementedException();
        }

        public int Delete(int id)
        {
            throw new NotImplementedException();
        }

        public bool DeleteRange(IEnumerable<T> entity)
        {
            throw new NotImplementedException();
        }

        public IQueryable<T> FindBy(Expression<Func<T, bool>> predicate, params string[] includes)
        {
            throw new NotImplementedException();
        }

        public IQueryable<T> GetAll()
        {
            throw new NotImplementedException();
        }

        public T SingleOrDefault(Expression<Func<T, bool>> whereCondition)
        {
            throw new NotImplementedException();
        }

        public int Update(T entity)
        {
            throw new NotImplementedException();
        }

        public bool UpdateRange(IEnumerable<T> entityList)
        {
            throw new NotImplementedException();
        }
    }
}
