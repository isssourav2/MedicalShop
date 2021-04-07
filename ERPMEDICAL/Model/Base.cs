using System;
using System.Collections.Generic;

namespace ERPMEDICAL.Model
{
    public partial class Base
    {
        public Base()
        {
            CompanyBranch = new HashSet<CompanyBranch>();
            Customer = new HashSet<Customer>();
            DoctorDetails = new HashSet<DoctorDetails>();
            Product = new HashSet<Product>();
            PurchaseItem = new HashSet<PurchaseItem>();
            PurchaseOrder = new HashSet<PurchaseOrder>();
            PurchaseOrderItem = new HashSet<PurchaseOrderItem>();
            VendorCompany = new HashSet<VendorCompany>();
        }

        public int Id { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public virtual ICollection<CompanyBranch> CompanyBranch { get; set; }
        public virtual ICollection<Customer> Customer { get; set; }
        public virtual ICollection<DoctorDetails> DoctorDetails { get; set; }
        public virtual ICollection<Product> Product { get; set; }
        public virtual ICollection<PurchaseItem> PurchaseItem { get; set; }
        public virtual ICollection<PurchaseOrder> PurchaseOrder { get; set; }
        public virtual ICollection<PurchaseOrderItem> PurchaseOrderItem { get; set; }
        public virtual ICollection<VendorCompany> VendorCompany { get; set; }
    }
}
