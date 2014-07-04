(function (global) {
	var SettingsService,
        SettingsViewModel,
        app = global.app = global.app || {};
    
	SettingsViewModel = kendo.data.ObservableObject.extend({
        selectedLanguage: "",
        
        events: {
            languageUpdate: "languageUpdate"  
        },
        
		init: function () {
			var that = this;
            
			kendo.data.ObservableObject.fn.init.apply(that, that);
		},
        
        onLanguageSelectEN: function() {
            var that = this;
            
            that.trigger(that.events.languageUpdate, { lang: "en" });
        },
        
        onLanguageSelectAR: function() {
            var that = this;
            
            that.trigger(that.events.languageUpdate, { lang: "ar" });
        }
	});
    

	SettingsService = kendo.Class.extend({
		viewModel: null,
        consts: {
            localStorageKey: "dubaiServicesLanguage"
        },
        
		init: function () {
			var that = this;

			that.viewModel = new SettingsViewModel();
            that._bindToEvents();
            
			that.initModule = $.proxy(that.initData, that);
		},
            
        _bindToEvents: function() {
            var that = this;
            
			that.viewModel.on(that.viewModel.events.languageUpdate, $.proxy(that.setLanguage, that));
        },    

		initData: function () {
			var that = this;
            
        	that.viewModel.set("selectedLanguage", that.getLanguage());
		},
        
        getLanguage: function() {
            localStorage.getItem(that.consts.localStorageKey);
        },
        
        setLanguage: function(val) {
            localStorage.setItem(that.consts.localStorageKey, val);
        }
	});
    
	app.settingsService = new SettingsService();
})(window);