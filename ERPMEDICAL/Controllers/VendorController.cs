using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreModel.Model;
using ERPMEDICAL.Helper;
using ERPMEDICAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPMEDICAL.Controllers
{
    public class VendorController : Controller
    {
        private ResponseStatus response_status;
        private ErpMedical _Context;
        public VendorController(ErpMedical Context)
        {
            response_status = new ResponseStatus();
            _Context = Context;
        }

        [Route("/Vendor")]
        [HttpGet]
        public JsonResult Get()
        {
            var vendors = _Context.Vendor.ToList();
            return Json(vendors);

        }

        // GET: VendorController/Details/5
        //[Route("/Vendor")]
        //[HttpGet]
        //public ActionResult Get(int id)
        //{
        //    //find data from vendor table
        //    var vendor = _Context.Vendor.Where(m => m.Id == id).FirstOrDefault();
        //    return View(vendor);
        //}

        public ActionResult Create()
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

        
        [Route("/Vendor")]
        [HttpPost]
        public JsonResult Post(Vendor vendor)
        {
            try
            {
                //Add base table
                Base basetable = new Base();
                basetable.CreatedBy = "Admin";
                basetable.CreatedDate = DateTime.Now;
                basetable.UpdatedBy = "";
                //basetable.UpdatedDate = DateTime.Now;
                _Context.Base.Add(basetable);
                _Context.SaveChanges();
                //Add vendor table
                vendor.Baseid = basetable.Id;
                vendor.CompanyId = 1;
                _Context.Vendor.Add(vendor);
                //save changes trigger for saving
                _Context.SaveChanges();
                response_status.id = vendor.Id;
                response_status.status = true;
                response_status.successMessage = "data inserted successfull!!";
                return Json(response_status);
            }
            catch (Exception ex)
            {
                response_status.id = vendor.Id;
                response_status.status = false;
                response_status.errorMessage = ex.Message;
                return Json(response_status);
            }
           
        }

        public ActionResult Edit(string VendorID)
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
        // POST: VendorController/Edit/5
        [Route("/Vendor")]
        [HttpPut]
        public ActionResult Put(Vendor vendor)
        {
            try
            {
                User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                if (user != null)
                {
                    ViewBag.CurrentUser = user; //Add base table
                    Base basetable = new Base();
                    basetable.CreatedBy = "";
                    //basetable.CreatedDate = DateTime.Now;
                    basetable.UpdatedBy = "Admin";
                    basetable.UpdatedDate = DateTime.Now;
                    _Context.Base.Add(basetable);
                    _Context.SaveChanges();
                    //find entry against id of vendor
                    Vendor vendordetail = _Context.Vendor.FirstOrDefault(O => O.Id == vendor.Id);

                    //Add vendor table UPDATE
                    vendordetail.Baseid = basetable.Id;

                    vendordetail.CompanyId = vendor.CompanyId;
                    vendordetail.Name = vendor.Name;
                    vendordetail.Email = vendor.Email;
                    vendordetail.MobileNo = vendor.MobileNo;
                    vendordetail.Address = vendor.Address;

                    vendordetail.GstNo = vendor.GstNo;

                    // _Context.Vendor.Add(vendordetail);
                    _Context.Entry(vendor).CurrentValues.SetValues(vendordetail);
                    _Context.SaveChanges();
                    //save changes trigger for saving
                    // _Context.SaveChanges();
                    response_status.id = vendor.Id;
                    response_status.status = true;
                    response_status.successMessage = "data upadted successfull!!";
                    return Json(response_status);
                }
                else
                {
                    return Redirect("/User/Login");
                }
               
            }
            catch (Exception err)
            {
                response_status.id = vendor.Id;
                response_status.status = false;
                response_status.errorMessage = "data updated not successfull!!";
                return Json(response_status);
            }
        }

        [Route("/Vendor/company")]
        [HttpGet]
        public JsonResult CompanyList()
        {
            var vendorCom = _Context.VendorCompany.ToList();
            return Json(vendorCom);   
        }

        
        [Route("Vendor/DeleteVendor")]        
        public JsonResult Delete(int VendorID)
        {
            try
            {
                User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                if (user != null)
                {
                    ViewBag.CurrentUser = user;
                    
                    var vendordata = _Context.Vendor.Where(o => o.Id == VendorID).SingleOrDefault();
                    response_status.id = vendordata.Id;
                    
                    _Context.Vendor.Remove(vendordata);
                    _Context.SaveChanges();
                    response_status.status = true;
                    response_status.successMessage = "Vendor Deleted Successfully!";
                    return Json(response_status);
                }
                else
                {
                    response_status.status = false;
                    response_status.errorMessage = "Session Time Out!";
                    return Json(response_status);
                }
                
            }
            catch (Exception Err)
            {                
                response_status.status = false;
                response_status.errorMessage = Err.Message;
                return Json(response_status);
            }
        }
    }
}
