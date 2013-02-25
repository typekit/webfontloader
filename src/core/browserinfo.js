goog.provide('webfont.BrowserInfo');

/**
 * @export
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
   * @export
   * @return {boolean}
   */
  BrowserInfo.prototype.hasWebFontSupport = function () {
    return this.webfontSupport_;
  };

  /**
   * @export
   * @return {boolean}
   */
  BrowserInfo.prototype.hasWebKitFallbackBug = function () {
    return this.webKitFallbackBug_;
  };
});
