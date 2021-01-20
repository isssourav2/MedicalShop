using CoreModel.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERPMEDICAL.ViewModel
{
    public class PoViewModel
    {
        public PoViewModel()
        {
            PurchaseOrderItems = new List<PurchaseOrderItem>();
        }
        public int Id { get; set; }
        public string DoctorName { get; set; }
        public string VendorName { get; set; }
        public string OrderDate { get; set; }
        public string Naration { get; set; }
        public string InvoiceNo { get; set; }
        public string TotalCgst { get; set; }
        public string TotalSgst { get; set; }
        public string TotalIgst { get; set; }
        public string TotalAmount { get; set; }

        public List<PurchaseOrderItem> PurchaseOrderItems { get; set; }
    }
}
