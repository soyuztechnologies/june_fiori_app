sap.ui.define([
    'emc2/hr/payroll/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/json/JSONModel'
], function(BaseController, MessageBox, MessageToast, Fragment, JSONModel) {
    'use strict';
    return BaseController.extend("emc2.hr.payroll.controller.Add",{
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("add").attachMatched(this.herculis, this);
            var oModel = new JSONModel();
            oModel.setData({
                "prodData":{
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000047",
                    "SUPPLIER_NAME" : "Becker Berlin",
                    "TAX_TARIF_CODE" : "1 ",
                    "MEASURE_UNIT" : "EA",
                    "PRICE" : "0.00",
                    "CURRENCY_CODE" : "USD",
                    "DIM_UNIT" : "CM",
                    "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/"
                }
            });
            this.getView().setModel(oModel,"local");
            this.oLocalModel = oModel;
            this.setMode("Create");
        },
        herculis: function(oEvent){
            
        },
        onLoadMostExp: function(){
            //Step 1: Get the odata model object
            var oDataModel = this.getView().getModel();
            //Step 2: call function from odata
            var that = this;
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters: {
                    "I_CATEGORY": this.getView().byId("category").getSelectedKey()
                },
                success: function(data){
                    //Step 3: handle response
                    that.oLocalModel.setProperty("/prodData",data);
                }
            });
            
        },
        onDelete: function(){
            //Step 1: get the payload
            var payload = this.getView().getModel("local").getProperty("/prodData");
            //Step 2: Get OData Model object
            var oDataModel = this.getView().getModel();
            //Step 3: Fire Delete request to server
            oDataModel.remove("/ProductSet('" + payload.PRODUCT_ID + "')",{
                //Step 4: handle response
                success: function(){
                    MessageBox.confirm("The delete was successful");
                    that.onClear();
                },
                error: function(){
                    MessageBox.error("There was an issue in delete");
                }
            });
            
        },
        onSave: function(){
            //Step 1: get the payload
            var payload = this.getView().getModel("local").getProperty("/prodData");
            
            //Step 2: Check if its valid
            if(!payload.PRODUCT_ID){
              MessageBox.error("Please enter valid product id")  ;
              return;
            }

            payload.PRODUCT_PIC_URL = payload.PRODUCT_PIC_URL + payload.PRODUCT_ID;
            //Step 3: Get the odata model object
            var oDataModel = this.getView().getModel();
            if (this.mode === 'Update') {
                //if the mode is update, user is editing the product data
                oDataModel.update("/ProductSet('" + payload.PRODUCT_ID + "')", payload,{
                    success: function(){
                        MessageToast.show("The update was successful");
                    },
                    error: function(oError){
                        MessageBox.error("There was an issue in update");
                    }
                });
            }else{
                //Step 4: Fire the POST Call
                oDataModel.create("/ProductSet", payload,{
                    //Step 5: success - callback if post was fine
                    success: function(data){
                        MessageToast.show("A product was created successfully");
                    },
                    //Step 6: error - callback if post was having issues
                    error: function(oErr){
                        MessageBox.error("OOPS!! something went wrong --> " + JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                    }
                });  
            }                     
            
        },
        oSupplierPopup: null,
        oField: null,
        onPopupConfirm: function(oEvent){
            var oSelectedItem = oEvent.getParameter("selectedItem");
            this.getView().getModel("local").setProperty("/prodData/SUPPLIER_ID",oSelectedItem.getTitle());
            this.getView().getModel("local").setProperty("/prodData/SUPPLIER_NAME",oSelectedItem.getDescription());
            //this.oField.setValue(getParameter.getTitle());
        },
        onSupplierF4: function(oEvent){
            this.oField = oEvent.getSource();
            var that = this;
            if(!this.oSupplierPopup){
                Fragment.load({
                    name: 'emc2.hr.payroll.fragments.popup',
                    controller: this,
                    id: 'supp'
                }).then(function (oFragment) {
                    that.oSupplierPopup = oFragment;
                    that.getView().addDependent(that.oSupplierPopup);
                    that.oSupplierPopup.bindAggregation("items",{
                        path: '/SupplierSet',
                        template: new sap.m.StandardListItem({
                            title: '{BP_ID}',
                            description: '{COMPANY_NAME}',
                            icon:'sap-icon://supplier'
                        })
                    });
                    that.oSupplierPopup.setTitle("Choose Supplier from SAP");
                    that.oSupplierPopup.open();
                });
            }else{
                this.oSupplierPopup.open();
            }
            
        },
        //this mode function changes the mode and changes UI element 
        setMode: function(sMode){
            this.mode = sMode;
            if(sMode === 'Update'){
                this.getView().byId("save").setText("Update");
                this.getView().byId("prodId").setEnabled(false);
                this.getView().byId("delete").setEnabled(true);
            }else{
                this.getView().byId("save").setText("Save");
                this.getView().byId("prodId").setEnabled(true);
                this.getView().byId("delete").setEnabled(false);
            }
        },
        //GLOBAL mode property
        mode: 'Create',
        onEnterProd: function(oEvent){
            //Step 1: what was the value entered by user on the field
            var sProdId = oEvent.getSource().getValue();
            //Step 2: Get the odata model object
            var oDataModel = this.getView().getModel();
            //Step 3: Make a GET call to read single product data from SAP
            var that = this;
            oDataModel.read("/ProductSet('" + sProdId + "')",{
                success: function(data){
                    that.oLocalModel.setProperty("/prodData",data);
                    that.setMode('Update');
                },
                error: function(oErr){
                    that.onClear();
                    MessageToast.show("There is no product available for this id");
                }
            });
        },
        onClear: function(){
            this.setMode("Create");
            this.oLocalModel.setProperty("/prodData",{
                "PRODUCT_ID" : "",
                "TYPE_CODE" : "PR",
                "CATEGORY" : "",
                "NAME" : "",
                "DESCRIPTION" : "",
                "SUPPLIER_ID" : "0100000047",
                "SUPPLIER_NAME" : "Becker Berlin",
                "TAX_TARIF_CODE" : "1 ",
                "MEASURE_UNIT" : "EA",
                "PRICE" : "0.00",
                "CURRENCY_CODE" : "USD",
                "DIM_UNIT" : "CM",
                "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/"
            });
        },
        onBack: function(){
            //get the parent object = app container
            var oAppCon = this.getView().getParent();
            //Navigate back to view 1
            oAppCon.to("idView1");
        }
    });
});