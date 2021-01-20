using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class PurchaseOrder
    {
        public int Id { get; set; }
        public int Baseid { get; set; }
        public int DoctorId { get; set; }
        public int VendorId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Naration { get; set; }
        public decimal? TotalAmount { get; set; }
        public string InvoiceNo { get; set; }
        public decimal? TotalCgst { get; set; }
        public decimal? TotalSgst { get; set; }
        public decimal? TotalIgst { get; set; }
        public int UserId { get; set; }
        public int CompanyBranchId { get; set; }

        public virtual Base Base { get; set; }
    }
}
