using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERPMEDICAL.Models
{
    public class ResponseStatus
    {
        public int id { get; set; }
        public bool status { get; set; }
        public string successMessage { get; set; }
        public string errorMessage { get; set; }
    }
}
