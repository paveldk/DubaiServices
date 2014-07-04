(function (global) {
	var BillDetailsViewModel,
		BillDetailsService,
        app = global.app = global.app || {};

	BillDetailsViewModel = kendo.data.ObservableObject.extend({
        title: "",
        icon: "",
        color: "",
        consumption: "",
        account: "",
        period: "",
        periodChartDS: "",
        totalCost: "",
        
		init: function () {
			var that = this;

            that.periodChartDS = new kendo.data.DataSource();
            
			kendo.data.ObservableObject.fn.init.apply(that, arguments);
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
                billData = billData.result,
                periodChartDS = new kendo.data.DataSource();

            that.viewModel.set("title", billData.Title);
            that.viewModel.set("icon", billData.Type.Icon);
            that.viewModel.set("color", billData.Type.Color);
			that.viewModel.set("consumption", that.calculateTotalConsumption(billData.History));
            that.viewModel.set("account", billData.Account);
            that.viewModel.set("totalCost", that.calculateTotalCost(billData.History));
            that.viewModel.set("period", that.calculatePeriod(billData.History));
            
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
                    period += history[i].StartDate + " - " + history[i].EndDate + " | ";
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
            
            that.viewModel.get("periodChartDS").data(ds);
            
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
        
        getMonth: function() {
            
        },

		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.billDetailsService = new BillDetailsService();
})(window);