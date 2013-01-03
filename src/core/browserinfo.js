/**
 * @constructor
 * @param {boolean} webfontSupport
 * @param {boolean} webKitFallbackBug
 */
webfont.BrowserInfo = function (webfontSupport, webKitFallbackBug) {
  this.webfontSupport_ = webfontSupport;
  this.webKitFallbackBug_ = webKitFallbackBug;
};

/**
 * @return {boolean}
 */
webfont.BrowserInfo.prototype.hasWebFontSupport = function () {
  return this.webfontSupport_;
};

/**
 * @return {boolean}
 */
webfont.BrowserInfo.prototype.hasWebKitFallbackBug = function () {
  return this.webKitFallbackBug_;
};
