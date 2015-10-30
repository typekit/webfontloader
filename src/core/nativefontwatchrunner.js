goog.provide('webfont.NativeFontWatchRunner');

goog.require('webfont.Font');

goog.scope(function () {
  /**
  * @constructor
  * @param {function(webfont.Font)} activeCallback
  * @param {function(webfont.Font)} inactiveCallback
  * @param {webfont.DomHelper} domHelper
  * @param {webfont.Font} font
  * @param {number=} opt_timeout
  * @param {string=} opt_fontTestString
  */
  webfont.NativeFontWatchRunner = function(activeCallback, inactiveCallback, domHelper, font, opt_timeout, opt_fontTestString) {
    this.activeCallback_ = activeCallback;
    this.inactiveCallback_ = inactiveCallback;
    this.font_ = font;
    this.domHelper_ = domHelper;
    this.timeout_ = opt_timeout || 3000;
    this.fontTestString_ = opt_fontTestString || undefined;
  };

  var NativeFontWatchRunner = webfont.NativeFontWatchRunner;

  NativeFontWatchRunner.prototype.start = function () {
    var doc = this.domHelper_.getLoadWindow().document,
        that = this;

    // We're using Promises here because the font load API
    // uses them, so we can be sure they're available.
    Promise.race([new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(that.font_);
      }, that.timeout_);
    }), doc.fonts.load(this.font_.toCssString(), this.fontTestString_)]).then(function (fonts) {
      if (fonts.length >= 1) {
        if (fonts.length !== 1 && console.warn) {
          console.warn('Font "' + that.font_.toCssString() + '" has duplication.');
        }

        that.activeCallback_(that.font_);
      } else {
        that.inactiveCallback_(that.font_);
      }
    }, function () {
      that.inactiveCallback_(that.font_);
    });
  };
});
