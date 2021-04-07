using System;
using System.Collections.Generic;

namespace ERPMEDICAL.Model
{
    public partial class User
    {
        public int Id { get; set; }
        public int CompanyBranchId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public sbyte? IsAdmin { get; set; }
        public int Baseid { get; set; }
    }
}
