goog.provide('webfont.NativeFontWatchRunner');

goog.require('webfont.Font');

goog.scope(function () {
  /**
  * @constructor
  * @param {function(webfont.Font)} activeCallback
  * @param {function(webfont.Font)} inactiveCallback
  * @param {webfont.DomHelper} domHelper
  * @param {webfont.Font} font
  * @param {string=} opt_fontTestString
  */
  webfont.NativeFontWatchRunner = function(activeCallback, inactiveCallback, domHelper, font, opt_fontTestString) {
    this.activeCallback_ = activeCallback;
    this.inactiveCallback_ = inactiveCallback;
    this.font_ = font;
    this.domHelper_ = domHelper;
    this.fontTestString_ = opt_fontTestString || null;
  };

  var NativeFontWatchRunner = webfont.NativeFontWatchRunner;

  NativeFontWatchRunner.prototype.start = function () {
    var doc = this.domHelper_.getLoadWindow().document,
        that = this;

    doc['fonts']['load'](this.font_.toCssString(), this.fontTestString_)['then'](
      function () { that.activeCallback_(that.font_); },
      function () { that.inactiveCallback_(that.font_); }
    );
  };
});
