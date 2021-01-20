using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class EmployeeMaster
    {
        public int EmployeeId { get; set; }
        public string EmpName { get; set; }
        public string ContactNo { get; set; }
        public string Email { get; set; }
        public DateTime? Dob { get; set; }
        public string Gender { get; set; }
        public string Designation { get; set; }
        public string City { get; set; }
        public string Password { get; set; }
        public DateTime? EnlistDate { get; set; }
        public DateTime? LastUpdate { get; set; }
    }
}
