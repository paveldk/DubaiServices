(function (global) {
	var BillDetailsViewModel,
		BillDetailsService,
        app = global.app = global.app || {};

	BillDetailsViewModel = kendo.data.ObservableObject.extend({
        id: "",
        title: "",
        parentClass: "",
        innerClass: "",
        color: "",
        consumption: "",
        account: "",
        date: "",
        cost: "",
        viewId: "#bill-details-view",
        
        events: {
            payBill: "payBill"
        },
        
		init: function () {
			var that = this;
            
			kendo.data.ObservableObject.fn.init.apply(that, arguments);
        },
        
        onPayBillClick: function() {
            var that = this;
            
            that.trigger(that.events.payBill, {});
        }
	});

	BillDetailsService = kendo.Class.extend({
        viewModel: null,
        months_en: ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        
        expandExp: {
            "History": {
                "Sort": {
                    "EndDate": 1
                }
            },
            "Type": true,
        },

		init: function () {
			var that = this;

			that.viewModel = new BillDetailsViewModel();
            that._bindToEvents();
            
			that.showData = $.proxy(that.initData, that);
		},
        
        _bindToEvents: function() {
			var that = this;
            
            that.viewModel.bind(that.viewModel.events.payBill, $.proxy(that.onPayBill, that));
        },

		initData: function (e) {
			var that = this,
				dataId = e.view.params.dataId,
            	language = app.settingsService.getLanguage();

			if (!dataId) {
				return;
			}
            
            
            app.common.showLoading();

            that.viewModel.set("id", dataId);

            that.viewModel.$view = $(that.viewModel.viewId);
            that.viewModel.$view.removeClass("en ar").addClass(language);
            that.viewModel.set("isEn", language === "en");

			app.everlive.data("Bill").expand(that.expandExp).getById(dataId)
                .then($.proxy(that.setData, that))
                .then(null, $.proxy(that.onError, that));			
		},

		setData: function (billData) {
			var that = this,
                billData = billData.result,
                periodChartDS = new kendo.data.DataSource();

            that.viewModel.set("title", billData.Title);
            that.viewModel.set("parentClass",  "ds-icon ds-icon-" + billData.Type.Icon);
            that.viewModel.set("innerClass", "fa " + billData.Type.Icon);
            that.viewModel.set("color", billData.Type.Color);
			that.viewModel.set("consumption", that.calculateTotalConsumption(billData.History));
            that.viewModel.set("account", billData.Account);
            that.viewModel.set("cost", that.calculateTotalCost(billData.History));
            that.viewModel.set("date", that.calculatePeriod(billData.History));
            
           	that.buildPeriodChartDS(billData.History);

			app.common.hideLoading();
		},
        
        calculateTotalConsumption: function(history) {
            var consumption = 0;
            
            for(var i = 0, l = history.length; i < l; i++) {
                if(!history[i].Paid) {
                    consumption += parseInt(history[i].Consumption, 10);
                }
            }
            
            return consumption;
        },
        
        calculatePeriod: function(history) {
            var period = "";
            
            for(var i = 0, l = history.length; i < l; i++) {
                if(!history[i].Paid) {
                    period += new Date(history[i].StartDate).format("mmm dd, yyyy") + " to " + new Date(history[i].EndDate).format("mmm dd, yyyy") + " | \n";
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
        
        buildPeriodChartDS: function(history) {
            var that = this,
                $chart,
                ds = [];
            
            for(var i = 0, l = history.length; i < l; i++) {
                ds.push({value: parseInt(history[i].Consumption, 10), date: that.months_en[history[i].EndDate.getMonth()] });
            }
            
            that.createChart(ds);
        },
        
        createChart: function(ds) {
            var that = this;
            
            // todo move to MVVM
            $chart = $("#chart").empty();
            
            $chart.kendoChart({
                dataSource: {
                    data: ds
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                    field: "value",
                    aggregate: "avg",
                    categoryField: "date",
                    color: that.viewModel.color,
                    markers: {
                        visible: false
                    }
                }],
                valueAxis: {
				    color: "#999999",
                    line: {
      				  visible: false
    				},
                    majorGridLines: {
      				  width: 1,
          			  color: "rgba(255, 255, 255, .2)"
    				}
  			  },
                categoryAxis: {
                    baseUnits: "months",
                    color: "#999999",
                    line: {
          			  color: "rgba(255, 255, 255, .2)"
    				},
                    majorGridLines: {
                        visible: false
                    },
                    majorTicks: {
                        visible: false
                    }
                }
            });
        },
        
        onPayBill: function() {
            var that = this;
            
            //todo - create and pass DTO instead of viewModel
            app.paymentService.pay(that.viewModel)
            	.then($.proxy(that.paymentCompleted, that));
        },
        
        paymentCompleted: function(itemId) {
            app.common.notification("Payment completed", "Payment Completed");
        	//todo hide pay button etc...
        },
        
        getMonth: function() {
            
        },

		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		},
	});

	app.billDetailsService = new BillDetailsService();
})(window);
