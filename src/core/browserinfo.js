goog.provide('webfont.BrowserInfo');

/**
 * @export
 * @constructor
 * @param {boolean} webfontSupport
 * @param {boolean} webKitFallbackBug
 * @param {boolean} webKitMetricsBug
 */
webfont.BrowserInfo = function (webfontSupport, webKitFallbackBug, webKitMetricsBug, hasNativeFontLoading) {
  this.webfontSupport_ = webfontSupport;
  this.webKitFallbackBug_ = webKitFallbackBug;
  this.webKitMetricsBug_ = webKitMetricsBug;
  this.hasNativeFontLoading_ = hasNativeFontLoading;
};

goog.scope(function () {
  var BrowserInfo = webfont.BrowserInfo;

  /**
   * @export
   * Returns true if the browser supports web fonts.
   *
   * @return {boolean}
   */
  BrowserInfo.prototype.hasWebFontSupport = function () {
    return this.webfontSupport_;
  };

  /**
   * @export
   *
   * Returns true if the browser has the WebKit fallback bug.
   *
   * The bug causes the normal CSS font stack to be ignored while
   * loading web fonts. Instead it picks the generic font family
   * (or the default generic font family) of the first instance
   * the web font is mentioned in CSS. It switches to this font
   * immediately while loading web font, causing two changes in
   * font to occur (compared to other browsers which only change
   * font once the web font has loaded.)
   *
   * The bug has been fixed and is only happens in WebKit versions
   * below 536.11. Even though it is fixed we still have a large
   * percentage of users on older WebKit versions, mostly on mobile
   * platforms.
   *
   * Also see: https://bugs.webkit.org/show_bug.cgi?id=76684
   *
   * @return {boolean}
   */
  BrowserInfo.prototype.hasWebKitFallbackBug = function () {
    return this.webKitFallbackBug_;
  };

  /**
   * @export
   *
   * Returns true if the browser has the WebKit metrics bug
   *
   * The metrics bug causes WebKit to change the height of a font
   * while loading a web font. Other browsers do not modify
   * the width or height of the fallback font while a web font is
   * loading. This caused our width and height check to be incorrect,
   * triggering a false positive.
   *
   * Also see: https://bugs.webkit.org/show_bug.cgi?id=110977
   *
   * @return {boolean}
   */
  BrowserInfo.prototype.hasWebKitMetricsBug = function () {
    return this.webKitMetricsBug_;
  };

  /**
   * @export
   *
   * Returns true if this browser has native font loading as
   * specified in: http://dev.w3.org/csswg/css-font-loading/
   */
  BrowserInfo.prototype.hasNativeFontLoading = function () {
    return this.hasNativeFontLoading_;
  };
});
