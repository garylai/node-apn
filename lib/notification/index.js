"use strict";
/**
 * Create a notification
 * @constructor
 */
function Notification (payload) {
	this.encoding = "utf8";

	if (payload) {
		this.payload = payload;
		this.compiled = JSON.stringify(payload);
	} else {
		this.payload = {};
		this.compiled = false;
	}

	this.aps = {};
	this.expiry = 0;
	this.priority = 10;

	this.truncateAtWordEnd = false;
}

Notification.prototype = {
	get alert() {
		return this.aps.alert;
	},
	set alert(value) {
		var type = typeof value;
		if (type === "string" || type === "object" || value === undefined) {
			this.aps.alert = value;
		}
	},

	get alertText() {
		if (this.aps.alert) {
			return this.aps.alert.body || this.aps.alert;
		}
		return undefined;
	},
	set alertText(value) {
		if(typeof this.alert !== "object") {
			this.alert = value;
		}
		else {
			this.prepareAlert();
			this.alert.body = value;
		}
	},

	get badge() {
		return this.aps.badge;
	},
	set badge(value) {
		if (typeof value === "number" || value === undefined) {
			this.aps.badge = value;
		}
	},

	get sound() {
		return this.aps.sound;
	},
	set sound(value) {
		if (typeof value === "string" || value === undefined) {
			this.aps.sound = value;
		}
	},

	get contentAvailable() {
		if (this.aps["content-available"] === 1) {
			return true
		}
		return this._contentAvailable;
	},
	set contentAvailable(value) {
		if (value === true) {
			this.aps["content-available"] = 1
		} else {
			this.aps["content-available"] = undefined;
		}
	},

	get mdm() {
		return this._mdm;
	},
	set mdm(value) {
		this._mdm = value;
	},

	get urlArgs() {
		return this.aps["url-args"];
	},
	set urlArgs(value) {
		if(Array.isArray(value) || value === undefined) {
			this.aps["url-args"] = value;
		}
	},

	get category() {
		return this.aps.category;
	},
	set category(value) {
		if(typeof value === "string" || value === undefined) {
			this.aps.category = value;
		}
	}
};

/**
 * Set the expiry value on the payload
 * @param {Number} [expiry] Timestamp when the notification should expire.
 * @since v1.3.5
 */
Notification.prototype.setExpiry = function (expiry) {
	this.expiry = expiry;
	return this;
};

/**
 * Set the priority
 * @param {Number} [priority=10] Priority value for the notification.
 * @since v1.3.9
 */
 Notification.prototype.setPriority = function (priority) {
 	this.priority = priority;
 	return this;
 };

/**
 * Set the "badge" value on the alert object
 * @param {Number} [badge] Badge Value
 * @since v1.3.5
 */
Notification.prototype.setBadge = function (badge) {
	this.badge = badge;
	return this;
};

/**
 * Set the "sound" value on the alert object
 * @param {String} [sound] Sound file name
 * @since v1.3.5
 */
Notification.prototype.setSound = function (sound) {
	this.sound = sound;
	return this;
};

/**
 * Set the alert text for the notification
 * @param {String} alertText The text of the alert message.
 * @see The <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1">Payload Documentation</a>
 * @since v1.2.0
 */
Notification.prototype.setAlertText = function (text) {
	this.alertText = text;
	return this;
};

/**
 * Set the alert title for the notification - used with Safari Push Notifications and iOS Push Notifications displayed on Apple Watch
 * @param {String} alertTitle The title for the alert.
 * @see The <a href="https://developer.apple.com/library/mac/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html#//apple_ref/doc/uid/TP40013225-CH3-SW12">Pushing Notifications</a> in the Notification Programming Guide for Websites
 * @since v1.5.0
 */
Notification.prototype.setAlertTitle = function(alertTitle) {
	this.prepareAlert();
	this.alert.title = alertTitle;
	return this;
};

/**
 * Set the alert title-loc-key for the notification - used with iOS Push Notifications displayed on Apple Watch. Please note: The corresponding localization key must be in your host app's (i.e. iPhone app) Localizable.strings file and not inside your WatchKit extension or WatchKit app.
 * @param {String} titleLocKey The localization key for the alert title.
 * @see The <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1">Payload Documentation</a>
 * @since XXX
 */
Notification.prototype.setTitleLocKey = function(titleLocKey) {
	this.prepareAlert();
	this.alert["title-loc-key"] = titleLocKey;
	return this;
};

/**
 * Set the alert title-loc-args for the notification - used with iOS Push Notifications displayed on Apple Watch
 * @param {String[]} [titleLocArgs] Variable string values to appear in place of the format specifiers in title-loc-key.
 * @see The <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1">Payload Documentation</a>
 * @since XXX
 */
Notification.prototype.setTitleLocArgs = function(titleLocArgs) {
	this.prepareAlert();
	this.alert["title-loc-args"] = titleLocArgs;
	return this;
};

/**
 * Set the alert action label for the notification - used with Safari Push Notifications
 * @param {String} alertLabel The label for the alert action button.
 * @see The <a href="https://developer.apple.com/library/mac/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html#//apple_ref/doc/uid/TP40013225-CH3-SW12">Pushing Notifications</a> in the Notification Programming Guide for Websites
 * @since v1.5.0
 */
Notification.prototype.setAlertAction = function(alertAction) {
	this.prepareAlert();
	this.alert.action = alertAction;
	return this;
};

/**
 * Set the action-loc-key property on the alert object
 * @param {String} [key] If a string is specified, displays an alert with two buttons, whose behavior is described in Table 3-1. However, iOS uses the string as a key to get a localized string in the current localization to use for the right button’s title instead of “View”. If the value is null, the system displays an alert with a single OK button that simply dismisses the alert when tapped.
 * @see The <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1">Payload Documentation</a>
 * @since v1.2.0
 */
Notification.prototype.setActionLocKey = function (key) {
	this.prepareAlert();
	this.alert["action-loc-key"] = key;
	return this;
};

/**
 * Set the loc-key parameter on the alert object
 * @param {String} [key] A key to an alert-message string in a Localizable.strings file for the current localization (which is set by the user’s language preference).
 * @see The <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1">Payload Documentation</a>
 * @since v1.2.0
 */
Notification.prototype.setLocKey = function (key) {
	this.prepareAlert();
	if(!key) {
		delete this.alert["loc-key"];
		return;
	}
	this.alert["loc-key"] = key;
	return this;
};

/**
 * Set the loc-args parameter on the alert object
 * @param {String[]} [args] Variable string values to appear in place of the format specifiers in loc-key.
 * @see The <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1">Payload Documentation</a>
 * @since v1.2.0
 */
Notification.prototype.setLocArgs = function (args) {
	this.prepareAlert();
	if(!args) {
		delete this.alert["loc-args"];
		return;
	}
	this.alert["loc-args"] = args;
	return this;
};

/**
 * Set the launch-image parameter on the alert object
 * @param {String} [image] The filename of an image file in the application bundle; it may include the extension or omit it.
 * @see The <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html#//apple_ref/doc/uid/TP40008194-CH100-SW1">Payload Documentation</a>
 * @since v1.2.0
 */
Notification.prototype.setLaunchImage = function (image) {
	this.prepareAlert();
	if(!image) {
		delete this.alert["launch-image"];
		return;
	}
	this.alert["launch-image"] = image;
	return this;
};

/**
 * Set the 'content-available' flag on the payload
 * @param {Boolean} [contentAvailable] Whether the content-available flag should be set or not.
 * @since v1.3.5
 */
Notification.prototype.setContentAvailable = function (contentAvailable) {
	this.contentAvailable = contentAvailable;
	return this;
};

/**
 * Set the 'mdm' flag on the payload
 * @param {Object} [mdm] The mdm property for the payload.
 * @since v1.3.5
 */
Notification.prototype.setMDM = function (mdm) {
	this.mdm = mdm;
	return this;
};

/**
 * Set the urlArgs for the notification
 * @param {Array} [urlArgs] The url args for the endpoint
 * @see The <a href="https://developer.apple.com/library/prerelease/mac/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html#//apple_ref/doc/uid/TP40013225-CH3-SW12">Web Payload Documentation</a>
 * @since v1.4.1
 */
Notification.prototype.setUrlArgs = function (urlArgs) {
	this.urlArgs = urlArgs;
	return this;
};

/**
 * Set the category for the notification
 * @param {String} [category] The category for the push notification action
 */
Notification.prototype.setCategory = function (category) {
	this.category = category;
	return this;
};

/**
 * If an alert object doesn't already exist create it and transfer any existing message into the .body property
 * @private
 * @since v1.2.0
 */
Notification.prototype.prepareAlert = function () {
	var existingValue = this.alert;
	if(typeof existingValue !== "object") {
		this.alert = {};
		if(typeof existingValue === "string") {
			this.alert.body = existingValue;
		}
	}
};


Notification.prototype.headers = function headers() {
	let headers = {};

	if (this.priority !== 10) {
		headers["apns-priority"] = this.priority;
	}

	if (this.id) {
		headers["apns-id"] = this.id;
	}

	if (this.expiry > 0) {
		headers["apns-expiration"] = this.expiry;
	}

	if (this.topic) {
		headers["apns-topic"] = this.topic;
	}

	return headers;
};

/**
 * Compile a notification down to its JSON format. Compilation is final, changes made to the notification after this method is called will not be reflected in further calls.
 * @returns {String} JSON payload for the notification.
 * @since v1.3.0
 */
Notification.prototype.compile = function () {
	if(!this.compiled) {
		this.compiled = JSON.stringify(this);
	}
	return this.compiled;
};

/**
 * @returns {Number} Byte length of the notification payload
 * @since v1.2.0
 */
Notification.prototype.length = function () {
	return Buffer.byteLength(this.compile(), this.encoding || "utf8");
};

/**
 * If the notification payload is too long to send this method will attempt to trim the alert body text.
 * @returns {Number} The number of characters removed from the body text. If a negative value is returned, the text is too short to be trimmed enough.
 * @since v1.2.0
 */
Notification.prototype.trim = require("./trim");

/**
 * @private
 */
Notification.prototype.apsPayload = function() {
	var aps = this.aps;

	return Object.keys(aps).find( key => aps[key] !== undefined ) ? aps : undefined;
};

Notification.prototype.toJSON = function () {
	if (typeof this.mdm === "string") {
		return { "mdm": this.mdm };
	}
	
	this.payload.aps = this.apsPayload();

	return this.payload;
};

module.exports = Notification;