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
    public class ProductController : Controller
    {
        private ResponseStatus response_status;
        private ErpMedical _Context;
        public ProductController(ErpMedical Context)
        {
            response_status = new ResponseStatus();
            _Context = Context;
        }

        /// <summary>
        /// SOURAV MAJI | 02/12/2020
        /// </summary>
        /// <returns></returns>
        public ActionResult List()
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                var productList = _Context.Product.ToList();
                ViewBag.productList = productList;
                return View();
            }
            else
            {
                return Redirect("/User/Login");
            }
            
        }

        public ActionResult ManageProduct(int? ProductID)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                if (ProductID == null)
                {
                    Product model = new Product();
                    return View(model);
                }
                else
                {
                    var context = _Context.Product.FirstOrDefault(x => x.Id == ProductID);
                    return View(context);
                }
            }
            else
            {
                return Redirect("/User/Login");
            }
           
            
        }

        /// <summary>
        /// SOURAV MAJI | 21/11/2020 | ADD EDIT PRODUCTS
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("/AddEditProduct")]
        [HttpPost]
        public JsonResult AddEditProduct(Product model)
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
                    _Context.Base.Add(basetable);
                    _Context.SaveChanges();

                    //addition in product table
                    model.Baseid = basetable.Id;
                    _Context.Product.Add(model);
                    _Context.SaveChanges();

                    response_status.successMessage = "Product Saved Successfully!";
                }
                else
                {
                    //update in base table
                    basetable.CreatedBy = "";
                    basetable.UpdatedBy = "Admin";
                    basetable.UpdatedDate = DateTime.Now;
                    _Context.Base.Add(basetable);
                    _Context.SaveChanges();

                    Product proDetail = _Context.Product.FirstOrDefault(m => m.Id == model.Id);
                    proDetail.Baseid = model.Baseid;
                    proDetail.ProductName = model.ProductName;
                    proDetail.HsnCode = model.HsnCode;
                    proDetail.BatchNo = model.BatchNo;
                    proDetail.ProductDescription = model.ProductDescription;
                    proDetail.Package = model.Package;
                    proDetail.Unit = model.Unit;
                    proDetail.Mrp = model.Mrp;
                    proDetail.Rate = model.Rate;
                    proDetail.Discount = model.Discount;
                    proDetail.CgstPer = model.CgstPer;
                    proDetail.SgstPer = model.SgstPer;
                    proDetail.IgstPer = model.IgstPer;

                    _Context.Entry(model).CurrentValues.SetValues(proDetail);
                    _Context.SaveChanges();
                    response_status.successMessage = "Product Updated Successfully!";
                }

                response_status.id = model.Id;
                response_status.status = true;

                return Json(response_status);
            }
            catch (Exception ex)
            {
                response_status.status = true;
                response_status.errorMessage = ex.Message;
                return Json(response_status);
            }
        }

        /// <summary>
        /// SOURAV MAJI | 21/11/2020 | GET ALL PRODUCTS
        /// </summary>
        /// <returns></returns>
        [Route("/GetAllProduct")]
        [HttpGet]
        public JsonResult GetAllProduct()
        {
            try
            {
                var productList = _Context.Product.ToList();
                return Json(productList);
            }
            catch (Exception ex)
            {
                response_status.status = true;
                response_status.errorMessage = ex.Message;
                return Json(response_status);
            }
        }


        /// <summary>
        /// SOURAV MAJI | 21/11/2020 | GET ALL PRODUCTS by Id
        /// </summary>
        /// <returns></returns>
        [Route("/GetAllProductByID")]
        [HttpGet]
        public JsonResult GetAllProduct(int id)
        {
            try
            {
                var productList = _Context.Product.SingleOrDefault(x=>x.Id==id);
                return Json(productList);
            }
            catch (Exception ex)
            {
                response_status.status = true;
                response_status.errorMessage = ex.Message;
                return Json(response_status);
            }
        }

        /// <summary>
        /// SOURAV MAJI | 21/11/2020 | PRODUCT DELETION
        /// </summary>
        /// <param name="Param"></param>
        /// <returns></returns>
        [Route("Product/DeleteProduct")]        
        public JsonResult DeleteProduct(int Param)
        {
            try
            {
                var Temp = _Context.Product.Where(o => o.Id == Param).SingleOrDefault();
                response_status.id = Temp.Id;
                _Context.Product.Remove(Temp);
                _Context.SaveChanges();
                response_status.status = true;
                response_status.successMessage = "Product Deleted Successfull!";
                return Json(response_status);
            }
            catch (Exception ex)
            {
                response_status.status = true;
                response_status.errorMessage = ex.Message;
                return Json(response_status);
            }
        }
    }
}
