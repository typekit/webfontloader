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

/**
 * Name of the global configuration object
 *
 * @define {string}
 */
var GLOBAL_CONFIG_NAME = 'WebFontConfig';

// Provide an instance of WebFont in the global namespace.
goog.global[GLOBAL_NAME] = (function() {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var fontModuleLoader = new webfont.FontModuleLoader();
  return new webfont.WebFont(window, fontModuleLoader, userAgent);
})();

if (goog.global[GLOBAL_CONFIG_NAME]) {
  goog.global[GLOBAL_NAME]['load'](goog.global[GLOBAL_CONFIG_NAME]);
}

// Export the public API.
window[GLOBAL_NAME]['load'] = goog.global[GLOBAL_NAME].load;
