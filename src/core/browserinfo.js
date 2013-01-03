/**
 * @constructor
 * @param {boolean} webfontSupport
 * @param {boolean} webKitFallbackBug
 * @param {boolean} androidFontStackBug
 */
webfont.BrowserInfo = function (webfontSupport, webKitFallbackBug, androidFontStackBug) {
  this.webfontSupport_ = webfontSupport;
  this.webKitFallbackBug_ = webKitFallbackBug;
  this.androidFontStackBug_ = androidFontStackBug;
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

/**
 * @return {boolean}
 */
webfont.BrowserInfo.prototype.hasAndroidFontStackBug = function () {
  return this.androidFontStackBug_;
};
