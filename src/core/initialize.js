// Name of the global object.
var globalName = 'WebFont';

// Provide an instance of WebFont in the global namespace.
var globalNamespaceObject = window[globalName] = (function() {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document);
  var asyncCall = function(func, timeout) { setTimeout(func, timeout); };

  return new webfont.WebFont(domHelper, new webfont.FontModuleLoader(),
      document.documentElement, asyncCall, userAgent);
})();

// Export the public API.
globalNamespaceObject['load'] = globalNamespaceObject.load;
globalNamespaceObject['addModule'] = globalNamespaceObject.addModule;

// Export the UserAgent API because we pass this object to external modules.
webfont.UserAgent.prototype['getName'] = webfont.UserAgent.prototype.getName;
webfont.UserAgent.prototype['getVersion'] = webfont.UserAgent.prototype.getVersion;
webfont.UserAgent.prototype['getEngine'] = webfont.UserAgent.prototype.getEngine;
webfont.UserAgent.prototype['getEngineVersion'] = webfont.UserAgent.prototype.getEngineVersion;
webfont.UserAgent.prototype['getPlatform'] = webfont.UserAgent.prototype.getPlatform;
webfont.UserAgent.prototype['getPlatformVersion'] = webfont.UserAgent.prototype.getPlatformVersion;
webfont.UserAgent.prototype['getDocumentMode'] = webfont.UserAgent.prototype.getDocumentMode;
webfont.UserAgent.prototype['isSupportingWebFont'] = webfont.UserAgent.prototype.isSupportingWebFont;
