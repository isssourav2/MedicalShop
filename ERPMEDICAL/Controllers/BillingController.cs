using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CoreModel.Model;
using ERPMEDICAL.Models;
using ERPMEDICAL.ViewModel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp;
using ERPMEDICAL.Helper;
using System.Text.RegularExpressions;

namespace ERPMEDICAL.Controllers
{
    public class BillingController : Controller
    {        
        private ErpMedical _Context;
        private readonly IMapper _mapper;
        private ResponseStatus response_status;
        [Obsolete]
        private IHostingEnvironment hostingEnv;

        [Obsolete]
        public BillingController(ErpMedical Context, IMapper mapper, IHostingEnvironment _hostingEnv)
        {
            _Context = Context;
            _mapper = mapper;
            hostingEnv = _hostingEnv;
            response_status = new ResponseStatus();
        }
        public ActionResult Index()
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

        // GET: BillingController/Details/5
        public ActionResult Details(int id)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                BillingViewModel viewModel = new BillingViewModel();
                viewModel.InvoiceBill = _Context.InvoiceBill.FirstOrDefault(x => x.InvoiceNo == id);
                if (viewModel.InvoiceBill.CustomerId != 0)
                {
                    viewModel.CustomerName = _Context.Customer
                        .Where(x => x.Id == viewModel.InvoiceBill.CustomerId).FirstOrDefault().Name;
                }
                else
                {
                    viewModel.CustomerName = string.Empty;
                }
                var contextBills = _Context.InvoiceBillDetails.Where(x => x.BillId == id).ToList();

                //List<InvoiceBillDetail> listInvoiceBill = new List<InvoiceBillDetail>();
                //foreach (var item in contextBills)
                //{
                //    var invoicebil = _mapper.Map<InvoiceBillDetail>(item);
                //    listInvoiceBill.Add(invoicebil);
                //}
                viewModel.InvoiceBillDetails = contextBills;
                return View(viewModel);
            }
            else
            {
                return Redirect("/User/Login");
            }
           
        }
        [Route("/Customer")]
        [HttpGet]
        public JsonResult GetCustomer()
        {
            var customers = _Context.Customer.ToList().
                            Select(e => new { e.Id, e.Name });
            return Json(customers);
        }

        // GET: BillingController/Create
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

        // POST: BillingController/Create
        [Route("/BillingSave")]
        [HttpPost]
        public JsonResult Create(BillingViewModel BillingCollection)
        {
            try
            {
                if (Convert.ToInt32(BillingCollection.InvoiceNo) != 0)
                {
                    //update base Table
                    Base basetable = new Base();
                    basetable.CreatedBy = "";
                    basetable.UpdatedBy = "Admin";
                    basetable.UpdatedDate = DateTime.Now;
                    //basetable.UpdatedDate = DateTime.Now;
                    _Context.Base.Add(basetable);
                    _Context.SaveChanges();
                    BillingCollection.Baseid = basetable.Id;
                    //Remove the old Entry
                    var invoiceDetails = _Context.InvoiceBillDetails.
                        Where(x => x.BillId == Convert.ToInt32(BillingCollection.InvoiceNo)).ToList();
                    foreach (var item in invoiceDetails)
                    {
                        _Context.InvoiceBillDetails.Remove(item);
                        _Context.SaveChanges();
                    }
                    var context = _Context.InvoiceBill.FirstOrDefault(x => x.InvoiceNo == Convert.ToInt32(BillingCollection.InvoiceNo));
                    _Context.InvoiceBill.Remove(context);
                    _Context.SaveChanges();

                    //Add New Entry
                    InvoiceBill invoice = _mapper.Map<InvoiceBill>(BillingCollection);
                    //Add UserId and CompanyBranchId
                    User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                    if (user != null)
                    {
                        invoice.UserId = user.Id;
                        invoice.CompanyBranchId = user.CompanyBranchId;
                        invoice.InvoiceDate = Convert.ToDateTime(invoice.InvoiceDate);
                    }
                    else
                    {
                        response_status.id = 0;
                        response_status.status = false;
                        response_status.errorMessage = "session out";
                        return Json(response_status);
                    }
                    _Context.InvoiceBill.Add(invoice);
                    //_Context.Entry(poOrder).CurrentValues.SetValues(poOrder);
                    _Context.SaveChanges();

                    foreach (var item in invoiceDetails)
                    {
                        var invoicebill = _Context.InvoiceBillDetails.Where(x => x.Id == item.Id).FirstOrDefault();
                        if (invoicebill != null)
                        {
                            _Context.InvoiceBillDetails.Remove(invoicebill);
                            _Context.SaveChanges();
                        }
                        item.Baseid = basetable.Id;
                        item.BillId = invoice.InvoiceNo;
                        //Add to blling details
                        _Context.InvoiceBillDetails.Add(item);
                        _Context.SaveChanges();

                        //stock creation
                        var stockCreation = _Context.Stock.Where(x => x.ProductId == item.ProductId).FirstOrDefault();
                        if (stockCreation != null)
                        {
                            //remove from stock
                            _Context.Stock.Remove(stockCreation);
                            _Context.SaveChanges();
                            Stock stck = new Stock();
                            stck.ProductId = stockCreation.ProductId;
                            int originalQty = stockCreation.StockQty.Value < 0 ? 0 : stockCreation.StockQty.Value;
                            if (originalQty == 0 || originalQty < item.Qty)
                            {
                                stck.StockQty = item.Qty - originalQty;
                            }
                            else
                            {
                                stck.StockQty = originalQty - item.Qty;
                            }
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

                    response_status.id = BillingCollection.Id;
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
                 
                    BillingCollection.Baseid = basetable.Id;

                    //Add New Entry
                    InvoiceBill invoice = _mapper.Map<InvoiceBill>(BillingCollection);
                    //Add UserId and CompanyBranchId
                    User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                    if (user != null)
                    {
                        invoice.UserId = user.Id;
                        invoice.CompanyBranchId = user.CompanyBranchId;
                        invoice.InvoiceDate = Convert.ToDateTime(invoice.InvoiceDate);
                    }
                    else
                    {
                        response_status.id = 0;
                        response_status.status = false;
                        response_status.errorMessage = "session out";
                        return Json(response_status);
                    }
                    _Context.InvoiceBill.Add(invoice);
                    _Context.SaveChanges();

                    foreach (var item in BillingCollection.InvoiceBillDetails)
                    {
                        var invoicebill = _Context.InvoiceBillDetails.Where(x => x.Id == item.Id).FirstOrDefault();
                        if(invoicebill != null)
                        {
                            _Context.InvoiceBillDetails.Remove(invoicebill);
                            _Context.SaveChanges();
                        }
                        item.Baseid = basetable.Id;
                        item.BillId = invoice.InvoiceNo;
                        //Add to blling details
                        _Context.InvoiceBillDetails.Add(item);
                        _Context.SaveChanges();

                        //stock creation
                        var stockCreation = _Context.Stock.Where(x => x.ProductId == item.ProductId).FirstOrDefault();
                        if (stockCreation != null)
                        {
                            //remove from stock
                            _Context.Stock.Remove(stockCreation);
                            _Context.SaveChanges();
                            Stock stck = new Stock();
                            stck.ProductId = stockCreation.ProductId;
                           int originalQty = stockCreation.StockQty.Value < 0 ? 0 : stockCreation.StockQty.Value;
                            if(originalQty==0 || originalQty< item.Qty)
                            {
                                stck.StockQty = item.Qty-originalQty;
                            }
                            else
                            {
                                stck.StockQty = originalQty - item.Qty;
                            }
                        
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

                    response_status.id = BillingCollection.Id;
                    //var rowId = BillingCollection.Id;
                    response_status.status = true;
                    response_status.successMessage = "data inserted successfull!!";
                    return Json(response_status);
                }
            }
            catch (Exception er)
            {
                response_status.id = 0;
                response_status.status = false;
                response_status.successMessage = er.Message;
                return Json(response_status);
            }
        }

        // GET: BillingController/Edit/5
        public ActionResult Edit(int id)
        {

            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                BillingViewModel viewModel = new BillingViewModel();
                viewModel.InvoiceBill = _Context.InvoiceBill.FirstOrDefault(x => x.InvoiceNo == id);
                if (viewModel.InvoiceBill.CustomerId != 0)
                {
                    viewModel.CustomerName = _Context.Customer.Where(x => x.Id == viewModel.InvoiceBill.CustomerId).FirstOrDefault().Name;
                }
                else
                {
                    viewModel.CustomerName = string.Empty;
                }
                
                var contextBills = _Context.InvoiceBillDetails.Where(x => x.BillId == id).ToList();
                List<InvoiceBillDetails> listInvoiceBill = new List<InvoiceBillDetails>();
                foreach (var item in contextBills)
                {
                    //var invoicebil = _mapper.Map<InvoiceBillDetail>(item);
                    item.StockQty = _Context.Stock.FirstOrDefault(stk => stk.ProductId == item.ProductId).StockQty.HasValue ?
                        _Context.Stock.FirstOrDefault(stk => stk.ProductId == item.ProductId).StockQty.Value : 0;
                    listInvoiceBill.Add(item);
                }
                viewModel.InvoiceBillDetails = listInvoiceBill;
                return View(viewModel);
            }
            else
            {
                return Redirect("/User/Login");
            }
         
        }

       
       

        // GET: BillingController/Delete/5
        public ActionResult Delete(int id)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                BillingViewModel viewModel = new BillingViewModel();
                viewModel.InvoiceBill = _Context.InvoiceBill.FirstOrDefault(x => x.InvoiceNo == id);
                viewModel.CustomerName = viewModel.InvoiceBill.CustomerId!=0? _Context.Customer.Where(x => x.Id == viewModel.InvoiceBill.CustomerId).FirstOrDefault().Name:string.Empty;
               
                return View(viewModel);
            }
            else
            {
                return Redirect("/User/Login");
            }
        
        }

        [HttpGet]
        public ActionResult BillPreview(int id)
        {
            User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
            if (user != null)
            {
                ViewBag.CurrentUser = user;
                var companyRes = _Context.CompanyBranch.FirstOrDefault(com => com.Id == user.CompanyBranchId);
                BillPreviewVM billPrev = new BillPreviewVM();
                //company
                billPrev.CompanyAddress = companyRes.Address;
                billPrev.CompanyName = companyRes.Name;
                billPrev.CompanyMobNo =companyRes.MoBno;
                billPrev.CompanyEmail = companyRes.EmailId;
                billPrev.CompanySubHeading = companyRes.SubHeading;
                billPrev.CompanyGSTNo = companyRes.Gstno;
                billPrev.CompanyDLNo = companyRes.Dlno;
                var invoice = _Context.InvoiceBill.FirstOrDefault(inv=>inv.InvoiceNo==id);
                billPrev.InvoiceNo = invoice.InvoiceNo.ToString();
                billPrev.InvoiceDate = invoice.InvoiceDate.Value.ToString("dd/MM/yyyy");
                billPrev.BillTotalAmount = invoice.TotalAmount.Value;
                var customerObj = _Context.Customer.FirstOrDefault(cust => cust.Id ==invoice.CustomerId.Value);
                //Customer
                billPrev.PlaceOfSupply = customerObj.Station;
                billPrev.CustomerState = customerObj.State;
                billPrev.CustomerGSTCN= customerObj.GstnCn;
                billPrev.CustomerMobNo = customerObj.MobileNo;
                billPrev.CustomerEmail = customerObj.EmailId;
                billPrev.BillTo = customerObj.Address;
                billPrev.BillAmountInWord= NumberToWords.ConvertAmount(double.Parse(invoice.TotalAmount.Value.ToString()));
                //Product
                
                billPrev.InvoiceBillDetails = _Context.InvoiceBillDetails.Where(m => m.BillId == id).ToList();
                
                return View(billPrev);
            }
            else
            {
                return Redirect("/User/Login");
            }
        }

        [Obsolete]
        public async Task<IActionResult> BillDownload()
        {
            try
            {
                User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                if (user != null)
                {
                    //getting the root path
                    string webRootPath = hostingEnv.WebRootPath;
                string PathWithFolder = Path.Combine(webRootPath, "html");
                string HtmlFileName = "InvoiceBill.html";
                //get html filepath with directory                
                string fullFilePath = Path.Combine(PathWithFolder, HtmlFileName);
                    using (StreamReader Reader = new StreamReader(fullFilePath))
                    {
                        //TravelRequisitionModel model = trvlReqRepository.GetTrvlReqDetailViewByReqID(TrvlReqID, configuration);
                        string TempContent = null;
                        string Content = Reader.ReadToEnd();
                        string blank = "---";
                        //replaced by dynamic data
                        TempContent = Regex.Replace(Content, "#CustGSTNo#", "01254825");
                        TempContent = Regex.Replace(TempContent, "#DLNo#", "DL565214");
                        //TempContent = Regex.Replace(TempContent, "txtReqBy", model.EmpName);
                        //TempContent = Regex.Replace(TempContent, "txtReqDate", model.strRequisitionDate);
                        //TempContent = Regex.Replace(TempContent, "txtSapOrg", model.SapOrgName);
                        //if (model.ClientName == "") { TempContent = Regex.Replace(TempContent, "txtClientName", blank); }
                        //else { TempContent = Regex.Replace(TempContent, "txtClientName", model.ClientName); }
                        //if (model.BrandName == "") { TempContent = Regex.Replace(TempContent, "txtBrand", blank); }
                        //else { TempContent = Regex.Replace(TempContent, "txtBrand", model.BrandName); }
                        //if (model.OtherCategory == "") { TempContent = Regex.Replace(TempContent, "txtOtherCat", blank); }
                        //else { TempContent = Regex.Replace(TempContent, "txtOtherCat", model.OtherCategory); }
                        //TempContent = Regex.Replace(TempContent, "txtBillable", model.Billable);
                        //if (model.JobNo == "") { TempContent = Regex.Replace(TempContent, "txtJobNo", blank); }
                        //else { TempContent = Regex.Replace(TempContent, "txtJobNo", model.JobNo); }
                        //TempContent = Regex.Replace(TempContent, "txtClientPO", model.ClientPO);
                        //TempContent = Regex.Replace(TempContent, "txtTrvlTyp", model.TrvlBookingBy);
                        //TempContent = Regex.Replace(TempContent, "txtFromDate", model.strTrvlFrmDate);
                        //TempContent = Regex.Replace(TempContent, "txtToDate", model.strTrvlToDate);
                        //string PrefDeptTime = model.DeptTimeFrom + " - " + model.DeptTimeTo;
                        //TempContent = Regex.Replace(TempContent, "txtPrefDeptTime", PrefDeptTime);
                        //string PrefArrTime = model.ArrvlTimeFrom + " - " + model.ArrvlTimeTo;
                        //TempContent = Regex.Replace(TempContent, "txtPrefArrvlTime", PrefArrTime);
                        //TempContent = Regex.Replace(TempContent, "txtLocation", model.TrvlLocation);
                        //string TravelPref = model.strTrvlPrefAir + model.strTrvlPrefHotel + model.strTrvlPrefCar;
                        //TempContent = Regex.Replace(TempContent, "txtTrvlPref", TravelPref);
                        //if (model.TrvlDescription == "") { TempContent = Regex.Replace(TempContent, "txtTrvlDesc", blank); }
                        //else { TempContent = Regex.Replace(TempContent, "txtTrvlDesc", model.TrvlDescription); }
                        //TempContent = Regex.Replace(TempContent, "txtSbmt2CtHD", model.SbmtToCtHdName);
                        //TempContent = Regex.Replace(TempContent, "txtApprovedBy", model.ApprovedBy);
                        //TempContent = Regex.Replace(TempContent, "txtApprovalDate", model.ApprovalDate);

                        //StringBuilder sb = new StringBuilder();                                        
                        //StringReader sr = new StringReader(TempContent);
                        TextReader textReader = new StringReader(TempContent);
                        string dateTime = DateTime.Now.ToString("ddMMyy-HHmmffff");

                        //create pdf file in a folder
                        string folderName = "produced-pdf";
                        string fileName = dateTime + ".pdf";
                        string tPath = Path.Combine(webRootPath, folderName);
                        string fullPath = Path.Combine(tPath, fileName);
                        //StringWriter sw = new StringWriter();
                        var output = new FileStream(fullPath, FileMode.Create);
                        Document pdfDoc = new Document(PageSize.A4, 10F, 10F, 10F, 10F);
                        HTMLWorker htmlparser = new HTMLWorker(pdfDoc);

                        iTextSharp.text.pdf.PdfWriter.GetInstance(pdfDoc, output);
                        pdfDoc.Open();
                        //htmlparser.Parse(sr);
                        htmlparser.Parse(textReader);
                        pdfDoc.Close();

                        var memory = new MemoryStream();
                        using (var stream = new FileStream(fullPath, FileMode.Open))
                        {
                            await stream.CopyToAsync(memory);
                        }
                        memory.Position = 0;
                        var ext = Path.GetExtension(fullPath).ToLowerInvariant();
                        return File(memory, GetMimeTypes()[ext], Path.GetFileName(fullPath));
                    }
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

        //get file extension
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".xls", "application/vnd.ms-excel"},
                {".csv", "text/csv"},
                {".ppt", "application/vnd.ms-powerpoint"},
                {".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"}
            };
        }

        // POST: BillingController/Delete/5
        [HttpGet]
        public ActionResult ConfirmDelete(int id)
        {
            try
            {
                User user = SessionHelper.GetObjectFromJson<User>(HttpContext.Session, "userObject");
                if (user != null)
                {
                    ViewBag.CurrentUser = user;
                    var invoiceDetails = _Context.InvoiceBillDetails.Where(x => x.BillId == id).ToList();
                    foreach (var item in invoiceDetails)
                    {
                        //stock remove
                        Stock stck = _Context.Stock.FirstOrDefault(st => st.ProductId == item.ProductId);
                        _Context.Stock.Remove(stck);
                        _Context.SaveChanges();
                        //invoice detailsremove
                        _Context.InvoiceBillDetails.Remove(item);
                        _Context.SaveChanges();
                    }
                    var context = _Context.InvoiceBill.FirstOrDefault(x => x.InvoiceNo == id);
                    _Context.InvoiceBill.Remove(context);
                    _Context.SaveChanges();

                    return RedirectToAction(nameof(Index));
                }
                else
                {
                    return Redirect("/User/Login");
                }
                
            }
            catch
            {
                return View();
            }
        }
    }
}
