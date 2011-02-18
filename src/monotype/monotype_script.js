/**
webfont.load({
monotype: {
projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'//this is your Fonts.com Web fonts projectId
}
});
*/

/**
 * @constructor
 */
webfont.MonotypeScript = function (global, userAgent, domHelper, doc, configuration) {
  this.global_ = global;
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.doc_ = doc;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
  this.fontVariations_ = {};
};

/**
 * name of the module through which external API is supposed to call the MonotypeFontAPI.
 * @const
 */
webfont.MonotypeScript.NAME = 'monotype';

/**
 * __mti_fntLst is the name of function that exposes Monotype's font list.
 * @const
 */
webfont.MonotypeScript.HOOK = '__mti_fntLst';

/**
 * __MonotypeAPIScript__ is the id of script added by google API. Currently 'webfonts.fonts.com' supports only one script in a page. 
 * This may require change in future if 'webfonts.fonts.com' begins supporting multiple scripts per page.
 * @const
 */
webfont.MonotypeScript.SCRIPTID = '__MonotypeAPIScript__';

webfont.MonotypeScript.prototype.supportUserAgent = function (userAgent, support) {
  var self = this;
  var projectId = self.configuration_['projectId'];
  if (projectId) {
    var sc = self.domHelper_.createScriptSrc(self.getScriptSrc(projectId));
    sc["id"] = webfont.MonotypeScript.SCRIPTID + projectId;

    sc["onreadystatechange"] = function (e) {
      if (sc["readyState"] === "loaded" || sc["readyState"] === "complete") {
        sc["onreadystatechange"] = null;
        sc["onload"](e);
      }
    };

    sc["onload"] = function (e) {
      if (self.global_[webfont.MonotypeScript.HOOK + projectId]) {
        var mti_fnts = self.global_[webfont.MonotypeScript.HOOK + projectId]();
        if (mti_fnts && mti_fnts.length) {
          var i;
          for (i = 0; i < mti_fnts.length; i++) {
            self.fontFamilies_.push(mti_fnts[i]["fontfamily"]);
          }
        }
      }
      support(userAgent.isSupportingWebFont());
    };

    this.domHelper_.insertInto('head', sc);
  }
  else {
    support(true);
  }
};

webfont.MonotypeScript.prototype.getScriptSrc = function (projectId) {
  var p = this.protocol();
  var api = (this.configuration_['api'] || 'fast.fonts.com/jsapi').replace(/^.*http(s?):(\/\/)?/, "");
  return p + "//" + api + '/' + projectId + '.js';
};

webfont.MonotypeScript.prototype.load = function (onReady) {
  onReady(this.fontFamilies_, this.fontVariations_);
};

webfont.MonotypeScript.prototype.protocol = function () {
  var supportedProtocols = ["http:", "https:"];
  var defaultProtocol = supportedProtocols[0];
  if (this.doc_ && this.doc_.location && this.doc_.location.protocol) {
    var i = 0;
    for (i = 0; i < supportedProtocols.length; i++) {
      if (this.doc_.location.protocol === supportedProtocols[i]) {
        return this.doc_.location.protocol;
      }
    }
  }

  return defaultProtocol;
};

window['WebFont'].addModule(webfont.MonotypeScript.NAME, function (configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  return new webfont.MonotypeScript(window, userAgent, domHelper, document, configuration);
});
