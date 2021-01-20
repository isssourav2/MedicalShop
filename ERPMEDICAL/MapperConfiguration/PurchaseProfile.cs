using AutoMapper;
using CoreModel.Model;
using ERPMEDICAL.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERPMEDICAL.MapperConfiguration
{
    public class PurchaseProfile: Profile
    {
        public PurchaseProfile()
        {
            CreateMap<PurchaseOrder, PurchaseOrdeViewModel>().ReverseMap();
            CreateMap<PurchaseOrder, PoViewModel>().ReverseMap();
            //CreateMap<InvoiceBillDetails, InvoiceBillDetail>().ReverseMap();
            CreateMap<InvoiceBill, BillingViewModel>().ReverseMap();

        }
        
    }
}
