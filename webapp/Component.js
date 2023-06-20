sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("emc2.hr.payroll.Component",{
        metadata: {
            manifest: "json"
        },
        //Constructor of the class
        init : function(){
            //super->constructor() -- call parent class constructor
            //Which will initialize standard object presnet in parent class
            // some of these objects we will use later
            
            UIComponent.prototype.init.apply(this);

            //get the router object
            var oRouter = this.getRouter();
            //Initialization function
            oRouter.initialize();

        },
        // createContent: function(){

        //     //Our root view of the application
        //     var oAppView = new sap.ui.view({
        //         id: "idAppView",
        //         viewName: "emc2.hr.payroll.view.App",
        //         type:"XML"
        //     });

        //     //Get the object of container control from app view
        //     var oAppCon = oAppView.byId("idAppCon");

        //     //Inside this app Container object we will add our views (View1, View2)
        //     var oView1 = new sap.ui.view({
        //         id: "idView1",
        //         viewName: "emc2.hr.payroll.view.View1",
        //         type:"XML"
        //     });

        //     var oView2 = new sap.ui.view({
        //         id: "idView2",
        //         viewName: "emc2.hr.payroll.view.View2",
        //         type:"XML"
        //     });

        //     var oEmpty = new sap.ui.view({
        //         id: "idEmpty",
        //         viewName: "emc2.hr.payroll.view.Empty",
        //         type:"XML"
        //     });

        //     //Container will give preference to the first child added to it.
        //     oAppCon.addMasterPage(oView1).addDetailPage(oEmpty).addDetailPage(oView2);

        //     return oAppView;
        // },
        //Destructor of this class
        destroy: function(){

        }
    });
});