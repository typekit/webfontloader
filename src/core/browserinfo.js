/**
 * @constructor
 * @param {boolean} webfontSupport
 * @param {boolean} webKitFallbackBug
 */
webfont.BrowserInfo = function (webfontSupport, webKitFallbackBug, webKitMetricsBug) {
  this.webfontSupport_ = webfontSupport;
  this.webKitFallbackBug_ = webKitFallbackBug;
  this.webKitMetricsBug_ = webKitMetricsBug;
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
webfont.BrowserInfo.prototype.hasWebKitMetricsBug = function () {
  return this.webKitMetricsBug_;
};
