goog.provide('webfont');

goog.require('webfont.UserAgentParser');
goog.require('webfont.FontModuleLoader');
goog.require('webfont.WebFont');

/**
 * @param {Object} context
 * @param {function(...)} func
 * @param {...*} opt_args
 */
webfont.bind = function(context, func, opt_args) {
  var args = arguments.length > 2 ?
      Array.prototype.slice.call(arguments, 2) : [];

  return function() {
    args.push.apply(args, arguments);
    return func.apply(context, args);
  };
};

webfont.extendsClass = function(baseClass, subClass) {

  // Avoid polluting the baseClass prototype object with methods from the
  // subClass
  /** @constructor */
  function baseExtendClass() {};
  baseExtendClass.prototype = baseClass.prototype;
  subClass.prototype = new baseExtendClass();

  subClass.prototype.constructor = subClass;
  subClass.superCtor_ = baseClass;
  subClass.super_ = baseClass.prototype;
};

// Name of the global object.
var globalName = 'WebFont';

// Provide an instance of WebFont in the global namespace.
var globalNamespaceObject = window[globalName] = (function() {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var fontModuleLoader = new webfont.FontModuleLoader();
  var asyncCall = function(func, timeout) { setTimeout(func, timeout); };

  return new webfont.WebFont(window, fontModuleLoader, asyncCall, userAgent);
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
webfont.UserAgent.prototype['getBrowserInfo'] = webfont.UserAgent.prototype.getBrowserInfo;
webfont.BrowserInfo.prototype['hasWebFontSupport'] = webfont.BrowserInfo.prototype.hasWebFontSupport;
webfont.BrowserInfo.prototype['hasWebKitFallbackBug'] = webfont.BrowserInfo.prototype.hasWebKitFallbackBug;
