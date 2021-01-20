$(document).ready(function () {
    const vm = new Vue({
        el: "#app-container",
        data: {
            Companies: [],
            CompanyId:0
        },
        mounted() {
            
           
        },
        created: function () {
            //For Company 
            this.getCompany();
          
        },
        computed: {
        },
        methods: {
            getCompany: function () {

                axios.get('/GetAllCompany')
                    .then(response => {

                        let companies = response.data;
                        const modcompanies = companies.map(x => {
                            const { id, name } = x;
                            var obj = {
                                id: id,
                                text: name
                            }
                            return obj;
                        });
                        
                        this.Companies.push(modcompanies);
                    })
            },
            LoginSubmit: function () {
                var vm = this;
                debugger;
                var loginVM = {
                    UserName: document.getElementById("username").value,
                    Password: document.getElementById("password").value,
                    CompanyId: vm.CompanyId
                }
                $.ajax({ url: "/Login", data: loginVM, method: "POST" })
                    .done(function (response) {
                        // vm.bugs.splice(0, 0, newBug);
                        //console.log(data);
                        debugger;
                        if (response.status) {
                            location.replace("/Home/Index");
                        }
                        else {
                            location.replace("/User/Login");
                        }
                        //location.replace("/Puchase/PO");
                        //Redirect to new page
                    }).fail(function () {
                        // toastr.error("Can not add new bug!");
                    }).always(function () {
                        //vm.clearData();
                    });
            }
        }
    })
});