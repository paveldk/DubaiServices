(function (global) {
	var PaymentService,
        SettingsController,
        SettingsViewModel,
        app = global.app = global.app || {};

	PaymentService = kendo.Class.extend({
		init: function () {

		},

        pay: function(args) {
            //args can be array or object
            //todo some operations
        	//do magic 
        	//return promise with itemUid;
        },
        
        paySingle: function(payment) {
            
        }
	});
    
	app.paymentService = new PaymentService();
})(window);