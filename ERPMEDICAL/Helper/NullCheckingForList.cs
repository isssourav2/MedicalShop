using CoreModel.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ERPMEDICAL.Helper
{
    public static class NullCheckingForList
    {
        public static void NullValidation<T>(this T entity) where T : class, new()
        {
            T instance = Activator.CreateInstance<T>();
            Type TheType = entity.GetType();
            PropertyInfo[] propertyInfo = TheType.GetProperties();
            foreach (PropertyInfo pInfo in propertyInfo)
            {
                var selfValue = TheType.GetProperty(pInfo.Name).GetValue(entity, null);
                if (selfValue == null && pInfo.Name!="Base")
                {
                    TheType.GetProperty(pInfo.Name).SetValue(entity, "");
                }
            }
        }
    }
}
