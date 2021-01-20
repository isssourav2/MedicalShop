window.onload = function () {

    const vm = new Vue({
        el: "#company-branch-management",
        data: {
            companyList: [],
            companyBraID: ''
        },

        mounted() {
            //code should be here on page load
        },

        methods: {
            AddEditComBranch: function () {
                if (vm.ValidateCompanyForm() !== false) {
                    var ComBranchDetail = {
                        Id: document.getElementById("hdnCompanyID").value,
                        Baseid: document.getElementById("hdnCompanyBaseID").value,
                        Name: document.getElementById("txtCompanyName").value,
                        Address: document.getElementById("txtAddress").value,
                        State: document.getElementById("txtStateName").value,
                        StateCode: document.getElementById("txtStateCode").value,
                        City: document.getElementById("txtCity").value,
                        GSTNO: document.getElementById("txtGSTNo").value,
                        DLNO: document.getElementById("txtDLNo").value
                    }

                    //console.log("Product Detail: ", productDetail);
                    //ajax calling ..
                    $.ajax({ url: "/Company/AddEditBranch", data: ComBranchDetail, method: "POST" })
                        .done(function (response) {
                            if (response.status === true) {
                                vm.clearCompanyFields();
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
                                            window.location.href = "/Company/List";
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
            clearCompanyFields: function () {
                document.getElementById("hdnCompanyID").value = '',
                document.getElementById("hdnCompanyBaseID").value = '';
                document.getElementById("txtCompanyName").value = '';
                document.getElementById("txtAddress").value = '',
                document.getElementById("txtStateName").value = '',
                document.getElementById("txtStateCode").value = '';
                document.getElementById("txtCity").value = '';
                document.getElementById("txtGSTNo").value = '';
                document.getElementById("txtDLNo").value = '';
            },

            //validate doctor detail form
            ValidateCompanyForm: function () {
                if (document.getElementById("txtCompanyName").value === '') {
                    toastr.error("Company name can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    return false;
                }

                return true;
            }
        }
    });
}

function DeleteComBranchByID(Param) {
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
                type: "GET",
                url: "/Company/DeleteComBranch",
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






