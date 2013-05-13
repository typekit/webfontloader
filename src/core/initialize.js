goog.provide('webfont');

goog.require('webfont.UserAgentParser');
goog.require('webfont.FontModuleLoader');
goog.require('webfont.WebFont');

/**
 * @typedef {Object.<string, Array.<string>>}
 */
webfont.FontTestStrings;

/**
 * Name of the global object
 *
 * @define {string}
 */
var GLOBAL_NAME = 'WebFont';

// Provide an instance of WebFont in the global namespace.
var globalNamespaceObject = window[GLOBAL_NAME] = (function() {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var fontModuleLoader = new webfont.FontModuleLoader();
  return new webfont.WebFont(window, fontModuleLoader, userAgent);
})();

if (window['WebFontConfig']) {
  globalNamespaceObject['load'](window['WebFontConfig']);
}

// Export the public API.
globalNamespaceObject['load'] = globalNamespaceObject.load;
