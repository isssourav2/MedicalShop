using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreModel.Model;
using ERPMEDICAL.Helper;
using ERPMEDICAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace ERPMEDICAL.Controllers
{
    public class CustomerController : Controller
    {
        ResponseStatus response = new ResponseStatus();
        public ErpMedical Context;
        public CustomerController(ErpMedical _Context)
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
                    var customerList = Context.Customer.ToList();
                    ViewBag.customerList = customerList;
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

        public IActionResult ManageCustomer(int? CustomerID)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                if (CustomerID == null)
                {
                    Customer model = new Customer();
                    return View(model);
                }
                else
                {
                    var context = Context.Customer.FirstOrDefault(x => x.Id == CustomerID);
                    return View(context);
                }
            }
            else
            {
                return Redirect("/User/Login");
            }
           
        }

        [Route("/AddEditCustomer")]
        [HttpPost]
        public JsonResult AddEditCustomer(Customer model)
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
                    Context.Customer.Add(model);
                    Context.SaveChanges();
                    response.id = model.Id;
                    response.successMessage = "Customer Saved Successfully!";
                }
                else
                {
                    //update in base table.
                    basetable.CreatedBy = "";
                    basetable.UpdatedBy = "Admin";
                    basetable.UpdatedDate = DateTime.Now;
                    Context.Base.Add(basetable);
                    Context.SaveChanges();

                    //update in customer in customer table.
                    Customer custDetail = Context.Customer.FirstOrDefault(m => m.Id == model.Id);
                    custDetail.Baseid = model.Baseid;
                    custDetail.Name = model.Name;
                    custDetail.Address = model.Address;
                    custDetail.EmailId = model.EmailId;
                    custDetail.MobileNo = model.MobileNo;
                    custDetail.DlNo = model.DlNo;
                    custDetail.VehicelNo = model.VehicelNo;
                    custDetail.Station = model.Station;
                    custDetail.MedicalCenter = model.MedicalCenter;
                    custDetail.ShippedAdress = model.ShippedAdress;
                    custDetail.State = model.State;
                    custDetail.StateCode = model.StateCode;
                    custDetail.GstnCn = model.GstnCn;

                    Context.Entry(model).CurrentValues.SetValues(custDetail);
                    Context.SaveChanges();
                    response.id = model.Id;
                    response.successMessage = "Customer Updated Successfully!";
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

        [Route("Customer/DeleteCustomer")]
        public JsonResult DeleteCustomer(int Param)
        {
            try
            {
                var Temp = Context.Customer.Where(o => o.Id == Param).SingleOrDefault();
                response.id = Temp.Id;
                Context.Customer.Remove(Temp);
                Context.SaveChanges();
                response.status = true;
                response.successMessage = "Customer Deleted Successfull!";
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
