using CoreModel.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERPMEDICAL.ViewModel
{
    public class PurchaseOrdeViewModel
    {
        public PurchaseOrdeViewModel()
        {
            PurchaseOrderItems = new List<PurchaseOrderItem>();
        }
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int VendorId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Naration { get; set; }
        public string InvoiceNo { get; set; }
        public decimal? TotalBaseValue { get; set; }
        public decimal? TotalCgst { get; set; }
        public decimal? TotalSgst { get; set; }
        public decimal? TotalIgst { get; set; }
        public decimal? TotalAmount { get; set; }

        public List<PurchaseOrderItem> PurchaseOrderItems { get; set; }
    }
}
