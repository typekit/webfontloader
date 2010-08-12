/**
webfont.load({
  monotype: {
    projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'//this is your Fonts.com Web fonts projectId
  }
});
*/

//class MonotypeFontApi
//constructor()
webfont.MonotypeFontApi = function (global, userAgent, domHelper, docHelper, configuration) {
  this.global_ = global;
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.docHelper_ = docHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
  this.fontVariations_ = {};
};
//end constructor

///Region Static Properties

//name of the module through which external API is supposed to call the MonotypeFontAPI.
webfont.MonotypeFontApi.NAME = 'monotype';

//__mti_fntLst is the name of function that exposes Monotype's font list.
webfont.MonotypeFontApi.HOOK = '__mti_fntLst';

//__MonotypeAPIScript__ is the id of script added by google API. Currently 'webfonts.fonts.com' supports only one script in a page. 
//This may require change in future if 'webfonts.fonts.com' begins supporting multiple scripts per page.
webfont.MonotypeFontApi.SCRIPTID = '__MonotypeAPIScript__';
//end static property

//method supportUserAgent()
webfont.MonotypeFontApi.prototype.supportUserAgent = function (userAgent, support) {
  var self = this;
  var projectId = self.configuration_['projectId'];
  if (projectId) {
    //The monotype API script is now changed to allow 'domHelper.createScriptSrc'; Previously only document.write could be used.
    var sc = self.domHelper_.createScriptSrc(self.getScriptSrc(projectId));
    sc["id"] = webfont.MonotypeFontApi.SCRIPTID + projectId;
    sc["onreadystatechange"] = function (e) {
      if (sc["readyState"] === "loaded" || sc["readyState"] === "complete") {
        // Avoid memory leaks (and duplicate call to callback) in IE
        sc["onreadystatechange"] = null;
        sc["onload"](e);
      }
    };

    sc["onload"] = function (e) {
      if (self.global_[webfont.MonotypeFontApi.HOOK + projectId]) {
        var mti_fnts = self.global_[webfont.MonotypeFontApi.HOOK + projectId]();
        if (mti_fnts && mti_fnts.length) {
          for (var i = 0; i < mti_fnts.length; i++) {
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

///end Region

//method getScriptSrc()
webfont.MonotypeFontApi.prototype.getScriptSrc = function (projectId) {
  var p = this.docHelper_.protocol();
  var api = this.configuration_['api'] || p + '//fast.fonts.com/jsapi';
  return api + '/' + projectId + '.js';
};
//end method

//method load()
webfont.MonotypeFontApi.prototype.load = function (onReady) {
  onReady(this.fontFamilies_, this.fontVariations_);
};
//end method
//end class

//This class helps mocking, the document object instead of using real document object.
//class MonotypeDocumentHelper
//constructor()
webfont.MonotypeDocumentHelper = function (doc) {
  this.doc_ = doc;
}
//end constructor

//method protocol()
webfont.MonotypeDocumentHelper.prototype.protocol = function () {
  var supportedProtocols = ["http:", "https:"];
  var defaultProtocol = supportedProtocols[0];
  //relying on the short circuit, the expression at RHS should not be evaluated if the expression at LHS is false
  if (this.doc_ && this.doc_.location && this.doc_.location.protocol) {
    var i = 0;
    for (i = 0; i < supportedProtocols.length; i++) {
      if (this.doc_.location.protocol == supportedProtocols[i]) {
        return this.doc_.location.protocol;
      } //end if
    } //end for
  } //end if

  //if the current protocol is not in support protocols list return default protocol instead.
  return defaultProtocol;
}
//end method

//end class

//Add monotype FontApi module to google webfonts
WebFont.addModule(webfont.MonotypeFontApi.NAME, function (configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  var monoTypeDocHelper = new webfont.MonotypeDocumentHelper(document);
  return new webfont.MonotypeFontApi(window, userAgent, domHelper, monoTypeDocHelper, configuration);
});