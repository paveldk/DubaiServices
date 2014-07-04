(function (global) {
	var DashBoardViewModel,
        DashBoardService,
        app = global.app = global.app || {};

	DashBoardViewModel = kendo.data.ObservableObject.extend({
        viewId: "#dashboard-view",
        isEn: true
	});

	DashBoardService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new DashBoardViewModel();
			that.showModule = $.proxy(that.initData, that);
            that.show = $.proxy(that._show, that);
		},

		initData: function () {
            var that = this;
            
            if(!app.settingsService.isLogged()) {
            	app.common.navigateToView(app.config.views.settings);
                return;
            }
		},
        
        _show: function() {
            var that = this,
                language = app.settingsService.getLanguage();
            
            that.viewModel.$view = $(that.viewModel.viewId);
            that.viewModel.$view.removeClass("en ar").addClass(language);
            that.viewModel.set("isEn", language === "en");
        }
	});

	app.dashBoardService = new DashBoardService();
})(window);