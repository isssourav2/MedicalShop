// <reference path="../js/vue/vue.min.js" />
// <reference path="../js/axios.min.js" />
window.onload = function () {
    const PageLoad = function (thisObj) {
        let vm = thisObj;

        $.ajax({ url: "/Vendor", method: "GET" })
            .done(function (data) {
                //console.log("vendor data", data);
                vm._data.vendors = [...data];
            });
        //populate company list
        $.ajax({ url: "/Vendor/company", method: "GET" })
            .done(function (data) {
                console.log("Response company object", data);
                vm._data.companies = [...data];
            });
        vm._data.vendor = {
            id: "",
            companyId: "",
            name: "",
            email: "",
            mobileNo: "",
            Address: "",
            gstNo: ""
        }
    }
    const clearControl = function () {
        $("#txtVendorName").val('');
        $("#txtVendorEmail").val('');
        $("#txtMobileNo").val('');
        $("#txtAddress").val('');
        $("#txtgstNo").val('');
    }

    const vm = new Vue({
        el: "#app-container",
        data: {
            vendors: [],
            vendor: {
                id: "",
                companyId: "",
                name: "",
                email: "",
                mobileNo: "",
                Address: "",
                gstNo: ""
            },
            companies:[]
        },
        mounted() {
            PageLoad(this);
            debugger;    
            var vendord = localStorage.getItem("vendordata");
            if (JSON.parse(vendord)) {
                [this.vendor] = [JSON.parse(vendord)];
            }
            else {
                this.vendor = {
                    id: "",
                    companyId: "",
                    name: "",
                    email: "",
                    mobileNo: "",
                    address: "",
                    gstNo: ""
                }
            }
            
        },

        methods: {
            handleChange: function (Event) {
                const { name, value } = Event.target;
                console.log("this object",this);
                switch (name) {
                    case "name":
                        this.vendor.name = value;
                        break;
                    case "email":
                        this.vendor.email = value;
                        break;
                    case "mobileNo":
                        this.vendor.mobileNo = value;
                        break;
                    case "Address":
                        this.vendor.Address = value;
                        break;
                    case "gstNo":
                        this.vendor.gstNo = value;
                        break;
                    case "companyId":
                        this.vendor.companyId = value;
                        break;
                    default:
                        break;
                }
            },

            onSubmit: function () {
                let vm = this
                if (vm.ValidateVendorForm() !== false) {                    
                    var newVendor = {
                        Name: vm.vendor.name,
                        Email: vm.vendor.email,
                        MobileNo: vm.vendor.mobileNo,
                        Address: vm.vendor.Address,
                        GstNo: vm.vendor.gstNo,
                        CompanyId: vm.vendor.companyId
                    }
                    console.log("vendor data", newVendor);
                    debugger;

                    $.ajax({ url: "/Vendor", data: newVendor, method: "POST" })
                    .done(function (data) {                       
                        //  PageLoad(this);
                        $.ajax({ url: "/Vendor", method: "GET" })
                            .done(function (data) {
                                //console.log("vendor data", data);
                                vm.vendors = [...data];
                            })
                        //clear control
                        clearControl();
                        Swal.fire({
                            title: "SUCCESS!",
                            text: response.successMessage,
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: true,
                            allowOutsideClick: false,
                        }).then(function (returnVal) {
                            if (returnVal.value) {
                                window.location.reload();
                            }
                        });
                        //Redirect to new page
                        location.replace("/Puchase/Vendor");

                    }).fail(function () {
                        // toastr.error("Can not add new bug!");
                    }).always(function () {
                        //vm.clearData();
                    });
                }
            },

            onEdit: function (rowValue) {
                let vm = this;
                
                [vm.vendor] = [rowValue];
                localStorage.setItem("vendordata", JSON.stringify(vm.vendor));
                //Redirect to new page
                location.replace("/Vendor/Edit");
               // console.log("Row value", vm.vendor);
            },

            onUpdate: function () {
                let vm = this;
                console.log("vendor model data", this.vendor);
                var existingVendor = {
                    Id: vm.vendor.id,
                    Name: vm.vendor.name,
                    Email: vm.vendor.email,
                    MobileNo: vm.vendor.mobileNo,
                    Address: vm.vendor.address,
                    GstNo: vm.vendor.gstNo,
                    CompanyId: vm.vendor.companyId
                }
                console.log("vendor model data", existingVendor);
                
                Swal.fire({
                    title: 'Do you want to edit this record?',
                    showCancelButton: true,
                    confirmButtonText: `Edit`,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed)
                    {
                        $.ajax({ url: "/Vendor", data: existingVendor, method: "PUT" })
                        .done(function (data) {
                            // vm.bugs.splice(0, 0, newBug);
                            $.ajax({ url: "/Vendor", method: "GET" })
                                .done(function (data) {
                                    //console.log("vendor data", data);
                                    vm.vendors = [...data];
                                })
                            //clear control
                            clearControl();
                            localStorage.clear();
                            //Redirect to new page
                            location.replace("/Puchase/Vendor");

                        }).fail(function () {
                            // toastr.error("Can not add new bug!");
                        }).always(function () {
                            //vm.clearData();
                        });
                    }
                });
            },  

            ValidateVendorForm: function () {
                if (document.getElementById("txtVendorName").value === '') {
                    toastr.error("Vendor name can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    document.getElementById("txtVendorName").focus();
                    return false;
                }
                if (document.getElementById("txtMobileNo").value === '') {
                    toastr.error("Mobile No can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    document.getElementById("txtMobileNo").focus();
                    return false;
                }
                if (document.getElementById("txtAddress").value === '') {
                    toastr.error("Address can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    document.getElementById("txtAddress").focus();
                    return false;
                }
                return true;
            }
        }
    })
}

function DeleteVendorByID(VendorID) {
    //console.log("Product ID: ", productID);
    Swal.fire({
        title: 'Are you sure to delete this record?',
        text: 'You can not revert back!',
        showCancelButton: true,
        confirmButtonText: `Delete`,
        allowOutsideClick: false
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "/Vendor/DeleteVendor",
                dataType: "json",
                //contentType: "application/json",
                data: { "VendorID": parseInt(VendorID) },
                success: function (response) {
                    if (response.status === true) {
                        Swal.fire({
                            title: "SUCCESS!",
                            text: response.successMessage,
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: true,
                            allowOutsideClick: false,
                        })
                        .then(function (returnVal) {
                        if (returnVal.value) {
                            window.location.reload();
                        }
                        });
                    }
                    else {
                        toastr.error("Server Error Occurred!", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    }
                },
                error: function () {
                    toastr.error("Client Error Occurred!", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                }
            });
        }
    })
}