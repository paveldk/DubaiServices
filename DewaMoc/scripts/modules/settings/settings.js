(function (global) {
	var SettingsService,
        SettingsViewModel,
        app = global.app = global.app || {};
    
	SettingsViewModel = kendo.data.ObservableObject.extend({
        selectedLanguage: "",
        
        events: {
            languageUpdate: "languageUpdate"  
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
            
			that.initModule = $.proxy(that.initData, that);
		},
            
        _bindToEvents: function() {
            var that = this;
            
			that.viewModel.bind(that.viewModel.events.languageUpdate, $.proxy(that.setLanguage, that));
        },    

		initData: function () {
			var that = this;
            
        	that.viewModel.set("selectedLanguage", that.getLanguage());
            that._bindToEvents();
		},
        
        getLanguage: function() {
            return localStorage.getItem(this.consts.localStorageKeyLang) || "en";
        },
        
        setLanguage: function(data) {
            localStorage.setItem(this.consts.localStorageKeyLang, data.lang);
        }
	});
    
	app.settingsService = new SettingsService();
})(window);