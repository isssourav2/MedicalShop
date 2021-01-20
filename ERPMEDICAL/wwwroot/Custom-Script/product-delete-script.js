function DeleteProductByID(Param) {    
    $.ajax({
        type: "POST",
        url: "/Product/DeleteProduct",
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
                    buttonsStyling: false,
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