using System;

using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using ERPMEDICAL.Models;
using CoreModel.Model;
using ERPMEDICAL.Helper;

namespace ERPMEDICAL.Controllers
{
    public class CompanyController : Controller
    {
        ResponseStatus response = new ResponseStatus();
        public ErpMedical Context;
        public CompanyController(ErpMedical _Context)
        {
            Context = _Context;
        }
        public IActionResult List()
        {
            try
            {
                User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                if (user != null)
                {
                    ViewBag.CurrentUser = user;
                    var comBranchList = Context.CompanyBranch.ToList();
                    ViewBag.comBranchList = comBranchList;
                    return View();
                }
                else
                {
                    return Redirect("/User/Login");
                }
               
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IActionResult ManageCompany(int? Param)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                if (Param == null)
                {
                    CompanyBranch model = new CompanyBranch();
                    return View(model);
                }
                else
                {
                    var context = Context.CompanyBranch.FirstOrDefault(x => x.Id == Param);
                    return View(context);
                }
            }
            else
            {
                return Redirect("/User/Login");
            }
           
        }

        [Route("Company/AddEditBranch")]
        [HttpPost]
        public JsonResult AddEditCompanyBranch(CompanyBranch model)
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

                    //addition in company branch table
                    model.Baseid = basetable.Id;
                    model.Name = (model.Name == null) ? "" : model.Name;
                    model.Address = (model.Address == null) ? "" : model.Address;
                    model.State = (model.State == null) ? "" : model.State;
                    model.StateCode = (model.StateCode == null) ? "" : model.StateCode;
                    model.City = (model.City == null) ? "" : model.City;
                    model.Gstno = (model.Gstno == null) ? "" : model.Gstno;
                    model.Dlno = (model.Dlno == null) ? "" : model.Dlno;

                    Context.CompanyBranch.Add(model);
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
                    model.Name = (model.Name == null) ? "" : model.Name;
                    model.Address = (model.Address == null) ? "" : model.Address;
                    model.State = (model.State == null) ? "" : model.State;
                    model.StateCode = (model.StateCode == null) ? "" : model.StateCode;
                    model.City = (model.City == null) ? "" : model.City;
                    model.Gstno = (model.Gstno == null) ? "" : model.Gstno;
                    model.Dlno = (model.Dlno == null) ? "" : model.Dlno;

                    //update in customer in customer table.
                    CompanyBranch detail = Context.CompanyBranch.FirstOrDefault(m => m.Id == model.Id);
                    detail.Baseid = model.Baseid;
                    detail.Name = model.Name;
                    detail.Address = model.Address;
                    detail.State = model.State;
                    detail.StateCode = model.StateCode;
                    detail.City = model.City;
                    detail.Gstno = model.Gstno;
                    detail.Dlno = model.Dlno;

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
                response.errorMessage = ex.Message;
                return Json(response);
            }
        }

        [Route("Company/DeleteComBranch")]
        [HttpGet]
        public JsonResult DeleteCompanyBranch(int Param)
        {
            try
            {
                var Temp = Context.CompanyBranch.Where(o => o.Id == Param).SingleOrDefault();
                response.id = Temp.Id;
                Context.CompanyBranch.Remove(Temp);
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
