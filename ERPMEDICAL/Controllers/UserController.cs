using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreModel.Model;
using ERPMEDICAL.Helper;
using ERPMEDICAL.Models;
using ERPMEDICAL.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace ERPMEDICAL.Controllers
{
    public class UserController : Controller
    {
        private ResponseStatus response_status;
        private ErpMedical _Context;
        public UserController(ErpMedical Context)
        {
            response_status = new ResponseStatus();
            _Context = Context;
        }
       
        public ActionResult Login()
        {
            return View();
        }
        [Route("/GetAllCompany")]
        [HttpGet]
        public JsonResult GetAllCompany()
        {
            var result = _Context.CompanyBranch.ToList();
            return Json(result);
        }
        [Route("/Login")]
        [HttpPost]
        public JsonResult Login(LoginVm login)
        {
            var user = _Context.User.FirstOrDefault(lg => lg.UserName == login.UserName && lg.Password == login.Password);
            if (user != null)
            {
                HttpContext.Session.Clear();
                SessionHelper.SetObjectAsJson(HttpContext.Session, "userObject", user);
                response_status.successMessage = "success";
                response_status.status = true;
                //return RedirectToAction("Index", "Home");
            }
            else
            {
                response_status.successMessage = "Login";
                response_status.status = false;
            }
            return Json(response_status);
            //return RedirectToAction("Login");
        }
        [Route("/Logout")]
        [HttpGet]
        public ActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Redirect("/User/Login");
        }
    }
}
