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
    this.timeout_ = opt_timeout || 5000;
    this.fontTestString_ = opt_fontTestString || null;
  };

  var NativeFontWatchRunner = webfont.NativeFontWatchRunner;

  NativeFontWatchRunner.prototype.start = function () {
    var doc = this.domHelper_.getLoadWindow().document,
        that = this,
        hasTimedOut = false;

    goog.global.setTimeout(function () {
      hasTimedOut = true;
      that.inactiveCallback_(that.font_);
    }, this.timeout_);

    doc['fonts']['load'](this.font_.toCssString(), this.fontTestString_)['then'](
      function () {
        if (!hasTimedOut) {
          that.activeCallback_(that.font_);
        }
      },
      function () {
        if (!hasTimedOut) {
          that.inactiveCallback_(that.font_);
        }
      }
    );
  };
});
