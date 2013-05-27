goog.provide('webfont.FontModule');

/**
 * @interface
 */
webfont.FontModule = function () {};

goog.scope(function () {
  var FontModule = webfont.FontModule;

  /**
   * @param {webfont.UserAgent} userAgent
   * @param {function(boolean)} support
   */
  FontModule.prototype.supportUserAgent = function (userAgent, support) {};

  /**
   * @param {function(Array.<webfont.Font>,  webfont.FontTestStrings=)} onReady
   */
  FontModule.prototype.load = function (onReady) {};
});

