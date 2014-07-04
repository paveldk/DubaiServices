(function (global) {
	var Bill,
        BillsViewModel,
        BillsService,
        app = global.app = global.app || {};

	app.newLeafData = app.newLeafData || {};

    Bill = kendo.data.ObservableObject.extend({
        id: null,
        title: "",
        date: "N/A",
        cost: 0,
        icon: "",
        
		init: function (item) {
			var that = this;
            
            that.id = item.Id;
            that.icon = item.Type.Icon;
            that.title = item.Title;
            
            if(item.History.length > 0) {
                that.date = item.History[item.History.length - 1].EndDate;
            }
            
            that.setCost(item.History);
            
			kendo.data.ObservableObject.fn.init.apply(that, that);
		},
        
        setCost: function(history) {
            var that = this;
            
            for(var i = 0, l = history.length; i < l; i++) {
                if(!history[i].Paid) {
                    that.cost += history[i].Cost;
                }
            }
        }
	});
    
	BillsViewModel = kendo.data.ObservableObject.extend({
		billsDataSource: null,
        totalCost: 0,
        
        events: {
            payAll: "payAll"
        },

		init: function () {
			var that = this;

            that.billsDataSource = new kendo.data.DataSource({ pageSize: 10 });
            
			kendo.data.ObservableObject.fn.init.apply(that, that);
		},
        
        onPayAllClick: function() {
            var that = this;
            
            that.trigger(that.events.payAll, { billsToPay: that.get("billsDataSource").data() });
        }
	});


	BillsService = kendo.Class.extend({
		viewModel: null,
        
        expandExp: {
            "History": true,
            "Type": true,
        },

		init: function () {
			var that = this;

			that.viewModel = new BillsViewModel();
            that._bindToEvents();
            
			that.initModule = $.proxy(that.initData, that);
		},
        
        _bindToEvents: function() {
          	var that = this;
            
            that.viewModel.bind(that.viewModel.events.payAll, $.proxy(that.onPayAll, that));
        },

		initData: function () {
			var that = this;

            app.common.showLoading();
            
			that.getBillsData();
		},

		getBillsData: function () {
            var that = this;
            
            return app.everlive.data("Bill").expand(that.expandExp).get()
                .then($.proxy(that.storeBills, that));
		},
        
        storeBills: function(data) {
            var that = this,
                newBill,
                ds = [];
            
            for(var i = 0, l = data.result.length; i < l; i++) {
                newBill = new Bill(data.result[i]);
                
           		ds.push(newBill);
            }
            
            that.viewModel.get("billsDataSource").data(ds);
            app.common.hideLoading();
        },
        
        onPayAll: function(data) {
            var that = this;
            
            app.paymentService.pay(data.billsToPay)
            	.then($.proxy(that.paymentCompleted, that));
        },
        
        paymentCompleted: function() {
            
        }
	});
    
	app.billsService = new BillsService();
})(window);