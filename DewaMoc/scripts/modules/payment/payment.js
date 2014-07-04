(function (global) {
	var PaymentService,
        SettingsController,
        SettingsViewModel,
        app = global.app = global.app || {},
        pp;

	PaymentService = kendo.Class.extend({
		init: function () {
			pp = new paypal_sdk();
            
            pp.configure({
                'mode': 'sandbox',
                'client_id': 'Aa9oAxDYwdmzU3_X3gV_GiDjwrvi9Q66NG-ilyTdHerrJxTwBU6O7pcEwylm',
                'client_secret': 'ED6B1BCCnjK2KYxC1gcY55Q5GeEqppcj4YLxQY2iwq2o9o0hgZI2GV6fxBVR'
            })
		},

        pay: function(payments) {
            //args can be array or object
            //todo some operations
        	//do magic 
        	//return promise with itemUid;
            
            if(!payments.hasOwnProperty('length')) {
                payments = [payments];
            }
            
			var promisesArray = [];
            var that = this;
            
            payments.forEach(function(payment){
                promisesArray.push(that.paySingle(payment));
                console.log(promisesArray.length + ' of ' + payments.length + ' payments completed');
            })
            
            return $.when(promisesArray);
        },
        
        paySingle: function(payment) {
            console.log('Payment: ' + JSON.stringify(payment));
            
            var transaction = {
            	'amount':{
            		'total': payment.cost,
            		'currency': 'USD'
            		//AED stand for United Arab Emirates dirham, but I couldn't find such code on PayPal site
            	},
            	'description': payment.account + '/' + payment.title + '/' + payment.consumption + '/' + payment.date
            };
            
            var prom = $.Deferred();
            
            var create_payment_json = {
                'intent': 'sale',
                'payer': {
                    'payment_method': 'credit_card',
                    'funding_instruments': [
                        {
                            'credit_card': {
                                'number': '5500005555555559',
                                'type': 'mastercard',
                                'expire_month': 12,
                                'expire_year': 2018,
                                'cvv2': 111,
                                'first_name': 'Betsy',
                                'last_name': 'Buyer'
                            }
                        }
                    ]
                },
                'transactions': [transaction]
            };
			
            pp.payment.create(JSON.stringify(create_payment_json), function (err, res) {
                if (err) {
                	prom.reject(err.responseText);
                	console.log(err);
                }

                if (res) {
                	prom.resolve(res);
                    console.log(res);
                }
            });
            
            return prom.promise();
        }
	});
    
	app.paymentService = new PaymentService();
})(window);