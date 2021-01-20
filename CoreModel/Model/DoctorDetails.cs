using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class DoctorDetails
    {
        public int Id { get; set; }
        public int Baseid { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public string Address { get; set; }
        public string EmailId { get; set; }
        public string MobileNo { get; set; }

        public virtual Base Base { get; set; }
    }
}
