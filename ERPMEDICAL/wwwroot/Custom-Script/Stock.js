$(document).ready(function () {
    const vm = new Vue({
        el: "#app-container",
        data: {
            products: []
        },
        mounted() {
            //For Product
            debugger;
            this.getProduct().then(v => {
                $("#ddlProducts").select2({
                    data: v
                });
            })
            $("#ddlProducts").on('change', function () {
                debugger;
                value = parseInt($(this).val());
                axios.get(`/StockValue?Id=${value}`).then(response => {
                    $("#txtStock").val(response.data.stockCount);
                })
            })

        },
        computed: {
        },
        methods: {
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
            }
        }
    })
});