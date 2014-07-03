(function (global) {
	var BillDetailsViewModel,
		BillDetailsService,
        app = global.app = global.app || {};

	BillDetailsViewModel = kendo.data.ObservableObject.extend({
        title: "",
        icon: "",
        consumption: "",
        account: "",
        period: "",
        usage: "",
        totalCost: "",
        
		init: function () {
			var that = this;

			kendo.data.ObservableObject.fn.init.apply(that, arguments);
        }
	});

	BillDetailsService = kendo.Class.extend({
		viewModel: null,
        
        expandExp: {
            "History": true,
            "Type": true,
        },

		init: function () {
			var that = this;

			that.viewModel = new BillDetailsViewModel();
            
			that.showData = $.proxy(that.initData, that);
		},

		initData: function (e) {
			var that = this,
				dataId = e.view.params.dataId;

			if (!dataId) {
				return;
			}

			app.common.showLoading();

			app.everlive.data("Bill").expand(that.expandExp).getById(dataId)
                .then($.proxy(that.setData, that))
                .then(null, $.proxy(that.onError, that));			
		},

		setData: function (billData) {
			var that = this,
                billData = billData.result;

            that.viewModel.set("title", billData.Title);
            that.viewModel.set("icon", billData.Type.Icon);
			that.viewModel.set("consumption", that.calculateTotalConsumption(billData.History));
            that.viewModel.set("account", billData.Account);
            that.viewModel.set("period", that.calculatePeriod(billData.History));
            that.viewModel.set("totalCost", that.calculateTotalCost(billData.History));

			app.common.hideLoading();
		},
        
        calculateTotalConsumption: function(history) {
            var consumption = 0;
            
            for(var i = 0, l = history.length; i < l; i++) {
                if(!history[i].Paid) {
                    consumption += history[i].Consumption;
                }
            }
            
            return consumption;
        },
        
        calculatePeriod: function(history) {
            var period = "";
            
            for(var i = 0, l = history.length; i < l; i++) {
                if(!history[i].Paid) {
                    period += history[i].StartDate + " - " history[i].EndDate + " | ";
                }
            }
            
            return period;
        },
        
        calculateTotalCost: function(history) {
            var cost = 0;
            
              for(var i = 0, l = history.length; i < l; i++) {
                if(!history[i].Paid) {
                    cost += history[i].Cost;
                }
            }
            
            return cost;
        },

		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.billDetailsService = new BillDetailsService();
})(window);