window.onload = function () {

    //clear all input fields
    const clearProductFields = function () {
        document.getElementById("hdnProductBaseID").value = '';
        document.getElementById("txtProductName").value = '';
        document.getElementById("txtHsnCode").value = '',
        document.getElementById("txtBatchNo").value = '',
        document.getElementById("txtDescription").value = '';
        document.getElementById("txtProPackage").value = '';
        document.getElementById("txtUnit").value = '';
        document.getElementById("txtMRP").value = '';
        document.getElementById("txtRate").value = '';
        document.getElementById("txtDiscount").value = '';
        document.getElementById("txtCgstPer").value = '',
        document.getElementById("txtSgstPer").value = '',
        document.getElementById("txtIgstPer").value = ''
    }
   
    const vm = new Vue({
        el: "#medical-product-management",
        data: {
            productList: [],
            ProductID:''
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
            openProductForm: function () {
                $("#rotateInUpLeft").modal("toggle");                
            },

            AddEditProduct: function () {
                if (vm.ValidateProductForm() !== false) {
                    var productDetail = {
                        Id: document.getElementById("hdnProductID").value,
                        Baseid: document.getElementById("hdnProductBaseID").value,
                        ProductName: document.getElementById("txtProductName").value,
                        HsnCode: document.getElementById("txtHsnCode").value,
                        BatchNo: document.getElementById("txtBatchNo").value,
                        ProductDescription: document.getElementById("txtDescription").value,
                        Package: document.getElementById("txtProPackage").value,
                        Unit: document.getElementById("txtUnit").value,
                        Mrp: document.getElementById("txtMRP").value,
                        Rate: document.getElementById("txtRate").value,
                        Discount: document.getElementById("txtDiscount").value,
                        CgstPer: document.getElementById("txtCgstPer").value,
                        SgstPer: document.getElementById("txtSgstPer").value,
                        IgstPer: document.getElementById("txtIgstPer").value
                    }

                    //console.log("Product Detail: ", productDetail);
                    //ajax calling ..
                    $.ajax({ url: "/AddEditProduct", data: productDetail, method: "POST" })
                        .done(function (response) {
                            if (response.status === true) {
                                //console.log("Call Back Return: ", data);                        
                                //$("#itemModal").modal("toggle");
                                clearProductFields();
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
                                            window.location.href = "/Product/List";
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

            //GetProductList: function () {
            //    axios.get('/GetAllProduct')
            //        .then(response => {
            //            if (response.status !== false) {
            //                this.productList = response.data;
            //                //console.log("Product List: ", this.productList);
            //            }
            //        })
            //        .catch(error => {
            //            alert(error);
            //        })
            //},

            populateProductDetail: function (productDetail) {
                //console.log("Product ID: ", productID);
                console.log(productDetail);
                $("#itemModal").modal("toggle");

                document.getElementById("hdnProductID").value = productDetail.id,
                document.getElementById("hdnProductBaseID").value = productDetail.baseid,
                document.getElementById("txtProductName").value = productDetail.productName,
                document.getElementById("txtHsnCode").value = productDetail.hsnCode,
                document.getElementById("txtBatchNo").value = productDetail.batchNo,
                document.getElementById("txtDescription").value = productDetail.productDescription,
                document.getElementById("txtProPackage").value = productDetail.package,
                document.getElementById("txtUnit").value = productDetail.unit,
                document.getElementById("txtMRP").value = productDetail.mrp
                document.getElementById("txtRate").value = productDetail.rate,
                document.getElementById("txtDiscount").value = productDetail.discount,
                document.getElementById("txtCgstPer").value = productDetail.CgstPer,
                document.getElementById("txtSgstPer").value = productDetail.SgstPer,
                document.getElementById("txtIgstPer").value = productDetail.IgstPer
            },

            //DeleteProduct: function (productID) {
            //    //console.log("Product ID: ", productID);
            //    Swal.fire({
            //        title: 'Do you want to delete this product?',
            //        showCancelButton: true,
            //        confirmButtonText: `Delete`,
            //    }).then((result) => {
            //        /* Read more about isConfirmed, isDenied below */
            //        if (result.isConfirmed) {
            //            axios.get(`/DeleteProduct?Param=${productID}`)
            //            .then(function (response) {
            //                //console.log("response data", response.data.successMessage);
            //                Swal.fire({
            //                    position: 'top-end',
            //                    icon: 'success',
            //                    title: response.data.successMessage,
            //                    showConfirmButton: false,
            //                    timer: 2500
            //                })
            //                vm.GetProductList();
            //            })                        
            //        }
            //    })
            //},

            ResetProductForm: function () {
                clearProductFields();
            },

            ValidateProductForm: function () {
                if (document.getElementById("txtProductName").value === '') {                    
                    toastr.error("Product name can't be left blank", "INVALID INPUT", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
                    return false;
                }

                //if (document.getElementById("txtProjectGroup").value === '') {
                //    toastr.error("Pleae enter project group name!", "", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 4000 });
                //    return false;
                //}

                //if (document.getElementById("txtProjectDesc").value === '') {
                //    toastr.error("Pleae enter project description!", "", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 4000 });
                //    return false;
                //}

                //if (document.getElementById("ddlChannelID").value === '0') {
                //    toastr.error("Pleae select channel", "", { positionClass: 'toast-top-center', containerId: 'toast-top-center', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 4000 });
                //    return false;
                //}

                return true;
            }                                               
        }
    });
}




