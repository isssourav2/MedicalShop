using CoreModel.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERPMEDICAL.ViewModel
{
    public class BillPreviewVM
    {
        public BillPreviewVM()
        {
            InvoiceBillDetails = new List<InvoiceBillDetails>();
        }
        public string CompanyName { get; set; }
        public string CompanySubHeading { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyMobNo { get; set; }
        public string CompanyEmail { get; set; }
        public string CompanyGSTNo { get; set; }
        public string CompanyDLNo { get; set; }
        public string InvoiceNo { get; set; }
        public string InvoiceDate { get; set; }
        public string PlaceOfSupply { get; set; }
        public string BillTo { get; set; }
        public string CustomerState { get; set; }
        public string CustomerGSTCN { get; set; }
        public string CustomerMobNo { get; set; }
        public string CustomerEmail { get; set; }
        public decimal BillTotalAmount { get; set; }
        public string BillAmountInWord { get; set; }
        public List<InvoiceBillDetails> InvoiceBillDetails { get; set; }
    }
}
