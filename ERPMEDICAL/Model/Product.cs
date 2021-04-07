using System;
using System.Collections.Generic;

namespace ERPMEDICAL.Model
{
    public partial class Product
    {
        public int Id { get; set; }
        public int? Baseid { get; set; }
        public string ProductName { get; set; }
        public string HsnCode { get; set; }
        public string BatchNo { get; set; }
        public string ProductDescription { get; set; }
        public string Package { get; set; }
        public string Unit { get; set; }
        public decimal? Mrp { get; set; }
        public decimal? Rate { get; set; }
        public decimal? Discount { get; set; }
        public decimal? CgstPer { get; set; }
        public decimal? SgstPer { get; set; }
        public decimal? IgstPer { get; set; }
        public decimal? SalesPrice { get; set; }

        public virtual Base Base { get; set; }
    }
}
