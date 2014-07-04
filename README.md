# Dubai Services Sample App #

## Application Overview ##

The Dubai Services app demonstrates a real-world application implementation that integrates the [Telerik Platform](http://www.telerik.com/platform) AppBuilder and Backend Services modules. 

This app lets you create an account to monitor and keep up with household bills. You can pay your bills directly through the app using a valid PayPal account or locate a customer service center of the service providers. The data is stored in the cloud and is available from any Internet-connected device.

The sample app shows the following features of the Telerik Platform.

* Using the [Telerik AppBuilder]() cloud IDE to develop and build a hybrid mobile app with HTML3, CSS and JavaScript.
* Creating a well-structured JavaScript code base using the "Module" pattern and the Telerik Kendo UI MVVM framework.
* Designing the user interface with multiple UI widgets from the Telerik Kendo UI Core package.
* Creating a login and authentication flow for users in a [Telerik Backend Services](http://www.telerik.com/backend-services) datastore.
* Creating and storing data items in a Telerik Backend Services project.
* Querying and accessing data items from a Telerik Backend Services project.

### Requirements ###

* Active Telerik Platform account.
* Telerik AppBuilder companion app installed on the device. 

### Quick Run on Device ###

Step 1: Install a QR code reader on your device.

Step 2: Install the AppBuilder companion app.

AppBuilder companion app is a test utility for iOS, Android, and Windows Phone 8 devices and is available as a free app in the [App Store](https://itunes.apple.com/bg/app/icenium-ion/id527547398?mt=8) and [Google Play](https://play.google.com/store/apps/details?id=com.telerik.AppBuilder). 

* Download and install the AppBuilder companion app for iOS

Scan the following QR code on the device, open the URL, and install the app from App Store.

![Download AppBuilder companion app from the App Store QR code](/../docs-images/docs-resources/download-appbuilder-companion-app-ios.png "Download AppBuilder companion app iOS")

* Download and install the AppBuilder companion app for Android

Scan the following QR code on the device, open the URL, and install the app from Google Play.

![Download AppBuilder companion app from the App Store QR code](/../docs-images/docs-resources/download-appbuilder-companion-app-android.png "Download AppBuilder companion app Android")

Step 3: Load/Run the sample app.

* On your iOS device, tap and swipe with two fingers to toggle the built-in menu. Use the built-in QR code scanner to scan the following QR code.

* On your Android device, use a QR code scanner to scan the following QR code. Share the decoded URL to the AppBuilder companion app. 


### Run From the Telerik Platform Portal ###

Step 1: Log in your provided Telerik Platform account.

Step 2: Open the workspace.

Step 3: Open the Dubai Services App which is a Telerik AppBuilder project.

Step 4: Locate the toolbar at the top of the workspace and click "Run".

Step 5: Select one of the options from the drop-down menu:

* Select **Build** to build the app in the cloud and scan the generated QR code which will open the app in the respective companion app.
* Select a device to run your app in the device simulator in the browser. You can run multiple instances of the simulator in the browser.
	
You can follow the video from the image below for an overview of the workspace and projects in the Telerik Platform.

<a href="http://screencast.com/t/11ptcpiw" target="_blank"><img src="http://screencast.com/t/KoyH3IbkETc" 
alt="Run the project in Telerik Platform" /></a>

### Implementation Details ###

#### Backend ####

The backend of the app uses the following features and SDKs of Telerik Backend Services:

* **User management** - using the Backend Services built-in user management and authentication.
* **Data store** - storing the data in content types "Bill", "BillHistory", "BillTypes", "CustomerCenter", "Notifications", "Users".
* **Cloud Code** - registering server logic in the Cloud Code for the **Users** content types.
* **Type-level permissions** - setting up the permissions over the content type to suit the business and security strategy of the app.
* **Expanding relation fields** - a feature that allows you to obtain the related items of a parent item.
* **JavaScript SDK** - used as an abstraction over the REST API, ready for use in hybrid and web apps.

#### Client app ####

The client app is built with the AppBuilder In-Browser client with HTML5, CSS and JavaScript. The architecture of the app follows the MVVM pattern and uses the MVVM framework provided by Kendo UI.

The entry point of the app is located in `app.js`. When the PhoneGap `deviceready` event is fired we initialize the `kendo.mobile.Application`, the starting point of the Kendo UI mobile, and the `Everlive` global instance, which is the starting point of the Backend Services SDK:
    
	document.addEventListener("deviceready", function () {
        navigator.splashscreen.hide();
        
        new kendo.mobile.Application(document.body, { statusBarStyle: "black-translucent", skin: "ios7" });     
        
        app.everlive = new Everlive({
            apiKey: app.config.everlive.apiKey,
            scheme: app.config.everlive.scheme
        });
    }, false); 




