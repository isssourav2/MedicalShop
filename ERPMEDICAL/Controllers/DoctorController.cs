using System;
using System.Linq;
using CoreModel.Model;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using ERPMEDICAL.Models;
using ERPMEDICAL.Helper;

namespace ERPMEDICAL.Controllers
{
    public class DoctorController : Controller
    {
        ResponseStatus response = new ResponseStatus();
        private ErpMedical Context;
        public DoctorController(ErpMedical _Context)
        {            
            Context = _Context;
        }
        public IActionResult List()
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                var doctorList = Context.DoctorDetails.ToList();
                ViewBag.doctorList = doctorList;
                return View();
            }
            else
            {
                return Redirect("/User/Login");
            }
            
        }

        public IActionResult ManageDoctor(int? DoctorID)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                if (DoctorID == null)
                {
                    DoctorDetails model = new DoctorDetails();
                    return View(model);
                }
                else
                {
                    var context = Context.DoctorDetails.FirstOrDefault(x => x.Id == DoctorID);
                    return View(context);
                }
            }
            else
            {
                return Redirect("/User/Login");
            }
                  
        }

        [Route("Doctor/AddEditDoctor")]
        [HttpPost]
        public JsonResult AddEditDoctor(DoctorDetails model)
        {
            try
            {
                Base basetable = new Base();
                if (model.Id == 0)
                {
                    //addition in base table
                    basetable.CreatedBy = "Admin";
                    basetable.UpdatedBy = "";
                    basetable.CreatedDate = DateTime.Now;
                    Context.Base.Add(basetable);
                    Context.SaveChanges();

                    //addition in product table
                    model.Baseid = basetable.Id;
                    model.EmailId = (model.EmailId == null) ? "" : model.EmailId;
                    model.Age = (model.Age == 0) ? 0 : model.Age;
                    model.MobileNo = (model.MobileNo == null) ? "" : model.MobileNo;
                    model.Address = (model.Address == null) ? "" : model.Address;                    
                    Context.DoctorDetails.Add(model);
                    Context.SaveChanges();
                    response.id = 0;
                    response.successMessage = "Data Saved Successfully!";
                }
                else
                {
                    //update in base table.
                    basetable.CreatedBy = "";
                    basetable.UpdatedBy = "Admin";
                    basetable.UpdatedDate = DateTime.Now;
                    Context.Base.Add(basetable);
                    Context.SaveChanges();

                    //checking null value
                    model.Baseid = basetable.Id;
                    model.EmailId = (model.EmailId == null) ? "" : model.EmailId;
                    model.Age = (model.Age == 0) ? 0 : model.Age;
                    model.MobileNo = (model.MobileNo == null) ? "" : model.MobileNo;
                    model.Address = (model.Address == null) ? "" : model.Address;

                    //update in customer in customer table.
                    DoctorDetails detail = Context.DoctorDetails.FirstOrDefault(m => m.Id == model.Id);
                    detail.Baseid = model.Baseid;
                    detail.Name = model.Name;
                    detail.Address = model.Address;
                    detail.EmailId = model.EmailId;
                    detail.MobileNo = model.MobileNo;
                    detail.Age = model.Age;                    

                    Context.Entry(model).CurrentValues.SetValues(detail);
                    Context.SaveChanges();
                    response.id = 1;
                    response.successMessage = "Data Updated Successfully!";
                }
                response.status = true;
                return Json(response);
            }
            catch (Exception ex)
            {
                response.status = false;
                response.successMessage = ex.Message;
                return Json(response);
            }
        }

        [Route("Doctor/DeleteDoctor")]
        public JsonResult DeleteDoctor(int Param)
        {
            try
            {
                var Temp = Context.DoctorDetails.Where(o => o.Id == Param).SingleOrDefault();
                response.id = Temp.Id;
                Context.DoctorDetails.Remove(Temp);
                Context.SaveChanges();
                response.status = true;
                response.successMessage = "Record Deleted Successfull!";
                return Json(response);
            }
            catch (Exception ex)
            {
                response.status = false;
                response.successMessage = ex.Message;
                return Json(response);
            }
        }
    }
}
