using CoreModel.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERPMEDICAL.ViewModel
{
    public class BillingViewModel
    {

        public BillingViewModel()
        {
            InvoiceBillDetails = new List<InvoiceBillDetails>();
            InvoiceBill = new InvoiceBill();
        }
        public InvoiceBill InvoiceBill { get; set; }
        public string CustomerName { get; set; }
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
        public List<InvoiceBillDetails> InvoiceBillDetails { get; set; }
    }
}
