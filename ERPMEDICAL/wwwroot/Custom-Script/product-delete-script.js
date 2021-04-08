function DeleteProductByID(Param) {

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
                url: "/Product/DeleteProduct",
                dataType: "json",
                data: { "Param": Param },
                success: function (response) {
                    if (response.status === true) {
                        Swal.fire({
                            title: "SUCCESS!",
                            text: response.successMessage,
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false,
                            allowOutsideClick: false,
                        }).then(function (returnVal) {
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