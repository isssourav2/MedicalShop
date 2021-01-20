using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace BaseRepository.Interface
{
    public interface IRepository<T> where T:class
    {
        /// <summary>      
        /// sourav das | 12-11-2020  | for model create for T entity
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        int Create(T entity);
        /// <summary>
        /// sourav das | 12-11-2020  | for model update for T entity
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        int Update(T entity);
        /// <summary>
        /// sourav das | 12-11-2020  | for model delete by entity for T entity
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        int Delete(T entity);
        /// <summary>
        /// sourav das | 12-11-2020  | for model delete by id for T entity
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        int Delete(int id);
        /// <summary>
        /// sourav das | 12-11-2020  | for get all data from database
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        IQueryable<T> GetAll();
        /// <summary>
        /// sourav das | 12-11-2020  | for find by condition on include multiple parameter
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        IQueryable<T> FindBy(Expression<Func<T, bool>> predicate, params string[] includes);
        /// <summary>
        /// sourav das | 12-11-2020  | for delete bulk range of data
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        bool DeleteRange(IEnumerable<T> entity);
        /// <summary>
        /// sourav das | 12-11-2020  | for single data return from database when retrieve
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        T SingleOrDefault(Expression<Func<T, bool>> whereCondition);
        /// <summary>
        /// sourav das | 12-11-2020  | for range of data create
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        bool CreateRange(IEnumerable<T> entityList);
        /// <summary>
        /// sourav das | 12-11-2020  | for range of data Edit
        /// </summary>
        /// <param name="entity">Entity is the model parameter</param>
        /// <returns></returns>
        bool UpdateRange(IEnumerable<T> entityList);

    }
}
