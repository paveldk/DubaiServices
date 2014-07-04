(function (global) {
	var LocationService,
        LocationViewModel,
        CenterIcon,
        app = global.app = global.app || {};

     CenterIcon = L.Icon.extend({
        options: {
            iconSize: [23, 34],
    		iconAnchor:   [22, 94]
        }
    });
    
    LocationViewModel = kendo.data.ObservableObject.extend({
        viewId: "#location-view",
        header_en: "Customer Centers",
        header_ar: "مراكز العملاء",
        header: "",
        $view: null,
        
		init: function () {
			var that = this;
            
			kendo.data.ObservableObject.fn.init.apply(that, that);
		}
	});
    
	LocationService = kendo.Class.extend({
        locationData: null,
        lat: 0,
        long: 0,
        
		init: function () {
			var that = this;

            that.class1 = new CenterIcon({iconUrl: 'styles/images/map-pin-class-1.png', iconRetinaUrl: 'styles/images/map-pin-class-1@2x.png'});
            
            that.viewModel = new LocationViewModel();
            
            that.locationData = [];
			that.showModule = $.proxy(that.initData, that);
		},
        
        initData: function () {
            var that = this,
            	q = new Everlive.Query(),
        		language = app.settingsService.getLanguage();        
        
            app.common.showLoading();
            
            that.viewModel.$view = $(that.viewModel.viewId);
            that.viewModel.$view.removeClass("en ar").addClass(language);
            that.viewModel.set("header", that["header_" + language]);
            
            q.select("Location", "Type", "Id");
        
            return app.everlive.data("CustomerCenter").get(q)
                .then($.proxy(that.storeLocationData, that))
                .then($.proxy(that.getCurrentLocation, that))
                .then($.proxy(that.updateMarkers, that));
        },
        
        storeLocationData: function (data) {
            var currentItem;
            
            for (var i = 0; i < data.result.length; i++) {
                currentItem = data.result[i];
                this.locationData.push([currentItem.Location.latitude, currentItem.Location.longitude, currentItem.OzonePercent]);
            }
        },
        
        getCurrentLocation: function () {
            var that = this;
            
            return new RSVP.Promise(function (resolve, reject) {
                that.lat = 25.199075;
                that.long = 55.273060;
                resolve(); 
            });            
        },
        
        getMarkerClass: function (ozonePercent) {
            var that = this;
            
            if(ozonePercent > 75){
                return that.class6;
            } else if(ozonePercent > 50 && ozonePercent <= 75 ) {
                return that.class5;
            } else if(ozonePercent > 25 && ozonePercent <= 50 ) {
                return that.class4;
            } else if(ozonePercent > 6 && ozonePercent <= 25 ) {
                return that.class3;
            } else if(ozonePercent > 0 && ozonePercent <= 6 ) {
                return that.class2;
            } else {
                return that.class1;
            }            
        },

		updateMarkers: function () {
			var that = this,
                tiles,
                map,
                marker,
                currentLocationItem,
                latlng = L.latLng(that.lat, that.long),
                markers = new L.MarkerClusterGroup();

            tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: ""
			});

			map = L.map("map", {center: latlng, zoom: 13, layers: [tiles]});
            
            for (var i = 0; i < that.locationData.length; i++) {
                currentLocationItem =  that.locationData[i];
                
                marker = L.marker(
                    new L.LatLng(
                        currentLocationItem[0], 
                        currentLocationItem[1]), { 
                        title: currentLocationItem[2], 
                        icon: that.class1
                    });
                
                markers.addLayer(marker);
            }
            
			map.addLayer(markers);
            
            app.common.hideLoading();
		}
	});

	app.locationService = new LocationService();
})(window);