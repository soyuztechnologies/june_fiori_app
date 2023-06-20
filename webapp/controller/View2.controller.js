sap.ui.define([
    'emc2/hr/payroll/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
], function(BaseController, MessageBox, MessageToast, Fragment) {
    'use strict';
    return BaseController.extend("emc2.hr.payroll.controller.View2",{
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("superman").attachMatched(this.herculis, this);
        },
        herculis: function(oEvent){
            var sIndex = oEvent.getParameter("arguments").devyani;
            var sPath = '/'  + sIndex;
            this.getView().bindElement(sPath,{
                expand: 'To_Supplier'
            });
            var prodId = sPath.split("'")[1];
            console.log("/sap/opu/odata/sap/ZJUN_ODATA_SRV/ProductImgSet('" + prodId + "')/$value");
            this.getView().byId("prodImg").setSrc("/sap/opu/odata/sap/ZJUN_ODATA_SRV/ProductImgSet('" + prodId + "')/$value")
        },
        onBack: function(){
            //get the parent object = app container
            var oAppCon = this.getView().getParent();
            //Navigate back to view 1
            oAppCon.to("idView1");
        },
        myMsgCode: function(status){
                //console.log(status);
                if(status === "OK"){
                    //MessageBox.success("Wow! you made it");
                    this.getView().setBusy(true);
                    //In JS the this pointer will not be in scoped with asynchronous function
                    //this pointer wont be avaialble inside the callback as controller object
                    //We can create a local variable, all the local variable of caller will be
                    //available for consumption inside callback functions
                    var that = this;
                    setTimeout(() => {
                        that.getView().setBusy(false);
                        MessageToast.show("The Object was saved!");
                    }, 5000);
                }else{
                    MessageBox.error("OMG! it was cancelled");
                }
            
        },
        onPopupConfirm: function(oEvent){
            var sId = oEvent.getSource().getId();
            //Step 1: get the object of selected item
            var oSelectedItem = oEvent.getParameter("selectedItem");
            //Step 2: get the value choosen by user
            var sVal = oSelectedItem.getTitle();
            if(sId.indexOf("city") !== -1){
                //Step 3: set the value to the field
                this.oField.setValue(sVal);
            }else{
                //code for supplier filtering
                //Exercise for all of you 😉
            }
            
        },
        oField: null,
        onF4Help: function(oEvent){
            this.oField = oEvent.getSource();
            //Local copy so that this can be accessed inside the call back
            var that = this;
            //Step 1: To load fragment we use standard SAP UI5 dependency
            if(!this.oCityPopup){
                Fragment.load({
                    name: "emc2.hr.payroll.fragments.popup",
                    id:'city',
                    controller: this
                })
                //Step 2: A promise with keyword 'then' is used to handle the object created by sap
                .then(function(oFrgament){
                    //Step 3: by default we dont have access to this pointer inside the callback/promise
                    //        we need to create a local copy of this
                    that.oCityPopup = oFrgament;
                    that.oCityPopup.setTitle("Suppliers");
                    //Granting the access of Model to the Fragment
                    that.getView().addDependent(that.oCityPopup);
                    that.oCityPopup.setMultiSelect(false);
                    that.oCityPopup.bindAggregation("items",{
                        path: '/cities',
                        template: new sap.m.StandardListItem({
                            description: '{famousFor}',
                            title: '{name}',
                            icon:'sap-icon://home'
                        })
                    });
                    that.oCityPopup.open();
                });
            }else{
                this.oCityPopup.open();
            }
        },
        onSupplierSelect: function(oEvent){
            //Step 1: Which supplier was selected
            var oSelectedItem = oEvent.getParameter("listItem");
            //Step 2: Get the address of the element of selected supplier
            var sPath = oSelectedItem.getBindingContextPath();
            //Step 3: Extract the index of supplier path
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            //Step 4: Trigger the Route to navigate to Supplier View
            this.oRouter.navTo("supplier",{
                supplierId: sIndex
            });
        },
        oSupplierPopup: null,
        oCityPopup: null,
        onFilter: function(){
            //Local copy so that this can be accessed inside the call back
            var that = this;
            //Step 1: To load fragment we use standard SAP UI5 dependency
            if(!this.oSupplierPopup){
                Fragment.load({
                    name: "emc2.hr.payroll.fragments.popup",
                    id:'supplier',
                    controller: this
                })
                //Step 2: A promise with keyword 'then' is used to handle the object created by sap
                .then(function(oFrgament){
                    //Step 3: by default we dont have access to this pointer inside the callback/promise
                    //        we need to create a local copy of this
                    that.oSupplierPopup = oFrgament;
                    that.oSupplierPopup.setTitle("Suppliers");
                    //Granting the access of Model to the Fragment
                    that.getView().addDependent(that.oSupplierPopup);
                    that.oSupplierPopup.bindAggregation("items",{
                        path: '/suppliers',
                        template: new sap.m.StandardListItem({
                            description: '{city}',
                            title: '{name}',
                            icon:'sap-icon://supplier'
                        })
                    });
                    that.oSupplierPopup.open();
                });
            }else{
                this.oSupplierPopup.open();
            }
            


        },
        onSave: function(){
            //here we have access of this
            MessageBox.confirm("Do you want to save?",{
                title: "Anubhav is here",
                //since we are attaching an event using JS code with event handler
                //the event handler will not receive this pointer as controller object
                //hence we need to explicitly pass the controller object to event handler
                onClose: this.myMsgCode.bind(this)
            });
        },
        onCancel: function(){

        }
    });
});