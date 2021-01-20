using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class VendorCompany
    {
        public int Id { get; set; }
        public int Baseid { get; set; }
        public string Name { get; set; }
        public string State { get; set; }
        public string StateCode { get; set; }
        public string City { get; set; }
        public bool? IsOutSider { get; set; }
        public string Location { get; set; }

        public virtual Base Base { get; set; }
    }
}
