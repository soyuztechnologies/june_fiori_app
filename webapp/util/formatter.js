sap.ui.define([
    
], function(require, factory) {
    'use strict';
    return {
        getState: function(status){
            switch (status) {
                case 'Available':
                    return 'Success';
                    break;
                case 'Discontinued':
                    return 'Error';
                    break;
                case 'Out Of Stock':
                    return 'Warning';
                    break;
                default:
                    break;
            }
        }
    }
});