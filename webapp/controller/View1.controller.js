sap.ui.define([
    'emc2/hr/payroll/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(BaseController, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("emc2.hr.payroll.controller.View1",{
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
        },
        onSearch:function(oEvent){
            //Step 1: get the value of what user is searching for from event object
            //https://ui5.sap.com/#/api/sap.m.SearchField%23events/search
            var sValue = oEvent.getParameter("query");
            //Step 2: Create a search object (like a if condition opr1 OPR opr2)
            var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sValue);
            // var oFilter2 = new Filter("type", FilterOperator.Contains, sValue);
            // //Construct a filter with OR when we need multiple
            // var oFilter = new Filter({
            //     filters: [oFilter1, oFilter2],
            //     and:false
            // });
            //Step 3: Get the object of list control
            var oList = this.getView().byId("idList");
            //var oList = oEvent.getSource();
            //Step 4: Get the binding - items
            var oBinding = oList.getBinding("items");
            //Step 5: Pass filter to the binding
            oBinding.filter(oFilter1);
        },
        onItemPress: function(oEvent){
            //Step 1: get the address of the selected element
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            //Step 2: Whenever a fruit is selected, we extract the path of the
            //element which was selected e.g. the index - /fruits/3
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            //Step 3: This we will set as part of end point, hash tag
            //Navigate also
            this.onGoTo(sIndex);

        },
        onDeleteItem: function(oEvent){
            //Step 1: Find out which item was pressed for deletion
            var oItemToBeDeleted = oEvent.getParameter("listItem");
            //Step 2: Get the object of list control = without using ID is a good practice
            var oList = oEvent.getSource();
            //Step 3: call Delete API provided by SDK
            oList.removeItem(oItemToBeDeleted);
        },
        onAdd: function(){
            this.oRouter.navTo("add");
        },
        onGoTo: function(sIndex){
            //Step 1: get the object of the app container control
            //get the object of the parent
            //var oAppCon = this.getView().getParent().getParent();
            //Step 2: Call function of the container to navigate
            //oAppCon.toDetail("idView2");
            this.oRouter.navTo("superman",{
                devyani: sIndex
            });
        }
    });
});