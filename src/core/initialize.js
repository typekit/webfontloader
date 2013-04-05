goog.provide('webfont');

goog.require('webfont.UserAgentParser');
goog.require('webfont.FontModuleLoader');
goog.require('webfont.WebFont');

/**
 * @typedef {Object.<string, Array.<string>>}
 */
webfont.FontTestStrings;

// Name of the global object.
var globalName = 'WebFont';

// Provide an instance of WebFont in the global namespace.
var globalNamespaceObject = window[globalName] = (function() {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var fontModuleLoader = new webfont.FontModuleLoader();
  return new webfont.WebFont(window, fontModuleLoader, userAgent);
})();

// Export the public API.
globalNamespaceObject['load'] = globalNamespaceObject.load;
