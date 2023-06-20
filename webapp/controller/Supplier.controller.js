sap.ui.define([
    'emc2/hr/payroll/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/core/routing/History"
], function(BaseController, Filter, FilterOperator, History) {
    'use strict';
    return BaseController.extend("emc2.hr.payroll.controller.Supplier",{
        onInit: function(){
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("supplier").attachMatched(this.herculis, this);
        },
        herculis: function(oEvent){
            var sIndex = oEvent.getParameter("arguments").supplierId;
            var sPath = '/suppliers/'  + sIndex;
            this.getView().bindElement(sPath);
        },
        onBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("spiderman", {}, true);
			}
		}
    });
});