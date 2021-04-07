var ElementCreation = {

    CreateElement: function createEl(parentDiv,obj) {
        

    },

    createFormGroup: function formgroup(obj) {
        //obj is obj which content 
        if (Object.prototype.toString.call(obj.results) === "[object object]") {
            var formgroup = document.createElement("div");
            formgroup.classList.add("form-group");
            //label of formGroup
            var labelnode = document.createTextNode(obj.labelText);
            var labelcon = document.createElement("label");
            labelcon.classList.add("col-md-3");
            labelcon.classList.add("control-label");
            labelcon.appendChild(labelnode);

            //column div creation
            var columnmd = document.createElement("div");
            //create input Element 
            columnmd.classList.add("col-md-6");
            var inputText = obj.inPutElement;
            columnmd.innerHTML = inputText;
            formgroup.appendChild(columnmd);
        }
    }
}