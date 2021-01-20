using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class Customer
    {
        public int Id { get; set; }
        public int Baseid { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string EmailId { get; set; }
        public string MobileNo { get; set; }
        public string DlNo { get; set; }
        public string VehicelNo { get; set; }
        public string Station { get; set; }
        public string MedicalCenter { get; set; }
        public string ShippedAdress { get; set; }
        public string State { get; set; }
        public string StateCode { get; set; }
        public string GstnCn { get; set; }

        public virtual Base Base { get; set; }
    }
}
