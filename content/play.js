const PLAY_ID = "playseleniumformatter@oxiras.com";

function initializePlayObserver() {
    playObserver.register();
}

var playObserver = {
    _uninstall : false,
    observe : function(subject, topic, data) {
        if (topic == "em-action-requested") {
            subject.QueryInterface(Components.interfaces.nsIUpdateItem);
            if (subject.id == PLAY_ID) {
                if (data == "item-uninstalled") {
                    this._uninstall = true;
                } else if (data == "item-disabled") {
                    this._uninstall = true;
                } else if (data == "item-cancel-action") {
                    this._uninstall = false;
                }
            }
        } else if (topic == "quit-application-granted") {

            var current_ppf = branch.getCharPref("pluginProvidedFormatters");
            if (typeof current_ppf != "undefined") {
                var split_ppf = current_ppf.split(",");
                for (var ppf = 0; ppf < split_ppf.length; ppf++) {
                    if (split_ppf[ppf].search("chrome://play/content/formats/play-formatter.js") != -1) {
                        branch.setCharPref("pluginProvidedFormatters", current_ppf.replace(split_ppf[ppf], ""));
                    }
                }
            }

            if (this._uninstall) {
                // your uninstall stuff goes here

                // this section removes the extension we added
                var branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.selenium-ide.");
                var current_ppue = branch.getCharPref("pluginProvidedUserExtensions");
                if (typeof current_ppue != "undefined") {
                    // no extensions yet
                    // need one 'if' block like below for each one you added
                    // if (current_ppue.search("chrome://play/content/formatsextensions/extension-random.js") != -1) {
                    //    branch.setCharPref("pluginProvidedUserExtensions", current_ppue.replace("chrome://play/content/extensions/extension-random.js", ""));
                    // }
                }
            }
            this.unregister();
        }
    },
    register : function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        observerService.addObserver(this, "em-action-requested", false);
        observerService.addObserver(this, "quit-application-granted", false);
    },
    unregister : function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        observerService.removeObserver(this, "em-action-requested");
        observerService.removeObserver(this, "quit-application-granted");
    }
}

window.addEventListener("load", initializePlayObserver, false);