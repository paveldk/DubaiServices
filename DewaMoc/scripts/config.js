(function (global) {
    var app = global.app = global.app || {};
    
    app.consts = {
    };
    
    app.config = {
        everlive: {
            apiKey: "s1l5TfxjScAdG5aH",
            scheme: "http"
        },
        views: {
            init: "#init-view",
            signIn: "scripts/modules/login/signin.html",
            signUp: "scripts/modules/login/signup.html",
            dashboard: "scripts/modules/dashboard/dashboard.html",
            main: "scripts/modules/dashboard/dashboard.html",
            settings: "scripts/modules/settings/settings.html"
        }
    };
})(window);