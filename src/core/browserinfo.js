/**
 * @constructor
 * @param {boolean} webfontSupport
 * @param {boolean} webkitFallbackBug
 * @param {boolean} androidFallbackBug
 */
webfont.BrowserInfo = function (webfontSupport, webkitFallbackBug, androidFallbackBug) {
  this.webfontSupport_ = webfontSupport;
  this.webkitFallbackBug_ = webkitFallbackBug;
  this.androidFallbackBug_ = androidFallbackBug;
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
webfont.BrowserInfo.prototype.hasWebkitFallbackBug = function () {
  return this.webkitFallbackBug_;
};

/**
 * @return {boolean}
 */
webfont.BrowserInfo.prototype.hasAndroidFallbackBug = function () {
  return this.androidFallbackBug_;
};
