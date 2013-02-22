goog.provide('webfont.BrowserInfo');

/**
 * @constructor
 * @param {boolean} webfontSupport
 * @param {boolean} webKitFallbackBug
 */
webfont.BrowserInfo = function (webfontSupport, webKitFallbackBug) {
  this.webfontSupport_ = webfontSupport;
  this.webKitFallbackBug_ = webKitFallbackBug;
};

goog.scope(function () {
  var BrowserInfo = webfont.BrowserInfo;

  /**
   * @return {boolean}
   */
  BrowserInfo.prototype.hasWebFontSupport = function () {
    return this.webfontSupport_;
  };

  /**
   * @return {boolean}
   */
  BrowserInfo.prototype.hasWebKitFallbackBug = function () {
    return this.webKitFallbackBug_;
  };
});
