using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CoreModel.Model;
using ERPMEDICAL.Helper;
using ERPMEDICAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace ERPMEDICAL.Controllers
{
    public class ReportController : Controller
    {
        private ResponseStatus response_status;
        private ErpMedical _Context;
        public ReportController(ErpMedical Context)
        {
            response_status = new ResponseStatus();
            _Context = Context;
        }
        public IActionResult DailyStock()
        {
            return View();
        }
        public IActionResult MonthlyStock()
        {
            return View();
        }
        public IActionResult Purcahse()
        {
            return View();
        }
        public IActionResult Sales()
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
               // var billingInfo = _Context.InvoiceBill.ToList();
                return View();
            }
            else
            {
                return Redirect("/User/Login");
            }
        }
        public async Task<IActionResult> Get()
        {
            var path = Path.Combine(
            Directory.GetCurrentDirectory(), "wwwroot\\pdf\\game2.pdf");

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/pdf", "Demo.pdf");
        }
    }
}
