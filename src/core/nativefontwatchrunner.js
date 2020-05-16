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

    var start = goog.now();

    var loader = new Promise(function (resolve, reject) {
      var check = function () {
        var now = goog.now();

        if (now - start >= that.timeout_) {
          reject();
        } else {
          doc.fonts.load(that.font_.toCssString(), that.fontTestString_).then(function (fonts) {
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
