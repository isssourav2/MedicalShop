/// <reference path="../js/vue/vue.min.js" />
/// <reference path="../js/axios.min.js" />





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
                    Address: "",
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
                var vm = this;
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
                        // vm.bugs.splice(0, 0, newBug);
                        //toastr.success("New bug added.");
                        //new PNotify({
                        //    title: 'Regular Notice',
                        //    text: data.successMessage,
                        //    type: 'success'
                        //});
                        //  PageLoad(this);
                        $.ajax({ url: "/Vendor", method: "GET" })
                            .done(function (data) {
                                //console.log("vendor data", data);
                                vm.vendors = [...data];
                            })
                        //clear control
                        clearControl();
                        //Redirect to new page
                        location.replace("/Puchase/Vendor");

                    }).fail(function () {
                        // toastr.error("Can not add new bug!");
                    }).always(function () {
                        //vm.clearData();
                    });
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
                //console.log("vendor model data", this.vendor);
                var existingVendor = {
                    Id: vm.vendor.id,
                    Name: vm.vendor.name,
                    Email: vm.vendor.email,
                    MobileNo: vm.vendor.mobileNo,
                    Address: vm.vendor.Address,
                    GstNo: vm.vendor.gstNo,
                    CompanyId: vm.vendor.companyId
                }
                console.log("vendor model data", existingVendor);
                debugger;
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
            onDelete: function (row) {
                console.log("delete row", row.id);
                Swal.fire({
                    title: 'Do you want to delete this record?',
                    showCancelButton: true,
                    confirmButtonText: `Delete`,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios.delete(`/Vendor/delete?id=${row.id}`)
                            .then(function (response) {
                                console.log("response data", response.data.successMessage);
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: response.data.successMessage,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                $.ajax({ url: "/Vendor", method: "GET" })
                                    .done(function (data) {
                                        //console.log("vendor data", data);
                                        vm.vendors = [...data];
                                    })
                            })
                        //Swal.fire('Delete!', '', 'success')
                    }
                })
            }
        }

    })
}