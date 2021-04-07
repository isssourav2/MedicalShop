
$(document).ready(function () {
    $("#txtOtherCustomer").css('display', 'none');

    const BillingItemClear = function () {
        $("#ddlProduct").val('');
        $("#txtPackage").val('');
        $("#txtDiscount").val(0);
        $("#txtQty").val(0);
        $("#txtBaseValue").val(0);
        $("#txtcgstPercentage").val(0);
        $("#txtcgst").val(0);
        $("#txtsgstPercentage").val(0);
        $("#txtsgst").val(0);
        $("#txtIgstPercentage").val(0);
        $("#txtIgst").val(0);
        $("#txtAmount").val(0);
        vm.BillingItem = {
            Id: 0,
            Baseid: 0,
            SId: 0,
            Qty: 1,
            ProductId: 0,
            ProductName: "",
            Package: "",
            Discount: 0,
            isInterStateTransaction: false,
            BaseValue: 0,
            Cgst: 0,
            CgstPercentage: 0,
            Sgst: 0,
            SgstPercentage: 0,
            Igst: 0,
            IgstPercentage: 0,
            Amount: 0
        };
    }
    
const vm = new Vue({
    el: "#app-container",
    data: {
        salesOrders: [],
        salesTotalAmount: 0,
        selectedProductName: '',
        salesVm: {
            //id: Id,
            CustomerId: customerId,
            InvoiceDate: InvoiceDate.split(" ")[0],
            InvoiceNo: InvoiceNo,
            OtherCustomer: otherCustomer,
            TotalBaseValue: TotalBaseValue,
            TotalCGSTAmount: TCgstAmount,
            TotalSGSTAmount: TSgstAmount,
            TotalIGSTAmount: TIgstAmount,
            TotalAmount: TAmount,
            BillingItems: billingDetails
        },
        BillingItem: {
            Id: 0,
            Baseid: 0,
            SId: 0,
            Qty: 1,
            ProductId: 0,
            ProductName: "",
            Package: "",
            Rate: 0,
            Discount: 0,
            BaseValue: 0,
            isInterStateTransaction: false,
            Cgst: 0,
            CgstPercentage: 0,
            Sgst: 0,
            SgstPercentage: 0,
            Igst: 0,
            IgstPercentage: 0,
            Amount: 0,
            stockQty:0
        },
        salesOrderDisplayVm: [],
        DisplayVmObj: {
            Id: 0,
            Baseid: 0,
            SId: 0,
            Qty: 1,
            ProductId: 0,
            ProductName: "",
            Package: "",
            Rate: 0,
            Discount: 0,
            BaseValue: 0,
            isInterStateTransaction: false,
            Cgst: 0,
            CgstPercentage: 0,
            Sgst: 0,
            SgstPercentage: 0,
            Igst: 0,
            IgstPercentage: 0,
            Amount: 0,
            stockQty: 0
        },
        BillingItems: [],
        products: [],
        customers: [],
        CgstPercentage: 0,
        Cgst: 0,
        Sgst: 0,
        SgstPercentage: 0,
        updateBillingItem: false,
        deleteBillingItem: false,
        isStockQtyExist: false
    },
    mounted() {
        let vm = this;
        //Disable click outside of bootstrap modal area to close modal
        $('#SalesCreateModel').modal({ backdrop: 'static', keyboard: false })
        $("#SalesCreateModel").modal('hide');
        $('#isOutSider').on('change', function () {

            if (!$('#isOutSider').is(':checked')) {
                $(".igstper").css('display', 'none');
                $(".localtax").css('display', 'block');

                //$("#txtIgstPercentage").val(0);
                //$("#txtIgst").val(0);

                $("#txtcgst").val(vm.Cgst);
                $("#txtcgstPercentage").val(vm.CgstPercentage);
                $("#txtsgst").val(vm.Sgst);
                $("#txtsgstPercentage").val(vm.SgstPercentage);
            }
            else {
                $(".igstper").css('display', 'block');
                $(".localtax").css('display', 'none');
                $("#txtsgst").val(0);
                $("#txtsgstPercentage").val(0);
                $("#txtcgst").val(0);
                $("#txtcgstPercentage").val(0);
                vm.BillingItem.IgstPercentage = (parseFloat(vm.BillingItem.CgstPercentage) + parseFloat(vm.BillingItem.SgstPercentage)).toFixed(2);
                vm.BillingItem.Igst = (parseFloat(vm.BillingItem.Cgst) + parseFloat(vm.BillingItem.Sgst)).toFixed(2);
                vm.BillingItem.CgstPercentage = 0;
                vm.BillingItem.Cgst = 0;
                vm.BillingItem.SgstPercentage = 0;
                vm.BillingItem.Sgst = 0;

            }
        })

        //Editing Function
        debugger;
        billingDetails.map(dt => {
            const { id, baseid, billId, productId, productName, package,
                discount, baseValue, cgst, cgstPercentage, sgst,
                sgstPercentage, igst, igstPercentage, amount, qty, rate, stockQty } = dt;
            let billingItem = {};
            billingItem.Id = id;
            billingItem.Baseid = baseid;
            billingItem.SId = billId;
            billingItem.Qty = qty;
            billingItem.ProductId = productId;
            billingItem.ProductName = productName;
            billingItem.Package = package;
            billingItem.Discount = discount;
            billingItem.BaseValue = baseValue;
            billingItem.Cgst = cgst;
            billingItem.CgstPercentage = cgstPercentage;
            billingItem.Sgst = sgst;
            billingItem.SgstPercentage = sgstPercentage;
            billingItem.Igst = igst;
            billingItem.IgstPercentage = igstPercentage;
            billingItem.Amount = amount;
            billingItem.Rate = rate;
            billingItem.stockQty = stockQty;
            vm.BillingItems.push(billingItem);
        })
        console.log("Sales Billing Items", vm.BillingItems);
        //for customer
        this.getCustomer().then(v => {
            $("#ddlCustomers").select2({
                data: v
            });
            $(".containerpurEntry").LoadingOverlay("hide");
            $(`#ddlCustomers option[value=${customerId}]`).attr('selected', 'selected');
        })
        $("#ddlCustomers").on('change', function () {

            vm.salesVm.CustomerId = $(this).val();

        })

        //For Product
        this.getProduct().then(v => {
            $("#ddlProduct").select2({
                data: v
            });
        })
        $("#ddlProduct").on('change', function () {
            vm.BillingItem.ProductId = $(this).val();
            vm.onChange(vm.BillingItem.ProductId);
        })

        //Invoice Date
        $("#txtInvoiceDate").datepicker({
            format: 'dd-mm-yy'
        });
        $("#txtInvoiceDate").on('change', function () {

            let datevalue = $(this).val();
            vm.salesVm.InvoiceDate = datevalue;
        })

    },
    computed: {
    },
    watch: {
        //'BillingItem.CgstPercentage'(newVal) {
        //    debugger;
        //    let taxvalue = ((this.BillingItem.Qty * this.BillingItem.BaseValue) * (this.BillingItem.Discount / 100))
        //    let beforeTaxvalue = (parseFloat(this.BillingItem.BaseValue) + taxvalue);
        //   // vm.BillingItem.BaseValue = beforeTaxvalue.toFixed(2);
        //    //cgst amount
        //    newVal = newVal == undefined ? 0 : newVal;
        //    vm.BillingItem.CgstPercentage = newVal;
        //    let cgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));
        //    //sgst amount
        //    vm.BillingItem.SgstPercentage = parseFloat(vm.BillingItem.SgstPercentage);
        //    let sgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(vm.BillingItem.SgstPercentage) / 100));

        //    vm.BillingItem.Cgst = cgstAmount.toFixed(2);
        //    // vm.BillingItem.Sgst = sgstAmount.toFixed(2);
        //    vm.BillingItem.Amount =
        //        (parseFloat(vm.BillingItem.Cgst) +
        //            parseFloat(sgstAmount) +
        //        parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);
        //},
        //'BillingItem.SgstPercentage'(newVal) {
        //    let taxvalue = ((this.BillingItem.Qty * this.BillingItem.BaseValue) * (this.BillingItem.Discount / 100))
        //    let beforeTaxvalue = (parseFloat(this.BillingItem.BaseValue) + taxvalue);
        //    //vm.BillingItem.BaseValue = beforeTaxvalue.toFixed(2);
        //    //cgst amount
        //    vm.BillingItem.CgstPercentage = parseFloat(vm.BillingItem.CgstPercentage);
        //    let cgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(vm.BillingItem.CgstPercentage) / 100));
        //    //sgst amount

        //    newVal = newVal == undefined ? 0 : newVal;
        //    vm.BillingItem.SgstPercentage = newVal;
        //    let sgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));

        //    //vm.BillingItem.Cgst = cgstAmount.toFixed(2);
        //    vm.BillingItem.Sgst = sgstAmount.toFixed(2);
        //    vm.BillingItem.Amount =
        //        (parseFloat(cgstAmount) +
        //            parseFloat(vm.BillingItem.Sgst) +
        //        parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);
        //    // vm.onchangeTaxValueChange(newVal);
        //},
        //'BillingItem.IgstPercentage'(newVal) {
            
        //    let taxvalue = ((this.BillingItem.Qty * this.BillingItem.BaseValue) * (this.BillingItem.Discount / 100))
        //    let beforeTaxvalue = (parseFloat(this.BillingItem.BaseValue) + taxvalue);
        //    //vm.BillingItem.BaseValue = beforeTaxvalue.toFixed(2);
        //    //igst amount
        //    //   let percentage = vm.BillingItem.IgstPercentage
        //    newVal = newVal == undefined ? 0 : newVal == "" ? 0 : newVal;
        //    vm.BillingItem.IgstPercentage = newVal;
        //    let igstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));
        //    //vm.BillingItem.Cgst = cgstAmount.toFixed(2);
        //    vm.BillingItem.Igst = igstAmount.toFixed(2);
        //    vm.BillingItem.Amount =
        //        (parseFloat(vm.BillingItem.Igst) +
        //        parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);
        //    // vm.onchangeTaxValueChange(newVal);
        //}
        'BillingItem.Discount'(newVal) {
            let taxvalue = (this.BillingItem.Rate * parseInt(this.BillingItem.Qty)) * (this.BillingItem.Discount / 100);
            let beforeTaxvalue = ((parseInt(this.BillingItem.Qty) * this.BillingItem.Rate) - taxvalue);
            this.BillingItem.BaseValue = (parseFloat(beforeTaxvalue)).toFixed(2);
            //  let BaseValue = (this.BillingItem.Rate + taxvalue).toFixed(2);
            //change amount with tax
            let cgstAmount = (beforeTaxvalue.toFixed(2) * (this.BillingItem.CgstPercentage / 100));
            //sgst amount
            let sgstAmount = (beforeTaxvalue.toFixed(2) * (this.BillingItem.SgstPercentage / 100));
            //igst amount
            let igstAmount = (beforeTaxvalue.toFixed(2) * (this.BillingItem.IgstPercentage / 100));


            this.BillingItem.Cgst = cgstAmount.toFixed(2);
            this.BillingItem.Sgst = sgstAmount.toFixed(2);
            this.BillingItem.Igst = igstAmount.toFixed(2);

            //Amount value
            this.BillingItem.Amount = (parseFloat(this.BillingItem.Cgst) +
                parseFloat(this.BillingItem.Sgst) +
                parseFloat(this.BillingItem.Igst) +
                parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);
        },
        'BillingItem.Rate'(newVal) {
            //alert("Rate" + newVal);
            this.SalesCalculation();
        }
    },
    destroyed: function () {

    },
    methods: {
        getCustomer() {
            let GetCustomerPromises = new Promise((resolve, reject) => {
                // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
                // In this example, we use setTimeout(...) to simulate async code. 
                // In reality, you will probably be using something like XHR or an HTML5 API.
                axios.get('/Customer')
                    .then(response => {
                        if (response.status !== false) {
                            let Customers = response.data;
                            const modCustomers = Customers.map(x => {
                                const { id, name } = x;
                                var obj = {
                                    id: id,
                                    text: name
                                }
                                return obj;
                            });
                            resolve(modCustomers)  // Yay! Everything went well!
                            //console.log("Product List: ", this.productList);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
            return GetCustomerPromises;
        },
        getProduct() {
            let GetproductPromises = new Promise((resolve, reject) => {
                // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
                // In this example, we use setTimeout(...) to simulate async code. 
                // In reality, you will probably be using something like XHR or an HTML5 API.
                axios.get('/GetAllProduct')
                    .then(response => {
                        if (response.status !== false) {
                            let products = response.data;
                            const modproducts = products.map(x => {
                                const { id, productName } = x;
                                var obj = {
                                    id: id,
                                    text: productName
                                }
                                return obj;
                            });
                           // console.log("Product List: ", products);
                            resolve(modproducts)  // Yay! Everything went well!

                        }
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
            return GetproductPromises;
        },
        onSubmit: function () {
            debugger;
            let vm = this;
            let BillingItem = [];

            const { BillingItems } = vm.salesVm;



            //destruct BillingItems array to retrieve data
            BillingItems.map(x => {
                const { Id, Baseid, SId, Qty, ProductId,
                    ProductName, Package, Discount,
                    BaseValue,  Cgst, CgstPercentage,
                    Sgst, SgstPercentage, Igst, IgstPercentage, Amount,Rate } = x;

                BillingItem.push({
                    Id: Id,
                    Baseid: Baseid,
                    BillId: SId,
                    Qty: Qty,
                    ProductId: ProductId,
                    ProductName: ProductName,
                    Package: Package,
                    Discount: Discount,
                    BaseValue: BaseValue,
                    Cgst: Cgst,
                    CgstPercentage: CgstPercentage,
                    Sgst: Sgst,
                    SgstPercentage: SgstPercentage,
                    Igst: Igst,
                    IgstPercentage: IgstPercentage,
                    Amount: Amount,
                    Rate:Rate
                })
            })

            //Assign new object for insert
            
            let salesVm = {
               // Id: vm.salesVm.id,
                CustomerId: vm.salesVm.CustomerId,
                InvoiceDate: vm.salesVm.InvoiceDate,
                InvoiceNo: vm.salesVm.InvoiceNo,
                OtherCustomer: vm.salesVm.OtherCustomer,
                TotalBaseValue: vm.salesVm.TotalBaseValue,
                TotalCgst: vm.salesVm.TotalCGSTAmount,
                TotalAmount: vm.salesVm.TotalAmount,
                TotalSgst: vm.salesVm.TotalSGSTAmount,
                TotalIgst: vm.salesVm.TotalIGSTAmount,
                InvoiceBillDetails: BillingItem
            };

            this.deleteBillingItem = false;
            this.updateBillingItem = false;
            if (vm.ValidateBillingOrderForm() !== false) {
                $.ajax({ url: "/BillingSave", data: salesVm, method: "POST" })
                    .done(function (response) {
                        if (response.status) {
                            location.replace("/Billing/Index");
                        }
                        else if (!response.status && response.errorMessage == "session out") {
                            location.replace("/User/Login");
                        }
                        else {
                            alert(response.errorMessage);
                            BillingItemClear();
                        }
                    }).fail(function () {
                        // toastr.error("Can not add new bug!");
                    }).always(function () {
                        //vm.clearData();
                    });
            }
            else {
                event.preventDefault();
            }
        },
        //for tax value calculation before tax (BaseValue*qty)*discountPercentage
        calculateAmount(event) {
            let stockqty = parseInt(document.getElementById('lblStockQty').textContent);
            if (stockqty < parseInt(event.target.value)) {
                toastr.error("your product stock is exist", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                //  document.getElementById('txtQty').disabled = true;
                this.isStockQtyExist = true;
                return;
            }
            else {
                this.isStockQtyExist = false;
            }  

           this.SalesCalculation();

            // this.deleteBillingItem = false;
            // this.updateBillingItem = false;
        },
        onChange(event) {
            let vm = this;
            debugger;
            let orderitems = this.BillingItems.filter(function (obj) {
                return obj.Id == event;
            })

            //console.log("product data", evente);
            if (orderitems.length == 0) {
                let productdivid = document.getElementById("ddlProduct");

                let textOfProduct = productdivid.options[productdivid.selectedIndex].text;
                this.selectedProductName = textOfProduct;
                vm.DisplayVmObj.ProductName = this.selectedProductName;
                axios.get(`/GetAllProductByID?id=${event}`).then(response => {
                    console.log(response.data);
                    vm.DisplayVmObj.Id = response.data.id;
                    vm.DisplayVmObj.Package = response.data.package;
                    vm.DisplayVmObj.Discount = response.data.discount;
                    vm.DisplayVmObj.CgstPercentage = response.data.cgstPer;
                    vm.DisplayVmObj.SgstPercentage = response.data.sgstPer;
                    vm.DisplayVmObj.Rate = response.data.salesPrice != null ? response.data.salesPrice:0;
                    //    vm.BillingItem.IgstPercentage = response.data.igstPer;

                    //tax value
                    let taxvalue = ((this.DisplayVmObj.Qty * this.DisplayVmObj.Rate) * (this.DisplayVmObj.Discount / 100))
                    let beforeTaxvalue = ((this.DisplayVmObj.Qty * this.DisplayVmObj.Rate) - taxvalue);
                    vm.DisplayVmObj.BaseValue = beforeTaxvalue.toFixed(2);
                    //cgst amount
                    let cgstAmount = (beforeTaxvalue.toFixed(2) * (vm.DisplayVmObj.CgstPercentage / 100));
                    //sgst amount
                    let sgstAmount = (beforeTaxvalue.toFixed(2) * (vm.DisplayVmObj.SgstPercentage / 100));

                    vm.DisplayVmObj.Cgst = cgstAmount.toFixed(2);
                    vm.DisplayVmObj.Sgst = sgstAmount.toFixed(2);

                    //set value
                    vm.CgstPercentage = response.data.cgstPer;
                    vm.Cgst = cgstAmount.toFixed(2);
                    vm.Sgst = sgstAmount.toFixed(2);
                    vm.SgstPercentage = response.data.sgstPer;

                    //set qty value and validate qty

                    axios.get(`/StockValue?Id=${response.data.id}`).then(response => {
                        document.getElementById("lblStockQty").textContent = response.data.stockCount;
                        // console.log("stock qty:",response.data.stockCount);
                    })

                    //Amount value
                    vm.DisplayVmObj.Amount = (parseFloat(vm.DisplayVmObj.Cgst) + parseFloat(vm.DisplayVmObj.Sgst) + parseFloat(vm.DisplayVmObj.BaseValue)).toFixed(2);
                })

                vm.salesOrderDisplayVm.push(vm.DisplayVmObj);
                //this.deleteBillingItem = false;
            }
            else {
                Swal.fire('Uplicate!', 'Duplicate Product is not allowed!', 'error')
            }

        },
        onOrderItemSaved: function () {
            if (this.BillingItem.ProductId != 0) {
                debugger;
                if (this.isStockQtyExist) {
                    toastr.error("your product stock is exist", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    return;
                }
                let stockqty = parseInt(document.getElementById('lblStockQty').textContent);
                if (stockqty == 0) {
                    toastr.error("your product stock is exist", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    return;
                }
                //this.BillingItems = this.salesOrderDisplayVm;
                // if (!this.deleteBillingItem)
                // this.salesVm.BillingItems = [];
                this.salesVm.BillingItems = this.salesOrderDisplayVm;
                this.salesTotalAmount = (parseFloat(this.salesTotalAmount) + parseFloat(this.BillingItem.Amount));
                this.salesVm.TotalAmount = this.salesTotalAmount;
                console.log("state transaction state", $('#isOutSider').is(':checked'));
                this.BillingItem.isInterStateTransaction = $('#isOutSider').is(':checked');
                BillingItemClear();
                //calculate Total CGST SGST IGST
                let cgstAmt = 0;
                let sgstAmt = 0;
                let igstAmt = 0;
                let totalBaseValue = 0;
                let TotalAmount = 0;
                this.BillingItems.map(x => {
                    cgstAmt = (parseFloat(cgstAmt) + parseFloat(x.Cgst)).toFixed(2);
                    sgstAmt = (parseFloat(sgstAmt) + parseFloat(x.Sgst)).toFixed(2);
                    igstAmt = (parseFloat(igstAmt) + parseFloat(x.Igst)).toFixed(2);
                    TotalAmount = (parseFloat(TotalAmount) + parseFloat(x.Amount)).toFixed(2);
                    totalBaseValue = (parseFloat(totalBaseValue) + parseFloat(x.TotalBaseValue)).toFixed(2);
                });
                debugger;
                this.salesVm.TotalBaseValue = parseFloat(totalBaseValue).toFixed(2);
                this.salesVm.TotalCGSTAmount = parseFloat(cgstAmt).toFixed(2);
                this.salesVm.TotalSGSTAmount = parseFloat(sgstAmt).toFixed(2);
                this.salesVm.TotalIGSTAmount = parseFloat(igstAmt).toFixed(2);
                this.salesVm.TotalAmount = TotalAmount;
                this.deleteBillingItem = false;
                this.updateBillingItem = false;

                //console.log("Purchase data item array", this.BillingItems);
                $("#SalesCreateModel").modal('hide');
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'please select Product!',
                    footer: '<a href>Why do I have this issue?</a>'
                })
            }
        },
        OpenModal: function () {
            debugger;
            // this.deleteBillingItem = false;
            this.updateBillingItem = false;
            //this.BillingItem = {
            //    Id: 0,
            //    Baseid: 0,
            //    SId: 0,
            //    Qty: 1,
            //    ProductId: 0,
            //    ProductName: "",
            //    Package: "",
            //    Discount: 0,
            //    BaseValue: 0,
            //    isInterStateTransaction: false,
            //    Cgst: 0,
            //    CgstPercentage: 0,
            //    Sgst: 0,
            //    SgstPercentage: 0,
            //    Igst: 0,
            //    IgstPercentage: 0,
            //    Amount: 0
            //};
            document.getElementById("isOutSider").checked = false;

           // this.clearMethod(this);
            //intialy open
            $(".igstper").css('display', 'none');
            $(".localtax").css('display', 'block');
            this.BillingItem.Rate = 0;
            this.BillingItem.stockQty = 0;
            //$("#txtIgstPercentage").val(0);
            //$("#txtIgst").val(0);
            $("#ddlProduct").val(0);
            $("#txtcgst").val(vm.Cgst);
            $("#txtcgstPercentage").val(vm.CgstPercentage);
            $("#txtsgst").val(vm.Sgst);
            $("#txtsgstPercentage").val(vm.SgstPercentage);
            //  $("#ddlProduct").val('');
            $("#SalesCreateModel").modal('show');
        },
        onOrderItemDelete: function (data) {
            Swal.fire({
                title: 'Once deleted, you will not be able to recover this data?',
                showCancelButton: true,
                confirmButtonText: `Delete`
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    const orderitems = this.BillingItems.filter(function (obj) {
                        return obj.Id !== data.Id;
                    })
                    this.BillingItems = [];
                    this.BillingItems = orderitems;
                    debugger;
                    //change on delete for total amount
                    this.salesVm.TotalAmount = (parseFloat(this.salesVm.TotalAmount) - parseFloat(data.Amount)).toFixed(2);
                    this.salesVm.TotalCGSTAmount = (parseFloat(this.salesVm.TotalCGSTAmount) - parseFloat(data.Cgst)).toFixed(2);
                    this.salesVm.TotalSGSTAmount = (parseFloat(this.salesVm.TotalSGSTAmount) - parseFloat(data.Sgst)).toFixed(2);
                    this.salesVm.TotalIGSTAmount = (parseFloat(this.salesVm.TotalIGSTAmount) - parseFloat(data.Igst)).toFixed(2);
                    this.salesVm.BillingItems = this.BillingItems;
                    this.deleteBillingItem = true;
                    this.updateBillingItem = false;
                    //  console.log("Original data", this.BillingItems);
                    //  console.log("After delete data", this.salesVm.BillingItems);
                    Swal.fire('Delete!', 'Poof! Your data has been deleted!', 'success')
                }
            })
        },
        onOrderItemEdit: function (data) {
           // this.salesVm.BillingItems.push(this.BillingItem);
            [this.BillingItem] = [data];
            console.log("edit data", this.BillingItem);
            this.updateBillingItem = true;
            
            //if (data.isInterStateTransaction) {
            //    //$('#isOutSider').checked = true;
            //    document.getElementById("isOutSider").checked = true;
            //    $(".igstper").css('display', 'block');
            //    $(".localtax").css('display', 'none');
            //}
            //else {
            //    // $('#isOutSider').checked = false;
            //    document.getElementById("isOutSider").checked = false;
            //    $(".igstper").css('display', 'none');
            //    $(".localtax").css('display', 'block');
            //}
            $(`#ddlProduct option[value=${data.ProductId}]`).attr('selected', 'selected');
            $("#SalesCreateModel").modal('show');
            this.deleteBillingItem = false;
        },
        onUpdateData: function () {
            //console.log("updated value", this.BillingItem);
            //find index
            let vm = this;
            debugger;
          
            this.BillingItems.map(x => {
                if (x.Id == vm.BillingItem.Id) {
                    let indexOfItem = this.BillingItems.indexOf(x);
                    this.BillingItems.splice(indexOfItem, 1, this.BillingItem);
                }
                //billingAmount = billingAmount + parseFloat(x.Amount);
                //billingcgstAmount = billingcgstAmount + parseFloat(x.Cgst);
                //billingsgstAmount = billingsgstAmount + parseFloat(x.Sgst);
                //billingigstAmount = billingigstAmount + parseFloat(x.Igst);
            })
            debugger;


            let cgstAmt = 0;
            let sgstAmt = 0;
            let igstAmt = 0;
            let TotalAmount = 0;
            this.BillingItems.map(x => {
                cgstAmt = (parseFloat(cgstAmt) + parseFloat(x.Cgst)).toFixed(2);
                sgstAmt = (parseFloat(sgstAmt) + parseFloat(x.Sgst)).toFixed(2);
                igstAmt = (parseFloat(igstAmt) + parseFloat(x.Igst)).toFixed(2);
                TotalAmount = (parseFloat(TotalAmount) + parseFloat(x.Amount)).toFixed(2);
            });
            this.salesVm.TotalCGSTAmount = parseFloat(cgstAmt).toFixed(2);
            this.salesVm.TotalSGSTAmount = parseFloat(sgstAmt).toFixed(2);
            this.salesVm.TotalIGSTAmount = parseFloat(igstAmt).toFixed(2);

            this.salesVm.TotalAmount = TotalAmount;
         
            //console.log("index of purchase Order", poItem);
            this.deleteBillingItem = false;
            this.updateBillingItem = false;
            $("#SalesCreateModel").modal('hide');
            swal.fire('Good job!', 'Product update successfully!!', 'success');
        },
        clearMethod: function (thisObj) {
            debugger;
           // thisObj.BillingItem.Id = 0;
            thisObj.BillingItem.Baseid = 0;
            thisObj.BillingItem.SId = 0;
            thisObj.BillingItem.Qty = 0;
            thisObj.BillingItem.ProductId = 0;
            thisObj.BillingItem.ProductName = "";
            thisObj.BillingItem.Package = "";
            thisObj.BillingItem.Discount = 0;
            thisObj.BillingItem.BaseValue = 0;
            thisObj.BillingItem.Cgst = 0;
            thisObj.BillingItem.CgstPercentage = 0;
            thisObj.BillingItem.Sgst = 0;
            thisObj.BillingItem.SgstPercentage = 0;
            thisObj.BillingItem.Igst = 0;
            thisObj.BillingItem.IgstPercentage = 0;
            thisObj.BillingItem.Amount = 0;
            thisObj.BillingItem.Rate = 0;
            thisObj.BillingItem.stockQty = 0;
        },
        SalesCalculation: function () {
            let taxvalue = (this.DisplayVmObj.Rate * parseInt(this.DisplayVmObj.Qty)) * (this.DisplayVmObj.Discount / 100);
            let beforeTaxvalue = ((parseInt(this.DisplayVmObj.Qty) * this.DisplayVmObj.Rate) - taxvalue);
            this.DisplayVmObj.BaseValue = (parseFloat(beforeTaxvalue)).toFixed(2);
            //  let BaseValue = (this.BillingItem.Rate + taxvalue).toFixed(2);
            //change amount with tax
            let cgstAmount = (beforeTaxvalue.toFixed(2) * (this.DisplayVmObj.CgstPercentage / 100));
            //sgst amount
            let sgstAmount = (beforeTaxvalue.toFixed(2) * (this.DisplayVmObj.SgstPercentage / 100));
            //igst amount
            let igstAmount = (beforeTaxvalue.toFixed(2) * (this.DisplayVmObj.IgstPercentage / 100));


            this.BillingItem.Cgst = cgstAmount.toFixed(2);
            this.BillingItem.Sgst = sgstAmount.toFixed(2);
            this.BillingItem.Igst = igstAmount.toFixed(2);

            //Amount value
            this.BillingItem.Amount = (parseFloat(this.DisplayVmObj.Cgst) +
                parseFloat(this.DisplayVmObj.Sgst) +
                parseFloat(this.DisplayVmObj.Igst) +
                parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);
        },
        //onCancel: function () {
        //    debugger;
        //    if (this.BillingItem.Rate == 0) {
        //        $('#SalesCreateModel').modal({
        //            backdrop: 'static', keyboard: false,
        //            show: true })  
        //    }
        //    else {
        //        $("#SalesCreateModel").modal({
        //            backdrop: 'static', keyboard: false,
        //            show: false
        //        });
        //    }
        //},
        ValidateBillingOrderForm: function () {
            if (document.getElementById("txtInvoiceDate").value === '') {
                toastr.error("Invoice Date can't be blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                return false;
            }

            //if (document.getElementById("txtNaration").value === '') {
            //    toastr.error("Naration can't be blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
            //    return false;
            //}
            //if (document.getElementById("txtInvoiceNo").value === '') {
            //    toastr.error("InvoiceNo can't be blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
            //    return false;
            //}
            return true;
        }
    }

})
})

