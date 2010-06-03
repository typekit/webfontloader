// Name of the global object.
var globalName = 'WebFont';

// Provide an instance of WebFont in the global namespace.
window[globalName] = (function() {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  var asyncCall = function(func, timeout) { setTimeout(func, timeout); };

  return new webfont.WebFont(domHelper, new webfont.FontModuleLoader(),
      document.documentElement, asyncCall, userAgent);
})();

// Export the public API.
window[globalName]['load'] = window[globalName].load;
window[globalName]['addModule'] = window[globalName].addModule;
