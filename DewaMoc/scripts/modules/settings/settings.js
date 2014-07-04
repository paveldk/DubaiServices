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
        logged: false,
        consts: {
            localStorageKeyLang: "dubaiServicesLanguage",
            localStorageKeyUsername: "dubaiServicesUsername",
            localStorageKeyPassword: "dubaiServicesPassword",
            localStorageKeyId: "dubaiServicesId"
        },
        
		init: function () {
			var that = this;

			that.viewModel = new SettingsViewModel();
			that.initModule = $.proxy(that.initData, that);
		},   

		initData: function () {
			var that = this;
            
        	that.viewModel.set("selectedLanguage", that.getLanguage());
            that._bindToEvents();
		},
        
        _bindToEvents: function() {
            var that = this;
            
			that.viewModel.bind(that.viewModel.events.languageUpdate, $.proxy(that.setLanguage, that));
        }, 
        
        setUserCredentials: function(username, password, id) {
            localStorage.setItem(this.consts.localStorageKeyUsername, username);
            localStorage.setItem(this.consts.localStorageKeyPassword, password);
            localStorage.setItem(this.consts.localStorageKeyId, id);
        },
        
        getLanguage: function() {
            return localStorage.getItem(this.consts.localStorageKeyLang) || "en";
        },
        
        setLanguage: function(data) {
            localStorage.setItem(this.consts.localStorageKeyLang, data.lang);
            
            if(app.settingsService.isLogged()) {
                app.common.navigateToView(app.config.views.dashboard);
            } else {
                app.common.navigateToView(app.config.views.signIn);
            }
        },
        
        isLogged: function() {
        	return localStorage.getItem(this.consts.localStorageKeyUsername) && 
                localStorage.getItem(this.consts.localStorageKeyPassword) &&
                localStorage.getItem(this.consts.localStorageKeyId);  
        },
	});
    
	app.settingsService = new SettingsService();
})(window);