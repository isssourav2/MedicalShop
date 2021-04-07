using System;
using System.Collections.Generic;

namespace ERPMEDICAL.Model
{
    public partial class InvoiceBillDetails
    {
        public int Id { get; set; }
        public int Baseid { get; set; }
        public int BillId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Package { get; set; }
        public decimal? Discount { get; set; }
        public decimal? BaseValue { get; set; }
        public decimal? Cgst { get; set; }
        public decimal? CgstPercentage { get; set; }
        public decimal? Sgst { get; set; }
        public decimal? SgstPercentage { get; set; }
        public decimal? Igst { get; set; }
        public decimal? IgstPercentage { get; set; }
        public decimal? Amount { get; set; }
        public int Qty { get; set; }
        public decimal? Rate { get; set; }
    }
}
