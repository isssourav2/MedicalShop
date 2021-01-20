using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class Vendor
    {
        public int Id { get; set; }
        public int Baseid { get; set; }
        public int? CompanyId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public string Address { get; set; }
        public string GstNo { get; set; }
    }
}
