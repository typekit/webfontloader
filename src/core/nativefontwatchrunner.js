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

  NativeFontWatchRunner.prototype.waitForFontToLoad_ = function (font, fontTestString, timeout) {
    var doc = this.domHelper_.getLoadWindow().document,
        start = goog.now();

    return new Promise(function (resolve, reject) {
      var check = function () {
        var now = goog.now();

        if (now - start >= timeout) {
          reject();
        } else {
          doc.fonts.load(font.toCssString(), fontTestString).then(function (fonts) {
            if (fonts.length >= 1) {
              resolve();
            } else {
              setTimeout(check, 25);
            }
          }, function () {
            reject();
          });
        }
      };

      check();
    });
  };

  NativeFontWatchRunner.prototype.start = function () {
    var that = this,
        loader = this.waitForFontToLoad_(this.font_, this.fontTestString_, this.timeout_);

    var timeoutId = null,
      timer = new Promise(function (resolve, reject) {
        timeoutId = setTimeout(reject, that.timeout_);
      });

    Promise.race([timer, loader]).then(function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      that.activeCallback_(that.font_);
    }, function () {
      that.inactiveCallback_(that.font_);
    });
  };
});
