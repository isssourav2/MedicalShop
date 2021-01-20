using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class InvoiceBill
    {
        public int Id { get; set; }
        public int? Baseid { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string InvoiceNo { get; set; }
        public decimal? TotalCgst { get; set; }
        public decimal? TotalSgst { get; set; }
        public decimal? TotalIgst { get; set; }
        public decimal? TotalAmount { get; set; }
        public string OtherCustomer { get; set; }
        public int UserId { get; set; }
        public int CompanyBranchId { get; set; }
    }
}
