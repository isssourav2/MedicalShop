using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreModel.Model;
using ERPMEDICAL.Helper;
using ERPMEDICAL.Models;
using ERPMEDICAL.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace ERPMEDICAL.Controllers
{
    public class PuchaseController : Controller
    {
        private ErpMedical _Context;
        private readonly IMapper _mapper;
        private ResponseStatus response_status;
        public PuchaseController(ErpMedical Context, IMapper mapper)
        {
            _Context = Context;
            _mapper = mapper;
            response_status= new ResponseStatus();
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Vendor()
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                var vendorList = _Context.Vendor.ToList();
                ViewBag.VendorList = vendorList;
                return View(vendorList);
            }
            else
            {
                return Redirect("/User/Login");
            }
           
        }
        [Route("/Doctor")]
        [HttpGet]
        public JsonResult Doctor()
        {
            var doctors = _Context.DoctorDetails.ToList().
                            Select(e=>new { e.Id,e.Name });
            return Json(doctors);
        }
        public IActionResult Item()
        {
            return View();
        }

        public IActionResult PO()
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                List<PoViewModel> viewModels = new List<PoViewModel>();
                var po = _Context.PurchaseOrder.ToList();
                foreach (var item in po)
                {
                    PoViewModel vm = new PoViewModel();
                    vm = _mapper.Map<PoViewModel>(item);
                    // vm.DoctorName = _Context.DoctorDetails.SingleOrDefault(s => s.Id == item.DoctorId).Name;
                    vm.VendorName = _Context.Vendor.SingleOrDefault(s => s.Id == item.VendorId).Name;
                    viewModels.Add(vm);
                }
                return View(viewModels);
            }
            else
            {
                return Redirect("/User/Login");
            }
        }
        //Purchase order create
        public IActionResult PoCreate()
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                return View();
            }
            else
            {
                return Redirect("/User/Login");
            }
        }

        [Route("/GetAllPurchase")]
        [HttpGet]
        public JsonResult GetAllPurchase()
        {
            List<PoViewModel> viewModels = new List<PoViewModel>();
            var po = _Context.PurchaseOrder.ToList();
            foreach (var item in po)
            {
                PoViewModel vm = new PoViewModel();
                vm = _mapper.Map<PoViewModel>(item);
              //  vm.DoctorName = _Context.DoctorDetails.SingleOrDefault(s => s.Id == item.DoctorId).Name;
                vm.VendorName = _Context.Vendor.SingleOrDefault(s => s.Id == item.VendorId).Name;
                viewModels.Add(vm);
            }
            return Json(viewModels);
        }

        [Route("/PoView")]
        public IActionResult PoView(int Id)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                var po = _Context.PurchaseOrder.SingleOrDefault(x => x.Id == Id);

                PoViewModel vm = new PoViewModel();
                vm = _mapper.Map<PoViewModel>(po);
                vm.DoctorName = _Context.DoctorDetails.Where(m => m.Id == po.DoctorId).SingleOrDefault() != null ? _Context.DoctorDetails.SingleOrDefault(s => s.Id == po.DoctorId).Name : "";
                vm.VendorName = _Context.Vendor.SingleOrDefault(s => s.Id == po.VendorId) != null ? _Context.Vendor.SingleOrDefault(s => s.Id == po.VendorId).Name : "";
                vm.PurchaseOrderItems = _Context.PurchaseOrderItem.Where(poi => poi.PoId == po.Id).ToList();
                // viewModels.Add(vm);
                return View(vm);
            }
            else
            {
                return Redirect("/User/Login");
            }
        }

        public IActionResult PoEdit(int Id)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                var po = _Context.PurchaseOrder.SingleOrDefault(x => x.Id == Id);

                PoEditViewModel vm = new PoEditViewModel();
                vm.DoctorName = _Context.DoctorDetails.Where(m => m.Id == po.DoctorId).SingleOrDefault() != null ? _Context.DoctorDetails.SingleOrDefault(s => s.Id == po.DoctorId).Name : "";
                vm.VendorName = _Context.Vendor.SingleOrDefault(s => s.Id == po.VendorId) != null ? _Context.Vendor.SingleOrDefault(s => s.Id == po.VendorId).Name : "";
                vm.PoOrder = po;
                vm.PoOrder.OrderDate = po.OrderDate.Date;
                vm.OrderItems = _Context.PurchaseOrderItem.Where(poi => poi.PoId == po.Id).ToList();
                return View(vm);
            }
            else
            {
                return Redirect("/User/Login");
            }
        }
        public IActionResult Delete(int Id)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                var po = _Context.PurchaseOrder.SingleOrDefault(x => x.Id == Id);

                PoViewModel vm = new PoViewModel();
                vm = _mapper.Map<PoViewModel>(po);
                vm.DoctorName = _Context.DoctorDetails.Where(m => m.Id == po.DoctorId).FirstOrDefault() != null ? _Context.DoctorDetails.SingleOrDefault(s => s.Id == po.DoctorId).Name : "";
                vm.VendorName = _Context.Vendor.FirstOrDefault(s => s.Id == po.VendorId) != null ? _Context.Vendor.SingleOrDefault(s => s.Id == po.VendorId).Name : "";
                return View(vm);
            }
            else
            {
                return Redirect("/User/Login");
            }
            
        }
        public IActionResult PoDelete(int Id)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                //delete purchase Order Item
                var purchaseOrderItems = _Context.PurchaseOrderItem.Where(poi => poi.PoId == Id).ToList();

                foreach (var item in purchaseOrderItems)
                {
                    _Context.PurchaseOrderItem.Remove(item);
                    _Context.SaveChanges();
                }
                //delete purchase order
                _Context.PurchaseOrder.Remove(_Context.PurchaseOrder.Where(x => x.Id == Id).FirstOrDefault());
                _Context.SaveChanges();
                return RedirectToAction("PO");
            }
            else
            {
                return Redirect("/User/Login");
            }
            
        }


        [Route("/PurchaseSave")]
        [HttpPost]
        public JsonResult Save(PurchaseOrdeViewModel purchaseVm)
        {
            try
            {
                if (purchaseVm.Id != 0)
                {
                    //update base Table
                    Base basetable = new Base();
                    basetable.CreatedBy = "";
                    basetable.UpdatedBy = "Admin";
                    basetable.UpdatedDate = DateTime.Now;
                    //basetable.UpdatedDate = DateTime.Now;
                    _Context.Base.Add(basetable);
                    _Context.SaveChanges();

                    //update purchase Order
                    PurchaseOrder poOrder = _mapper.Map<PurchaseOrder>(purchaseVm);
                    //poOrder.OrderDate = DateTime.Now;
                    poOrder.Baseid = basetable.Id;
                    //Remove the old Entry
                    _Context.PurchaseOrder.Remove(_Context.PurchaseOrder.FirstOrDefault(po => po.Id == poOrder.Id));
                    _Context.SaveChanges();
                    //Add UserId and CompanyBranchId
                    User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                    if (user != null)
                    {
                        poOrder.UserId = user.Id;
                        poOrder.CompanyBranchId = user.CompanyBranchId;
                        poOrder.OrderDate = Convert.ToDateTime(poOrder.OrderDate);
                    }
                    else
                    {
                        response_status.id = 0;
                        response_status.status = false;
                        response_status.errorMessage = "session out";
                        return Json(response_status);
                    }
                    _Context.PurchaseOrder.Add(poOrder);
                    //_Context.Entry(poOrder).CurrentValues.SetValues(poOrder);
                    _Context.SaveChanges();


                    //update purchase Order Item 
                    foreach (var item in purchaseVm.PurchaseOrderItems)
                    {
                        PurchaseOrderItem poItem = item;
                        var purchaseOrderForDelete = _Context.PurchaseOrderItem.Where(x => x.Id == item.Id).FirstOrDefault();
                        //check the data exist in database or not 
                        if (purchaseOrderForDelete != null)
                        {
                            //Remove from purchase Order Item
                            _Context.PurchaseOrderItem.Remove(purchaseOrderForDelete);
                            _Context.SaveChanges();
                        }
                      
                        
                            poItem.PoId = poOrder.Id;
                            poItem.Baseid = basetable.Id;
                            poItem.ProductId = item.ProductId;
                            //poItem.Id = 0;
                            //intialize tax value
                            poItem.SgstPercentage = poItem.SgstPercentage == null ? 0 : poItem.SgstPercentage;
                            poItem.CgstPercentage = poItem.CgstPercentage == null ? 0 : poItem.CgstPercentage;
                            poItem.IgstPercentage = poItem.IgstPercentage == null ? 0 : poItem.IgstPercentage;
                            poItem.Cgst = poItem.Cgst == null ? 0 : poItem.Cgst;
                            poItem.Sgst = poItem.Sgst == null ? 0 : poItem.Sgst;
                            poItem.Igst = poItem.Igst == null ? 0 : poItem.Igst;
                            //Insert from Purchase Order Item
                            poItem.Id = 0;
                            _Context.PurchaseOrderItem.Add(poItem);
                            _Context.SaveChanges();

                        //stock calculation
                        var stockCreation = _Context.Stock.Where(x => x.ProductId == item.ProductId).FirstOrDefault();
                        if (stockCreation != null)
                        {
                            //remove from stock
                            _Context.Stock.Remove(stockCreation);
                            _Context.SaveChanges();
                            Stock stck = new Stock();
                            stck.ProductId = stockCreation.ProductId;
                            stck.StockQty = stockCreation.StockQty + item.Qty;
                            _Context.Stock.Add(stck);
                            _Context.SaveChanges();
                        }
                        else
                        {
                          
                            //add to stock
                            Stock stck = new Stock();
                            stck.ProductId = item.ProductId;
                            stck.StockQty = item.Qty;
                            _Context.Stock.Add(stck);
                            _Context.SaveChanges();
                        }


                    }


                    response_status.id = poOrder.Id;
                    response_status.status = true;
                    response_status.successMessage = "data updated successfull!!";
                    return Json(response_status);
                    //for edit functionality
                }
                else
                {
                    //for insert functionality
                    //Add base table
                    Base basetable = new Base();
                    basetable.CreatedBy = "Admin";
                    basetable.CreatedDate = DateTime.Now;
                    basetable.UpdatedBy = "";
                    //basetable.UpdatedDate = DateTime.Now;
                    _Context.Base.Add(basetable);
                    _Context.SaveChanges();
                    //create purchase order
                    PurchaseOrder poOrder = _mapper.Map<PurchaseOrder>(purchaseVm);
                    //poOrder.OrderDate = DateTime.Now;
                    poOrder.Baseid = basetable.Id;
                    //Add UserId and CompanyBranchId
                    User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                    if (user != null)
                    {
                        poOrder.UserId = user.Id;
                        poOrder.CompanyBranchId = user.CompanyBranchId;
                        poOrder.OrderDate = Convert.ToDateTime(poOrder.OrderDate);
                    }
                    else
                    {
                        response_status.id = 0;
                        response_status.status = false;
                        response_status.errorMessage = "session out";
                        return Json(response_status);
                    }
                    
                        _Context.PurchaseOrder.Add(poOrder);
                    _Context.SaveChanges();



                    //create purchase Order Item 

                    foreach (var item in purchaseVm.PurchaseOrderItems)
                    {
                        PurchaseOrderItem poItem = item;
                        poItem.PoId = poOrder.Id;
                        poItem.Baseid = basetable.Id;
                        poItem.ProductId = item.Id;
                        poItem.Id = 0;
                        //intialize tax value
                        poItem.SgstPercentage = poItem.SgstPercentage == null ? 0 : poItem.SgstPercentage;
                        poItem.CgstPercentage = poItem.CgstPercentage == null ? 0 : poItem.CgstPercentage;
                        poItem.IgstPercentage = poItem.IgstPercentage == null ? 0 : poItem.IgstPercentage;
                        poItem.Cgst = poItem.Cgst == null ? 0 : poItem.Cgst;
                        poItem.Sgst = poItem.Sgst == null ? 0 : poItem.Sgst;
                        poItem.Igst = poItem.Igst == null ? 0 : poItem.Igst;

                        _Context.PurchaseOrderItem.Add(poItem);
                        _Context.SaveChanges();

                        //stock calculation
                        var stockCreation = _Context.Stock.Where(x => x.ProductId == item.ProductId).FirstOrDefault();
                        if(stockCreation!=null)
                        {
                            //remove from stocks
                            _Context.Stock.Remove(stockCreation);
                            _Context.SaveChanges();
                            Stock stck = new Stock();
                            stck.ProductId = stockCreation.ProductId;
                            stck.StockQty = stockCreation.StockQty + item.Qty;
                            _Context.Stock.Add(stck);
                            _Context.SaveChanges();
                        }
                        else
                        {
                           
                            //add to stock
                            Stock stck = new Stock();
                            stck.ProductId = item.ProductId;
                            stck.StockQty = item.Qty;
                            _Context.Stock.Add(stck);
                            _Context.SaveChanges();
                        }
                    }
                    response_status.id = poOrder.Id;
                    response_status.status = true;
                    response_status.successMessage = "data inserted successfull!!";
                    return Json(response_status);
                }
            }
            catch(Exception er)
            {
                response_status.id = 0;
                response_status.status = false;
                response_status.errorMessage = er.Message;
                return Json(response_status);
            }
        }
    }
}
