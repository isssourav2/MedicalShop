using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreModel.Model;
using ERPMEDICAL.Helper;
using ERPMEDICAL.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace ERPMEDICAL.Controllers
{
    public class StockController : Controller
    {
        private ErpMedical _Context;
        public StockController(ErpMedical Context)
        {
            _Context = Context;
        }
        public IActionResult Index()
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                var billingInfo = _Context.InvoiceBill.ToList();
                return View(billingInfo);
            }
            else
            {
                return Redirect("/User/Login");
            }
        }
        [Route("/StockValue")]
        [HttpGet]
        public JsonResult StockCount(int Id)
        {
            var stock= _Context.Stock.SingleOrDefault(m => m.ProductId == Id);
            StockVm stck = new StockVm();
            stck.StockCount = stock == null?0: stock.StockQty;
            return Json(stck);
        }
    }
}
