using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class Purchase
    {
        public int Id { get; set; }
        public int Baseid { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int VendorId { get; set; }
        public int OrderId { get; set; }
        public string PlaceOfSupply { get; set; }
        public decimal? ReserveCharge { get; set; }
        public decimal? TransportCharge { get; set; }
        public decimal? TotalAmount { get; set; }
        public int DoctorId { get; set; }
        public string Naration { get; set; }
    }
}
