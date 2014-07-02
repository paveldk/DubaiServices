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
            main: "scripts/modules/main/main.html",
        }
    };
})(window);