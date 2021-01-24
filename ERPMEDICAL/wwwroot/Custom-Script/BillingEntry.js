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
            id: 0,
            CustomerId: 0,
            InvoiceDate: "",
            InvoiceNo: "",
            OtherCustomer: "",
            TotalBaseValue:0,
            TotalCGSTAmount: 0,
            TotalSGSTAmount: 0,
            TotalIGSTAmount: 0,
            TotalAmount: 0,
            BillingItems: []
        },
        BillingItem: {
            Id: 0,
            Baseid: 0,
            SId: 0,
            Qty: 1,
            ProductId: 0,
            ProductName: "",
            Package: "",
            Rate:0,
            Discount: 0,
            BaseValue: 0,
            isInterStateTransaction: false,
            Cgst: 0,
            CgstPercentage: 0,
            Sgst: 0,
            SgstPercentage: 0,
            Igst: 0,
            IgstPercentage: 0,
            Amount: 0
        },
        salesOrderDisplayVm: [],
        BillingItems: [],
        products: [],
        customers: [],
        CgstPercentage: 0,
        Cgst: 0,
        Sgst: 0,
        SgstPercentage: 0,
        updateBillingItem: false,
        deleteBillingItem: false
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
        //for customer
        this.getCustomer().then(v => {
            $("#ddlCustomers").select2({
                data: v
            });
            $(".containerpurEntry").LoadingOverlay("hide");
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
        $("#txtInvoiceDate").datepicker();
        $("#txtInvoiceDate").on('change', function () {

            let datevalue = $(this).val();
            vm.salesVm.InvoiceDate = datevalue;
        })

    },
    computed: {
    },
    watch: {
        'BillingItem.CgstPercentage'(newVal) {
            let taxvalue = ((this.BillingItem.Qty * this.BillingItem.Rate) * (this.BillingItem.Discount / 100))
            let beforeTaxvalue = (this.BillingItem.Rate + taxvalue);
           // vm.BillingItem.BaseValue = beforeTaxvalue.toFixed(2);
            //cgst amount
            newVal = newVal == undefined ? 0 : newVal;
            vm.BillingItem.CgstPercentage = newVal;
            let cgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));
            //sgst amount
            vm.BillingItem.SgstPercentage = parseFloat(vm.BillingItem.SgstPercentage);
            let sgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(vm.BillingItem.SgstPercentage) / 100));

            vm.BillingItem.Cgst = cgstAmount.toFixed(2);
            // vm.BillingItem.Sgst = sgstAmount.toFixed(2);
            vm.BillingItem.Amount =
                (parseFloat(vm.BillingItem.Cgst) +
                    parseFloat(sgstAmount) +
                parseFloat(vm.BillingItem.BaseValue)).toFixed(2);
        },
        'BillingItem.SgstPercentage'(newVal) {
            let taxvalue = ((this.BillingItem.Qty * this.BillingItem.Rate) * (this.BillingItem.Discount / 100))
            let beforeTaxvalue = (this.BillingItem.Rate + taxvalue);
          //  vm.BillingItem.BaseValue = beforeTaxvalue.toFixed(2);
            //cgst amount
            vm.BillingItem.CgstPercentage = parseFloat(vm.BillingItem.CgstPercentage);
            let cgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(vm.BillingItem.CgstPercentage) / 100));
            //sgst amount

            newVal = newVal == undefined ? 0 : newVal;
            vm.BillingItem.SgstPercentage = newVal;
            let sgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));

            //vm.BillingItem.Cgst = cgstAmount.toFixed(2);
            vm.BillingItem.Sgst = sgstAmount.toFixed(2);
            vm.BillingItem.Amount =
                (parseFloat(cgstAmount) +
                    parseFloat(vm.BillingItem.Sgst) +
                parseFloat(vm.BillingItem.BaseValue)).toFixed(2);
            // vm.onchangeTaxValueChange(newVal);
        },
        'BillingItem.IgstPercentage'(newVal) {

            let taxvalue = ((this.BillingItem.Qty * this.BillingItem.Rate) * (this.BillingItem.Discount / 100))
            let beforeTaxvalue = (this.BillingItem.Rate + taxvalue);
           // vm.BillingItem.BaseValue = beforeTaxvalue.toFixed(2);
            //igst amount
            //   let percentage = vm.BillingItem.IgstPercentage
            newVal = newVal == undefined ? 0 : newVal == "" ? 0 : newVal;
            vm.BillingItem.IgstPercentage = newVal;
            let igstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));
            //vm.BillingItem.Cgst = cgstAmount.toFixed(2);
            vm.BillingItem.Igst = igstAmount.toFixed(2);
            vm.BillingItem.Amount =
                (parseFloat(vm.BillingItem.Igst) +
                parseFloat(vm.BillingItem.BaseValue)).toFixed(2);
            // vm.onchangeTaxValueChange(newVal);
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
                    Sgst, SgstPercentage, Igst, IgstPercentage, Amount } = x;

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
                })
            })

            //Assign new object for insert
            
            let salesVm = {
                Id: vm.salesVm.id,
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
            if (salesVm.InvoiceNo != "" && salesVm.InvoiceDate != "") {
                $.ajax({ url: "/BillingSave", data: salesVm, method: "POST" })
                    .done(function (response) {
                        // vm.bugs.splice(0, 0, newBug);

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
                      
                        //Redirect to new page
                    }).fail(function () {
                        // toastr.error("Can not add new bug!");
                    }).always(function () {
                        //vm.clearData();
                    });
            }
            else {
                var html = `<ol><li>Invoice No Required</li>
                                <li>Invoice Date is not blank</li></ol>`;
                Swal.fire({
                    title: '<strong>HTML <u>example</u></strong>',
                    icon: 'info',
                    html: html
                });
                //   swal({ html: true, title: 'Oops!', html: html });
                //swal('Oops!', html,"error");
                // $("#ddlDoctors").focus();
            }
        },
        //for tax value calculation before tax (rate*qty)*discountPercentage
        calculateAmount(event) {
            let taxvalue = (this.BillingItem.Rate * (event.target.value)) * (this.BillingItem.Discount / 100);
            let beforeTaxvalue = (this.BillingItem.Rate + taxvalue);
            this.BillingItem.BaseValue = (parseFloat(this.BillingItem.BaseValue)).toFixed(2);
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
                vm.BillingItem.ProductName = this.selectedProductName;
                axios.get(`/GetAllProductByID?id=${event}`).then(response => {
                    console.log(response.data);
                    vm.BillingItem.Id = response.data.id;
                    vm.BillingItem.Package = response.data.package;
                    vm.BillingItem.Discount = response.data.discount;
                    vm.BillingItem.CgstPercentage = response.data.cgstPer;
                    vm.BillingItem.SgstPercentage = response.data.sgstPer;
                    vm.BillingItem.Rate = response.data.rate;
                    //    vm.BillingItem.IgstPercentage = response.data.igstPer;

                    //if (vm.BillingItem.IgstPercentage != 0) {
                    //    document.getElementById("isOutSider").checked = true;
                    //    $(".igstper").css('display', 'block');
                    //    $(".localtax").css('display', 'none');
                    //    vm.BillingItem.CgstPercentage = 0;
                    //    vm.BillingItem.Cgst = 0;
                    //    vm.BillingItem.SgstPercentage = 0;
                    //    vm.BillingItem.Sgst = 0;
                    //}
                    //else {
                    //    $(".igstper").css('display', 'none');
                    //    $(".localtax").css('display', 'block');
                    //}
                    //tax value
                    let taxvalue = ((this.BillingItem.Qty * this.BillingItem.Rate) * (this.BillingItem.Discount / 100))
                    let beforeTaxvalue = ((this.BillingItem.Qty * this.BillingItem.Rate) - taxvalue);
                    vm.BillingItem.BaseValue = beforeTaxvalue.toFixed(2);
                    //cgst amount
                    let cgstAmount = (beforeTaxvalue.toFixed(2) * (vm.BillingItem.CgstPercentage / 100));
                    //sgst amount
                    let sgstAmount = (beforeTaxvalue.toFixed(2) * (vm.BillingItem.SgstPercentage / 100));

                    vm.BillingItem.Cgst = cgstAmount.toFixed(2);
                    vm.BillingItem.Sgst = sgstAmount.toFixed(2);

                    //set value
                    vm.CgstPercentage = response.data.cgstPer;
                    vm.Cgst = cgstAmount.toFixed(2);
                    vm.Sgst = sgstAmount.toFixed(2);
                    vm.SgstPercentage = response.data.sgstPer;

                    //Amount value
                    vm.BillingItem.Amount = (parseFloat(vm.BillingItem.Cgst) + parseFloat(vm.BillingItem.Sgst) + parseFloat(vm.BillingItem.TaxValue)).toFixed(2);
                })
                //this.deleteBillingItem = false;
            }
            else {
                Swal.fire('Uplicate!', 'Duplicate Product is not allowed!', 'error')
            }

        },
        onOrderItemSaved: function () {
            if (this.BillingItem.ProductId != 0) {
                debugger;
                this.BillingItems.push(this.BillingItem);
                // if (!this.deleteBillingItem)
                // this.salesVm.BillingItems = [];
                this.salesVm.BillingItems = this.BillingItems;
                this.salesTotalAmount = ((parseFloat(this.salesTotalAmount) + parseFloat(this.BillingItem.Amount))).toFixed(2);
                this.salesVm.TotalAmount = this.salesTotalAmount;
                console.log("state transaction state", $('#isOutSider').is(':checked'));
                this.BillingItem.isInterStateTransaction = $('#isOutSider').is(':checked');
                BillingItemClear();
                //calculate Total CGST SGST IGST
                let cgstAmt = 0;
                let sgstAmt = 0;
                let igstAmt = 0;
                let totalbaseValue = 0;
                this.BillingItems.map(x => {
                    totalbaseValue = (parseFloat(totalbaseValue) + parseFloat(x.BaseValue)).toFixed(2);
                    cgstAmt = (parseFloat(cgstAmt) + parseFloat(x.Cgst)).toFixed(2);
                    sgstAmt = (parseFloat(sgstAmt) + parseFloat(x.Sgst)).toFixed(2);
                    igstAmt = (parseFloat(igstAmt) + parseFloat(x.Igst)).toFixed(2);
                });
                this.salesVm.TotalBaseValue = parseFloat(totalbaseValue).toFixed(2);
                this.salesVm.TotalCGSTAmount = parseFloat(cgstAmt).toFixed(2);
                this.salesVm.TotalSGSTAmount = parseFloat(sgstAmt).toFixed(2);
                this.salesVm.TotalIGSTAmount = parseFloat(igstAmt).toFixed(2);
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
            this.BillingItem = {
                Id: 0,
                Baseid: 0,
                SId: 0,
                Qty: 1,
                ProductId: 0,
                ProductName: "",
                Package: "",
                Discount: 0,
                BaseValue: 0,
                isInterStateTransaction: false,
                Cgst: 0,
                CgstPercentage: 0,
                Sgst: 0,
                SgstPercentage: 0,
                Igst: 0,
                IgstPercentage: 0,
                Amount: 0
            };
            document.getElementById("isOutSider").checked = false;
            //intialy open
            $(".igstper").css('display', 'none');
            $(".localtax").css('display', 'block');

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
            [this.BillingItem] = [data];
            console.log("edit data", this.BillingItem);
            this.updateBillingItem = true;
            debugger;
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

            $("#SalesCreateModel").modal('show');
            this.deleteBillingItem = false;
        },
        onUpdateData: function () {
            //console.log("updated value", this.BillingItem);
            //find index
            let vm = this;
            debugger;
            //this.salesVm.BillingItems.map(x => {
            //    if (x.Id == vm.BillingItem.Id) {
            //        debugger;
            //        let indexOfItem = this.salesVm.BillingItems.indexOf(x);
            //       // this.salesVm.BillingItems = [];
            //        this.salesVm.BillingItems[indexOfItem] = this.BillingItem;
            //       // this.salesVm.BillingItems.splice(indexOfItem, 0, this.BillingItem);
            //    }
            //});
            let billingAmount = 0;
            let billingcgstAmount = 0;
            let billingsgstAmount = 0;
            let billingigstAmount = 0;
            this.BillingItems.map(x => {
                if (x.Id == vm.BillingItem.Id) {
                    let indexOfItem = this.BillingItems.indexOf(x);
                    this.BillingItems.splice(indexOfItem, 1, this.BillingItem);
                }
                billingAmount = billingAmount + parseFloat(x.Amount);
                billingcgstAmount = billingcgstAmount + parseFloat(x.Cgst);
                billingsgstAmount = billingsgstAmount + parseFloat(x.Sgst);
                billingigstAmount = billingigstAmount + parseFloat(x.Igst);
            })
            debugger;
            this.salesVm.BillingItems = [];
            this.salesVm.BillingItems = this.BillingItems;
            //this.BillingItem = {
            //    Id: 0,
            //    Baseid: 0,
            //    PoId: 0,
            //    Qty: 1,
            //    ProductId: 0,
            //    ProductName: "",
            //    Package: "",
            //    Mrp: 0,
            //    Rate: 0,
            //    Discount: 0,
            //    TaxValue: 0,
            //    Hsn: "",
            //    Batch: "",
            //    isInterStateTransaction: false,
            //    Cgst: 0,
            //    CgstPercentage: 0,
            //    Sgst: 0,
            //    SgstPercentage: 0,
            //    Igst: 0,
            //    IgstPercentage: 0,
            //    Amount: 0
            //};
            //   this.purchaseTotalAmount = (parseFloat(this.salesVm.TotalAmount)+ parseFloat(this.BillingItem.Amount));
            this.salesVm.TotalAmount = billingAmount.toFixed(2);
            this.salesVm.TotalCGSTAmount = billingcgstAmount.toFixed(2);
            this.salesVm.TotalSGSTAmount = billingsgstAmount.toFixed(2);
            this.salesVm.TotalIGSTAmount = billingigstAmount.toFixed(2);
            //console.log("index of purchase Order", poItem);
            this.deleteBillingItem = false;
            this.updateBillingItem = false;
            $("#SalesCreateModel").modal('hide');
            swal.fire('Good job!', 'Product update successfully!!', 'success');
        }
    }

})
})


