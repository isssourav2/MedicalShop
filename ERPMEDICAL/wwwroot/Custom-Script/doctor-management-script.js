window.onload = function () {

    const vm = new Vue({
        el: "#doctor-management",
        data: {
            doctorList: [],
            doctorID: ''
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
            AddEditDoctor: function () {
                if (vm.ValidateDoctorForm() !== false) {
                    var doctorDetail = {
                        Id: document.getElementById("hdnDoctorID").value,
                        Baseid: document.getElementById("hdnDoctorBaseID").value,
                        Name: document.getElementById("txtDoctorName").value,
                        EmailId: document.getElementById("txtEmailID").value,
                        MobileNo: document.getElementById("txtMobileNo").value,
                        Age: document.getElementById("txtAge").value,
                        Address: document.getElementById("txtAddress").value                       
                    }

                    //console.log("Product Detail: ", productDetail);
                    //ajax calling ..
                    $.ajax({ url: "/Doctor/AddEditDoctor", data: doctorDetail, method: "POST" })
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
                                            window.location.href = "/Doctor/List";
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
                document.getElementById("hdnDoctorID").value = '',
                document.getElementById("hdnDoctorBaseID").value = '';
                document.getElementById("txtDoctorName").value = '';
                document.getElementById("txtEmailID").value = '',
                document.getElementById("txtMobileNo").value = '',
                document.getElementById("txtAge").value = '';
                document.getElementById("txtAddress").value = '';
                document.getElementById("txtAddress").value = '';               
            },            

            //validate doctor detail form
            ValidateDoctorForm: function () {
                if (document.getElementById("txtDoctorName").value === '') {
                    toastr.error("Doctor name can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    return false;
                }

                return true;
            }
        }
    });
}

function DeleteDoctorByID(Param) {
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
                url: "/Doctor/DeleteDoctor",
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






