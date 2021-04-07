window.onload = function () {     

    const vm = new Vue({
        el: "#medical-customer-management",
        data: {
            productList: [],
            ProductID: ''
        },

        mounted() {
            //const urlParams = new URLSearchParams(window.location.search);
            //const TempProductID = urlParams.get('ProductID');
            ////alert(productID); 
            //if (TempProductID !== null) {
            //    alert("If value not null:" + TempProductID);
            //}
        },

        methods: {            
            AddEditCustomer: function () {
                if (vm.ValidateProductForm() !== false) {
                    var customerDetail = {
                        Id: document.getElementById("hdnProductID").value,
                        Baseid: document.getElementById("hdnCustomerBaseID").value,
                        Name: document.getElementById("txtCustomerName").value,                                                
                        EmailId: document.getElementById("txtEmailID").value,
                        MobileNo: document.getElementById("txtMobileNo").value,
                        DlNo: document.getElementById("txtDlNo").value,
                        Address: document.getElementById("txtAddress").value,
                        VehicelNo: document.getElementById("txtVehicelNo").value,
                        Station: document.getElementById("txtStation").value,
                        MedicalCenter: document.getElementById("txtMedicalNo").value,
                        ShippedAdress: document.getElementById("txtShippingAddress").value,
                        State: document.getElementById("txtState").value,
                        StateCode: document.getElementById("txtStateCode").value,
                        GstnCn: document.getElementById("txtGSTNo").value,                       
                    }

                    //console.log("Product Detail: ", productDetail);
                    //ajax calling ..
                    $.ajax({ url: "/AddEditCustomer", data: customerDetail, method: "POST" })
                        .done(function (response) {
                            if (response.status === true) {                                
                                vm.clearCustomerFields();
                                if (response.id === 0) {
                                    Swal.fire({
                                        title: "SUCCESS!",
                                        text: response.successMessage,
                                        type: "success",
                                        confirmButtonClass: 'btn btn-success',
                                        buttonsStyling: false,
                                        allowOutsideClick: false,
                                    })
                                }
                                else {
                                    Swal.fire({
                                        title: "SUCCESS!",
                                        text: response.successMessage,
                                        type: "success",
                                        confirmButtonClass: 'btn btn-primary',
                                        buttonsStyling: false,
                                        allowOutsideClick: false,
                                    }).then(function (returnVal) {
                                        if (returnVal.value) {
                                            window.location.href = "/Customer/List";
                                            //vm.GetProductList();
                                        }
                                    });

                                }
                            }
                        })
                        .fail(function () {
                            alert("ERROR!");
                        })
                        //.always(function () {
                        //    alert("Always");
                        //});
                }
                else {
                    event.preventDefault();
                }
            },

            //clear all input fields
            clearCustomerFields: function () {
                document.getElementById("hdnProductID").value = '',
                document.getElementById("hdnCustomerBaseID").value = '';
                document.getElementById("txtCustomerName").value = '';
                document.getElementById("txtEmailID").value = '',
                    document.getElementById("txtMobileNo").value = '',
                    document.getElementById("txtDlNo").value = '';
                document.getElementById("txtAddress").value = '';
                document.getElementById("txtVehicelNo").value = '';
                document.getElementById("txtStation").value = '';
                document.getElementById("txtMedicalNo").value = '';
                document.getElementById("txtShippingAddress").value = '';
                document.getElementById("txtState").value = '',
                    document.getElementById("txtStateCode").value = '',
                    document.getElementById("txtGSTNo").value = ''
            },
            
            ResetProductForm: function () {
                clearProductFields();
            },

            ValidateProductForm: function () {
                if (document.getElementById("txtCustomerName").value === '') {
                    toastr.error("Customer name can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    return false;
                }                
                if (document.getElementById("txtMobileNo").value === '') {
                    toastr.error("Mobile No can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    return false;
                }    
                if (document.getElementById("txtState").value === '') {
                    toastr.error("Customer State can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    return false;
                }    
                return true;
            }
        }
    });
}

function DeleteCustomerByID(Param) {
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
                url: "/Customer/DeleteCustomer",
                dataType: "json",
                //contentType: "application/json",
                data: { "Param": Param },
                success: function (response) {
                    if (response.status === true) {
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
                    }
                    else {
                        alert("Server Error Occurred!");
                    }
                },
                error: function () {
                    alert("Client Error Occurred!");
                }
            });
        }
    })
}






