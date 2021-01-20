using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CoreModel.Model;
using ERPMEDICAL.Helper;

namespace ERPMEDICAL.Controllers
{
    public class HomeController : Controller
    {
        private ErpMedical _contextERP;
        public HomeController(ErpMedical contextERP)
        {
            _contextERP = contextERP;
        }
        public ActionResult Index()
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if(user!=null)
            {
                ViewBag.CurrentUser = user;
                return View();
            }
            else
            {
                return Redirect("/User/Login");
            }
          //  
        }
        

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return null;
            //return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
