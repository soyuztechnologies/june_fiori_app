sap.ui.define([
    'emc2/hr/payroll/controller/BaseController'
], function(BaseController) {
    'use strict';
    return BaseController.extend("emc2.hr.payroll.controller.App",{
        onInit: function(){
            console.log("Hey Anubhav, your app Controller is now Ready!");
        }
    });
});