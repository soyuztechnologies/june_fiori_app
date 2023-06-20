sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'emc2/hr/payroll/util/formatter'
], function(Controller, Formatter) {
    'use strict';
    return Controller.extend("emc2.hr.payroll.controller.BaseController",{
        formatter: Formatter
    });
});