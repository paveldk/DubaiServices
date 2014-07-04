(function (global) {
	var AddBillViewModel,
        AddBillService,
        app = global.app = global.app || {};
    
	AddBillViewModel = kendo.data.ObservableObject.extend({
        viewId: "#add-bill-view",
		typesDataSource: null,
        isEn: true,
        name: "",
        account: "",
        
		init: function () {
			var that = this;

            that.typesDataSource = new kendo.data.DataSource({ pageSize: 10 });
            
			kendo.data.ObservableObject.fn.init.apply(that, that);
		},
        
        onAdd: function() {
            
        },
        
        onTypeChange: function() {
            
        }
	});


	AddBillService = kendo.Class.extend({
		viewModel: null,
        
        expandExp: {
            "History": true,
            "Type": true,
        },

		init: function () {
			var that = this;

			that.viewModel = new AddBillViewModel();
            that._bindToEvents();
            
			that.initModule = $.proxy(that.initData, that);
            that.showModule = $.proxy(that._show, that);
		},
        
        _bindToEvents: function() {
          	var that = this;
            
        },

		initData: function () {
			var that = this;

            app.common.showLoading();
            
			that.getBillsData();
		},
        
        _show: function() {
            var that = this,
            	language = app.settingsService.getLanguage();  
            
            that.viewModel.$view = $(that.viewModel.viewId);
            that.viewModel.$view.removeClass("en ar").addClass(language);
            that.viewModel.set("isEn", language === "en");
        },

		getBillsData: function () {
            var that = this;
            
            return app.everlive.data("BillTypes").get()
                .then($.proxy(that.storeTypes, that));
		},
        
        storeTypes: function(data) {
            var that = this,
                types = data.result,
                isEn = that.viewModel.get("isEn");
            
            for(var i = 0, l = types.length; i < l; i++) {
                types[i].isEn = isEn;
            }
            
            that.viewModel.get("typesDataSource").data(types);
            app.common.hideLoading();
        }
	});
    
	app.addBillService = new AddBillService();
})(window);
