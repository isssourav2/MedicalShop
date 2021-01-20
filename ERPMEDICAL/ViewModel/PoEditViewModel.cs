using CoreModel.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERPMEDICAL.ViewModel
{
    public class PoEditViewModel
    {
        public PoEditViewModel()
        {
            PoOrder = new PurchaseOrder();
            OrderItems = new List<PurchaseOrderItem>();
        }
        public string DoctorName { get; set; }
        public string VendorName { get; set; }
        public PurchaseOrder PoOrder { get; set; }
        public List<PurchaseOrderItem> OrderItems { get; set; }
    }
}
