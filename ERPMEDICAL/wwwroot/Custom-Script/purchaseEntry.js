

$(document).ready(function () {
    //disabled igst tax textboxes
    $(".igstper").css('display', 'none');
    $("#txtIgstPercentage").val(0);
    $("#txtIgst").val(0);
 
    //$('select').selectstyle({
    //    width: 400,
    //    height: 300,
    //    theme: 'light',
    //    onchange: function (val) { }
    //});

    const PurchaseOrderItemClear = function () {
        $("#ddlProduct").val('');
        $("#txtPackage").val('');
        $("#txtMRP").val(0);
        $("#txtRate").val(0);
        $("#txtDiscount").val(0);
        $("#txtHsn").val('');
        $("#txtBatchNo").val('');
        $("#txtQty").val(0);
        $("#txtTaxValue").val(0);
        $("#txtcgstPercentage").val(0);
        $("#txtcgst").val(0);
        $("#txtsgstPercentage").val(0);
        $("#txtsgst").val(0);
        $("#txtIgstPercentage").val(0);
        $("#txtIgst").val(0);
        $("#txtAmount").val(0);
        vm.purchaseOrderItem = {
            Id: 0,
            Baseid: 0,
            PoId: 0,
            Qty: 1,
            ProductId: 0,
            ProductName: "",
            Package: "",
            Mrp: 0,
            Rate: 0,
            Discount: 0,
            isInterStateTransaction: false,
            TaxValue: 0,
            Hsn: "",
            Batch: "",
            Cgst: 0,
            CgstPercentage: 0,
            Sgst: 0,
            SgstPercentage: 0,
            Igst: 0,
            IgstPercentage: 0,
            Amount: 0
        };
    }

    $(document).on('click', "#btnOrderItempopupClose", function () {
        PurchaseOrderItemClear();
    });
 

    //$(document).on('change', '')

    //vue directive
    //Vue.directive('selecttwo', {
    //    twoWay: true,
    //    bind: function () {
    //        $(this.el).select2()
    //            .on("select2:select", function (e) {
    //                this.set($(this.el).val());
    //            }.bind(this));
    //    },
    //    update: function (nv, ov) {
    //        $(this.el).trigger("change");
    //    }
    //});

    const vm = new Vue({
        el: "#app-container",
        data: {
            purchaseOrders: [],
            purchaseTotalAmount: 0,
            selectedProductName: '',
            purchaseVm: {
                id: 0,
                doctorId: 0,
                vendorId: 0,
                OrderDate: "",
                InvoiceNo: "",
                Naration: "",
                TotalBaseValue:0,
                TotalCGSTAmount: 0,
                TotalSGSTAmount: 0,
                TotalIGSTAmount: 0,
                TotalAmount: 0,
                PurchaseOrderItems: []
            },
            purchaseOrderItem: {
                Id: 0,
                Baseid: 0,
                PoId: 0,
                Qty: 1,
                ProductId: 0,
                ProductName: "",
                Package: "",
                Mrp: 0,
                Rate: 0,
                Discount: 0,
                TaxValue: 0,
                Hsn: "",
                Batch: "",
                isInterStateTransaction:false,
                Cgst: 0,
                CgstPercentage: 0,
                Sgst: 0,
                SgstPercentage: 0,
                Igst: 0,
                IgstPercentage: 0,
                Amount: 0
            },
            purchaseOrderDisplayVm: [],
            purchaseOrderItems: [],
            products: [],
            vendors: [],
            doctors: [],
            CgstPercentage: 0,
            Cgst: 0,
            Sgst: 0,
            SgstPercentage:0,
            updatePurchaseOrderItem: false,
            deletePurchaseOrderItem: false
        },
        mounted() {
            let vm = this;
            this.GetProductList();
            this.GetVendorList();
            this.GetDoctorList();
            this.GetPOList();
            //Disable click outside of bootstrap modal area to close modal
            $('#poitemCreateModel').modal({ backdrop: 'static', keyboard: false })  
            $("#poitemCreateModel").modal('hide');
            //call async function for vendor

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
                    vm.purchaseOrderItem.IgstPercentage = (parseFloat(vm.purchaseOrderItem.CgstPercentage) + parseFloat(vm.purchaseOrderItem.SgstPercentage)).toFixed(2);
                    vm.purchaseOrderItem.Igst = (parseFloat(vm.purchaseOrderItem.Cgst) + parseFloat(vm.purchaseOrderItem.Sgst)).toFixed(2);
                    //vm.purchaseOrderItem.CgstPercentage = 0;
                    //vm.purchaseOrderItem.Cgst = 0;
                    //vm.purchaseOrderItem.SgstPercentage = 0;
                    //vm.purchaseOrderItem.Sgst = 0;

                }
            })
            //for vendor
            this.getVendor().then(v => {
                $("#ddlVendors").select2({
                    data: v
                });
                $(".containerpurEntry").LoadingOverlay("hide");
            })
            $("#ddlVendors").on('change', function () {
               
                vm.purchaseVm.vendorId = $(this).val();
               
            })

            //For Product
            this.getProduct().then(v => {
                $("#ddlProduct").select2({
                    data: v
                });
            })
            $("#ddlProduct").on('change', function () {
                vm.purchaseOrderItem.ProductId = $(this).val();
                vm.onChange(vm.purchaseOrderItem.ProductId);
            })

            //call async function for Doctor
            this.getDoctor().then(v => {
                $("#ddlDoctors").select2({
                    data: v
                });
            })
            $("#ddlDoctors").on('change', function () {
               
                vm.purchaseVm.doctorId = $(this).val();
            })
            //Purchase Date
            $("#txtOrderDate").datepicker({
                dateFormat: 'dd/mm/yy'
            });
           
            $("#txtOrderDate").on('change', function () {
               
                let datevalue = $(this).val();
                vm.purchaseVm.OrderDate = datevalue;
            })
        },
        computed: {
            //getProductName: function () {
            //    let productName = this.selectedProductName.trim();
            //    //console.log("Product Name", productName);
            //    return productName;
            // vm.onchangeTaxValueChange(newVal);
            //}
        },
        watch: {
            'purchaseOrderItem.CgstPercentage'(newVal) {
                debugger;
               // let taxvalue = ((this.purchaseOrderItem.Qty * this.purchaseOrderItem.Rate) * (this.purchaseOrderItem.Discount / 100))
                let beforeTaxvalue = this.purchaseOrderItem.taxvalue;
             //   vm.purchaseOrderItem.TaxValue = beforeTaxvalue.toFixed(2);
                //cgst amount
                newVal = newVal == undefined ? 0 : newVal;
                vm.purchaseOrderItem.CgstPercentage = newVal;
                let cgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));
                //sgst amount
                vm.purchaseOrderItem.SgstPercentage = parseFloat(vm.purchaseOrderItem.SgstPercentage);
                let sgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(vm.purchaseOrderItem.SgstPercentage) / 100));

                vm.purchaseOrderItem.Cgst = cgstAmount.toFixed(2);
                // vm.purchaseOrderItem.Sgst = sgstAmount.toFixed(2);
                vm.purchaseOrderItem.Amount =
                    (parseFloat(vm.purchaseOrderItem.Cgst) +
                        parseFloat(sgstAmount) +
                    parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);
            },
            'purchaseOrderItem.SgstPercentage'(newVal) {
                debugger;
              //  let taxvalue = ((this.purchaseOrderItem.Qty * this.purchaseOrderItem.Rate) * (this.purchaseOrderItem.Discount / 100))
                let beforeTaxvalue = this.purchaseOrderItem.taxvalue;
               // vm.purchaseOrderItem.TaxValue = beforeTaxvalue.toFixed(2);
                //cgst amount
                vm.purchaseOrderItem.CgstPercentage = parseFloat(vm.purchaseOrderItem.CgstPercentage);
                let cgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(vm.purchaseOrderItem.CgstPercentage) / 100));
                //sgst amount
               
                newVal = newVal == undefined ? 0 : newVal;
                vm.purchaseOrderItem.SgstPercentage = newVal;
                let sgstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));

                //vm.purchaseOrderItem.Cgst = cgstAmount.toFixed(2);
                vm.purchaseOrderItem.Sgst = sgstAmount.toFixed(2);
                vm.purchaseOrderItem.Amount =
                    (parseFloat(cgstAmount) +
                        parseFloat(vm.purchaseOrderItem.Sgst) +
                    parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);
                 vm.onchangeTaxValueChange(newVal);
            },
            'purchaseOrderItem.IgstPercentage'(newVal) {
                debugger;
                let taxvalue = ((this.purchaseOrderItem.Qty * this.purchaseOrderItem.Rate) * (this.purchaseOrderItem.Discount / 100))
                let beforeTaxvalue = this.purchaseOrderItem.taxvalue;
              //  vm.purchaseOrderItem.TaxValue = beforeTaxvalue.toFixed(2);
                //igst amount
             //   let percentage = vm.purchaseOrderItem.IgstPercentage
                newVal = newVal == undefined ? 0 : newVal == "" ? 0 : newVal;
                vm.purchaseOrderItem.IgstPercentage = newVal;
                let igstAmount = (beforeTaxvalue.toFixed(2) * (parseFloat(newVal) / 100));
                //vm.purchaseOrderItem.Cgst = cgstAmount.toFixed(2);
                vm.purchaseOrderItem.Igst = igstAmount.toFixed(2);
                vm.purchaseOrderItem.Amount =
                    (parseFloat(vm.purchaseOrderItem.Igst) +
                    parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);
                 vm.onchangeTaxValueChange(newVal);
            }
        },
        destroyed: function () {

        },
        methods: {
            getDoctor() {
                let GetDoctorPromises = new Promise((resolve, reject) => {
                    // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
                    // In this example, we use setTimeout(...) to simulate async code. 
                    // In reality, you will probably be using something like XHR or an HTML5 API.
                    axios.get('/Doctor')
                        .then(response => {
                            if (response.status !== false) {
                                let Doctors = response.data;
                                const modDoctors = Doctors.map(x => {
                                    const { id, name } = x;
                                    var obj = {
                                        id: id,
                                        text: name
                                    }
                                    return obj;
                                });
                                resolve(modDoctors)  // Yay! Everything went well!
                                //console.log("Product List: ", this.productList);
                            }
                        })
                        .catch(error => {
                            reject(error);
                        })
                })
                return GetDoctorPromises;
            },
            getVendor() {
                let GetVendorPromises = new Promise((resolve, reject) => {
                    // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
                    // In this example, we use setTimeout(...) to simulate async code. 
                    // In reality, you will probably be using something like XHR or an HTML5 API.
                    axios.get('/Vendor')
                        .then(response => {
                            if (response.status !== false) {
                                let vendors = response.data;
                                const modVendors = vendors.map(x => {
                                    const { id, name } = x;
                                    var obj = {
                                        id: id,
                                        text: name
                                    }
                                    return obj;
                                });
                                resolve(modVendors)  // Yay! Everything went well!
                                //console.log("Product List: ", this.productList);
                            }
                        })
                        .catch(error => {
                            reject(error);
                        })
                })
                return GetVendorPromises;
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
                                console.log("Product List: ", products);
                                resolve(modproducts)  // Yay! Everything went well!
                                
                            }
                        })
                        .catch(error => {
                            reject(error);
                        })
                })
                return GetproductPromises;
            },
            onchangeDoctorDrop: function (event) {
                console.log("Event Value", event.target.value);
            },
            GetProductList: function () {
                axios.get('/GetAllProduct')
                    .then(response => {
                        if (response.status !== false) {
                            this.products = response.data;
                            //console.log("Product List: ", this.productList);
                        }
                    })
                    .catch(error => {
                        alert(error);
                    })
            },
            GetVendorList: function () {
                axios.get('/Vendor')
                    .then(response => {
                        if (response.status !== false) {
                            this.vendors = response.data;
                            //console.log("Product List: ", this.productList);
                            $(".container").LoadingOverlay("hide");
                        }
                    })
                    .catch(error => {
                        alert(error);
                    })
            },
            GetDoctorList: function () {
                axios.get('/Doctor')
                    .then(response => {
                        if (response.status !== false) {
                            this.doctors = response.data;
                            console.log("doctor data :", response.data);
                            //console.log("Product List: ", this.productList);
                        }
                    })
                    .catch(error => {
                        alert(error);
                    })

            },
            GetPOList: function () {
                axios.get('/GetAllPurchase')
                    .then(response => {

                        this.purchaseOrderDisplayVm = response.data;
                        //console.log("Product List: ", this.productList);
                        
                    })
                    .catch(error => {
                        alert(error);
                    })

            },
            onSubmit: function () {
                //debugger;
                let vm = this;
                let purchaseOrderItem = [];

                const { PurchaseOrderItems } = vm.purchaseVm;

                

                //destruct purchaseOrderItems array to retrieve data
                PurchaseOrderItems.map(x => {
                    const { Id, Baseid, PoId, Qty, ProductId,
                        ProductName, Package, Mrp, Rate, Discount,
                        TaxValue, Hsn, Batch, Cgst, CgstPercentage,
                        Sgst, SgstPercentage, Igst, IgstPercentage, Amount } = x;

                    purchaseOrderItem.push({
                        Id: Id,
                        Baseid: Baseid,
                        PoId: PoId,
                        Qty: Qty,
                        ProductId: ProductId,
                        ProductName: ProductName,
                        Package: Package,
                        Mrp: Mrp,
                        Rate: Rate,
                        Discount: Discount,
                        TaxValue: TaxValue,
                        Hsn: Hsn,
                        Batch: Batch,
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
               
                let purchaseVm = {
                    Id: vm.purchaseVm.id,
                    DoctorId: vm.purchaseVm.doctorId,
                    VendorId: vm.purchaseVm.vendorId,
                    OrderDate: vm.purchaseVm.OrderDate,
                    Naration: vm.purchaseVm.Naration,
                    InvoiceNo: vm.purchaseVm.InvoiceNo,
                    TotalBaseValue: vm.purchaseVm.TotalBaseValue,
                    TotalCgst: vm.purchaseVm.TotalCGSTAmount,
                    TotalAmount: vm.purchaseVm.TotalAmount,
                    TotalSgst: vm.purchaseVm.TotalSGSTAmount,
                    TotalIgst: vm.purchaseVm.TotalIGSTAmount,
                    PurchaseOrderItems: purchaseOrderItem
                };
          
                this.deletePurchaseOrderItem = false;
                this.updatePurchaseOrderItem = false;
                if (purchaseVm.InvoiceNo!="" && purchaseVm.VendorId != 0 && purchaseVm.OrderDate != "") {
                    $.ajax({ url: "/PurchaseSave", data: purchaseVm, method: "POST" })
                        .done(function (response) {
                            // vm.bugs.splice(0, 0, newBug);
                            //console.log(data);
                            if (response.status) {
                                location.replace("/Puchase/PO");
                            }
                            else if (!response.status && response.errorMessage == "session out") {
                                location.replace("/User/Login");
                            }
                            else {
                                alert(response.errorMessage);
                                PurchaseOrderItemClear();
                            }

                            //Redirect to new page
                        }).fail(function () {
                            // toastr.error("Can not add new bug!");
                        }).always(function () {
                            //vm.clearData();
                        });
                }
                else {
                    var html = `<ol><li>Invoice No Required</li><li>Vendor is not seleted</li>
                                <li>Order Date is not blank</li></ol>`;
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
                let taxvalue = (this.purchaseOrderItem.Rate * (event.target.value)) * (this.purchaseOrderItem.Discount / 100);
               // this.purchaseOrderItem.TaxValue = (this.purchaseOrderItem.Rate + taxvalue).toFixed(2);
                let beforeTaxvalue = this.purchaseOrderItem.taxvalue;
                //change amount with tax
                let cgstAmount = (beforeTaxvalue.toFixed(2) * (this.purchaseOrderItem.CgstPercentage / 100));
                //sgst amount
                let sgstAmount = (beforeTaxvalue.toFixed(2) * (this.purchaseOrderItem.SgstPercentage / 100));
                //igst amount
                let igstAmount = (beforeTaxvalue.toFixed(2) * (this.purchaseOrderItem.IgstPercentage / 100));


                this.purchaseOrderItem.Cgst = cgstAmount.toFixed(2);
                this.purchaseOrderItem.Sgst = sgstAmount.toFixed(2);
                this.purchaseOrderItem.Igst = igstAmount.toFixed(2);
                debugger
                //Amount value
                this.purchaseOrderItem.Amount = (parseFloat(this.purchaseOrderItem.Cgst) +
                    parseFloat(this.purchaseOrderItem.Sgst) +
                    parseFloat(this.purchaseOrderItem.Igst) +
                    parseFloat(beforeTaxvalue.toFixed(2))).toFixed(2);


               // this.deletePurchaseOrderItem = false;
               // this.updatePurchaseOrderItem = false;
            },
            onChange(event) {
                let vm = this;
                debugger;
                let orderitems = this.purchaseOrderItems.filter(function (obj) {
                    return obj.Id == event;
                })

                //console.log("product data", evente);
               if (orderitems.length == 0) {
                   let productdivid = document.getElementById("ddlProduct");

                    let textOfProduct = productdivid.options[productdivid.selectedIndex].text;
                    this.selectedProductName = textOfProduct;
                    vm.purchaseOrderItem.ProductName = this.selectedProductName;
                    axios.get(`/GetAllProductByID?id=${event}`).then(response => {
                        console.log(response.data);
                        vm.purchaseOrderItem.Id = response.data.id;
                        vm.purchaseOrderItem.Package = response.data.package;
                        vm.purchaseOrderItem.Mrp = response.data.mrp;
                        vm.purchaseOrderItem.Rate = response.data.rate;
                        vm.purchaseOrderItem.Discount = response.data.discount;
                        vm.purchaseOrderItem.Hsn = response.data.hsnCode;
                        vm.purchaseOrderItem.Batch = response.data.batchNo;
                        vm.purchaseOrderItem.CgstPercentage = response.data.cgstPer;
                        vm.purchaseOrderItem.SgstPercentage = response.data.sgstPer;
                    //    vm.purchaseOrderItem.IgstPercentage = response.data.igstPer;

                        //if (vm.purchaseOrderItem.IgstPercentage != 0) {
                        //    document.getElementById("isOutSider").checked = true;
                        //    $(".igstper").css('display', 'block');
                        //    $(".localtax").css('display', 'none');
                        //    vm.purchaseOrderItem.CgstPercentage = 0;
                        //    vm.purchaseOrderItem.Cgst = 0;
                        //    vm.purchaseOrderItem.SgstPercentage = 0;
                        //    vm.purchaseOrderItem.Sgst = 0;
                        //}
                        //else {
                        //    $(".igstper").css('display', 'none');
                        //    $(".localtax").css('display', 'block');
                        //}
                        //tax value
                        let taxvalue = ((this.purchaseOrderItem.Qty * this.purchaseOrderItem.Rate) * (this.purchaseOrderItem.Discount / 100))
                        let beforeTaxvalue = ((this.purchaseOrderItem.Qty * this.purchaseOrderItem.Rate) - taxvalue);
                        vm.purchaseOrderItem.TaxValue = beforeTaxvalue.toFixed(2);
                        debugger;
                        //cgst amount
                        let cgstAmount = (beforeTaxvalue.toFixed(2) * vm.purchaseOrderItem.CgstPercentage / 100);
                        //sgst amount
                        let sgstAmount = (beforeTaxvalue.toFixed(2) * (vm.purchaseOrderItem.SgstPercentage / 100));

                        vm.purchaseOrderItem.Cgst = cgstAmount.toFixed(2);
                        vm.purchaseOrderItem.Sgst = sgstAmount.toFixed(2);

                        //set value
                        vm.CgstPercentage = response.data.cgstPer;
                        vm.Cgst = cgstAmount.toFixed(2);
                        vm.Sgst = sgstAmount.toFixed(2);
                        vm.SgstPercentage = response.data.sgstPer;

                        //Amount value
                        vm.purchaseOrderItem.Amount = (parseFloat(vm.purchaseOrderItem.Cgst) + parseFloat(vm.purchaseOrderItem.Sgst) + parseFloat(vm.purchaseOrderItem.TaxValue)).toFixed(2);
                    })
                   //this.deletePurchaseOrderItem = false;
                }
                else {
                   Swal.fire('Warining !!!!!!!!!!', 'Duplicate product will not be accepted!', 'warn')
                }
               
            },
            onOrderItemSaved: function () {
                if (this.purchaseOrderItem.ProductId != 0) {
                    debugger;
                    this.purchaseOrderItems.push(this.purchaseOrderItem);
                   // if (!this.deletePurchaseOrderItem)
                   // this.purchaseVm.PurchaseOrderItems = [];
                    this.purchaseVm.PurchaseOrderItems = this.purchaseOrderItems;
                    this.purchaseTotalAmount = (parseFloat(this.purchaseTotalAmount) + parseFloat(this.purchaseOrderItem.Amount));
                    this.purchaseVm.TotalAmount = this.purchaseTotalAmount;
                    console.log("state transaction state", $('#isOutSider').is(':checked'));
                    this.purchaseOrderItem.isInterStateTransaction = $('#isOutSider').is(':checked');
                    PurchaseOrderItemClear();
                    //calculate Total CGST SGST IGST
                    let cgstAmt = 0;
                    let sgstAmt = 0;
                    let igstAmt = 0;
                    let totalBaseValue = 0;
                    console.log("rate value", this.purchaseOrderItems);

                    this.purchaseOrderItems.map(x => {
                        cgstAmt = (parseFloat(cgstAmt) + parseFloat(x.Cgst)).toFixed(2);
                        sgstAmt = (parseFloat(sgstAmt) + parseFloat(x.Sgst)).toFixed(2);
                        igstAmt = (parseFloat(igstAmt) + parseFloat(x.Igst)).toFixed(2);
                        totalBaseValue = (parseFloat(totalBaseValue) + parseFloat(x.Rate)).toFixed(2);
                    });
                    this.purchaseVm.TotalBaseValue = parseFloat(totalBaseValue).toFixed(2);
                    this.purchaseVm.TotalCGSTAmount = parseFloat(cgstAmt).toFixed(2);
                    this.purchaseVm.TotalSGSTAmount = parseFloat(sgstAmt).toFixed(2);
                    this.purchaseVm.TotalIGSTAmount = parseFloat(igstAmt).toFixed(2);
                    this.deletePurchaseOrderItem = false;
                    this.updatePurchaseOrderItem = false;
                    //console.log("Purchase data item array", this.purchaseOrderItems);
                    $("#poitemCreateModel").modal('hide');
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
               // this.deletePurchaseOrderItem = false;
                this.updatePurchaseOrderItem = false;
                this.purchaseOrderItem = {
                    Id: 0,
                    Baseid: 0,
                    PoId: 0,
                    Qty: 1,
                    ProductId: 0,
                    ProductName: "",
                    Package: "",
                    Mrp: 0,
                    Rate: 0,
                    Discount: 0,
                    TaxValue: 0,
                    Hsn: "",
                    Batch: "",
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
              //  $("#ddlProduct").val('');
                $("#poitemCreateModel").modal('show');
            },
            onOrderItemDelete: function (data) {
                Swal.fire({
                    title: 'Once deleted, you will not be able to recover this data?',
                    showCancelButton: true,
                    confirmButtonText: `Delete`
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        const orderitems = this.purchaseOrderItems.filter(function (obj) {
                            return obj.Id !== data.Id;
                        })
                        this.purchaseOrderItems = [];
                        this.purchaseOrderItems = orderitems;
                        debugger;
                        //change on delete for total amount
                        this.purchaseVm.TotalAmount = (parseFloat(this.purchaseVm.TotalAmount) - parseFloat(data.Amount)).toFixed(2);
                        this.purchaseVm.TotalCGSTAmount = (parseFloat(this.purchaseVm.TotalCGSTAmount) - parseFloat(data.Cgst)).toFixed(2);
                        this.purchaseVm.TotalSGSTAmount = (parseFloat(this.purchaseVm.TotalSGSTAmount) - parseFloat(data.Sgst)).toFixed(2);
                        this.purchaseVm.TotalIGSTAmount = (parseFloat(this.purchaseVm.TotalIGSTAmount) - parseFloat(data.Igst)).toFixed(2);
                        this.purchaseVm.PurchaseOrderItems = this.purchaseOrderItems;
                        this.deletePurchaseOrderItem = true;
                        this.updatePurchaseOrderItem = false;
                          //  console.log("Original data", this.purchaseOrderItems);
                          //  console.log("After delete data", this.purchaseVm.PurchaseOrderItems);
                        Swal.fire('Delete!', 'Poof! Your data has been deleted!', 'success')
                    }
                })               
            },
            onOrderItemEdit: function (data) {
                [this.purchaseOrderItem] = [data];
                console.log("edit data", this.purchaseOrderItem);
                this.updatePurchaseOrderItem = true;
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
                 
                $("#poitemCreateModel").modal('show');
                this.deletePurchaseOrderItem = false;
            },
            onUpdateData: function () {
                //console.log("updated value", this.purchaseOrderItem);
                //find index
                let vm = this;
                debugger;
                //this.purchaseVm.PurchaseOrderItems.map(x => {
                //    if (x.Id == vm.purchaseOrderItem.Id) {
                //        debugger;
                //        let indexOfItem = this.purchaseVm.PurchaseOrderItems.indexOf(x);
                //       // this.purchaseVm.PurchaseOrderItems = [];
                //        this.purchaseVm.PurchaseOrderItems[indexOfItem] = this.purchaseOrderItem;
                //       // this.purchaseVm.PurchaseOrderItems.splice(indexOfItem, 0, this.purchaseOrderItem);
                //    }
                //});
                let purchaseAmount = 0;
                let purchasecgstAmount = 0;
                let purchasesgstAmount = 0;
                let purchaseigstAmount = 0;
                this.purchaseOrderItems.map(x => {
                    if (x.Id == vm.purchaseOrderItem.Id) {
                        let indexOfItem = this.purchaseOrderItems.indexOf(x);
                        this.purchaseOrderItems.splice(indexOfItem, 1, this.purchaseOrderItem);
                    }
                    purchaseAmount = purchaseAmount + parseFloat(x.Amount);
                    purchasecgstAmount = purchasecgstAmount + parseFloat(x.Cgst);
                    purchasesgstAmount = purchasesgstAmount + parseFloat(x.Sgst);
                    purchaseigstAmount = purchaseigstAmount + parseFloat(x.Igst);
                })
                debugger;
                this.purchaseVm.PurchaseOrderItems = [];
                this.purchaseVm.PurchaseOrderItems = this.purchaseOrderItems;
                //this.purchaseOrderItem = {
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
             //   this.purchaseTotalAmount = (parseFloat(this.purchaseVm.TotalAmount)+ parseFloat(this.purchaseOrderItem.Amount));
                this.purchaseVm.TotalAmount = purchaseAmount.toFixed(2);
                this.purchaseVm.TotalCGSTAmount = purchasecgstAmount.toFixed(2);
                this.purchaseVm.TotalSGSTAmount = purchasesgstAmount.toFixed(2);
                this.purchaseVm.TotalIGSTAmount = purchaseigstAmount.toFixed(2);
                //console.log("index of purchase Order", poItem);
                this.deletePurchaseOrderItem = false;
                this.updatePurchaseOrderItem = false;
                $("#poitemCreateModel").modal('hide');
                swal.fire('Good job!', 'Product update successfully!!', 'success');
            },
            OnCancelData: function () {
                this.updatePurchaseOrderItem = false;
            }
        }
    })
})