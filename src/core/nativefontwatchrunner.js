goog.provide('webfont.NativeFontWatchRunner');

goog.require('webfont.Font');

goog.scope(function () {
  /**
  * @constructor
  * @param {function(webfont.Font)} activeCallback
  * @param {function(webfont.Font)} inactiveCallback
  * @param {webfont.DomHelper} domHelper
  * @param {webfont.Font} font
  * @param {webfont.BrowserInfo} browserInfo
  * @param {number=} opt_timeout
  * @param {Object.<string, boolean>=} opt_metricCompatibleFonts
  * @param {string=} opt_fontTestString
  */
  webfont.NativeFontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
      font, browserInfo, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString) {
    this.activeCallback_ = activeCallback;
    this.inactiveCallback_ = inactiveCallback;
    this.font_ = font;
    this.domHelper_ = domHelper;
    this.fontTestString_ = opt_fontTestString || null;
  };

  var NativeFontWatchRunner = webfont.NativeFontWatchRunner;

  NativeFontWatchRunner.prototype.start = function () {
    var doc = this.domHelper_.getLoadWindow();

    if (doc['fonts']['check'](this.font_.toCssString(), this.fontTestString_)) {
      this.activeCallback_(this.font_);
    } else {
      doc['fonts']['load'](this.font_.toCssString(), this.fontTestString_).then(
        goog.bind(this.activeCallback_, this, this.font_),
        goog.bind(this.inactiveCallback_, this, this.font_));
    }
  };
});
