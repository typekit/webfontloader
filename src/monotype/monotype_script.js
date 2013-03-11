goog.provide('webfont.MonotypeScript');

goog.require('webfont.FontFamily');
goog.require('webfont.FontVariationDescription');

/**
webfont.load({
monotype: {
projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'//this is your Fonts.com Web fonts projectId
}
});
*/

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.MonotypeScript = function (userAgent, domHelper, configuration) {
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
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

goog.scope(function () {
  var MonotypeScript = webfont.MonotypeScript,
      FontFamily = webfont.FontFamily,
      FontVariationDescription = webfont.FontVariationDescription;

  MonotypeScript.prototype.supportUserAgent = function (userAgent, support) {
    var self = this;
    var projectId = self.configuration_['projectId'];
    var version = self.configuration_['version'];
    if (projectId) {
      var sc = self.domHelper_.createElement("script");
      sc["id"] = MonotypeScript.SCRIPTID + projectId;

      var loadWindow = this.domHelper_.getLoadWindow();

      function onload() {
        if (loadWindow[MonotypeScript.HOOK + projectId]) {
          var mti_fnts = loadWindow[webfont.MonotypeScript.HOOK + projectId]();
          if (mti_fnts) {
            for (var i = 0; i < mti_fnts.length; i++) {
              self.fontFamilies_.push(new FontFamily(mti_fnts[i]["fontfamily"]));
            }
          }
        }
        support(userAgent.getBrowserInfo().hasWebFontSupport());
      }

      var done = false;

      sc["onload"] = sc["onreadystatechange"] = function () {
        if (!done && (!this["readyState"] || this["readyState"] === "loaded" || this["readyState"] === "complete")) {
          done = true;
          onload();
          sc["onload"] = sc["onreadystatechange"] = null;
        }
      };

      sc["src"] = self.getScriptSrc(projectId, version);
      this.domHelper_.insertInto('head', sc);
    }
    else {
      support(true);
    }
  };

  MonotypeScript.prototype.getScriptSrc = function (projectId, version) {
    var p = this.domHelper_.getProtocol();
    var api = (this.configuration_['api'] || 'fast.fonts.com/jsapi').replace(/^.*http(s?):(\/\/)?/, "");
    return p + "//" + api + '/' + projectId + '.js' + ( version ? '?v='+ version : '' );
  };

  MonotypeScript.prototype.load = function (onReady) {
    onReady(this.fontFamilies_);
  };
});

globalNamespaceObject.addModule(webfont.MonotypeScript.NAME, function (configuration, domHelper) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  return new webfont.MonotypeScript(userAgent, domHelper, configuration);
});
