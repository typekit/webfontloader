/**
 * @constructor
 * @param {function(string, string)} activeCallback
 * @param {function(string, string)} inactiveCallback
 * @param {webfont.DomHelper} domHelper
 * @param {Object.<string, function(Object): {width: number, height: number}>} fontSizer
 * @param {function(function(), number=)} asyncCall
 * @param {function(): number} getTime
 * @param {string} fontFamily
 * @param {string} fontDescription
 * @param {boolean} hasWebkitFallbackBug
 * @param {string=} opt_fontTestString
 */
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
    fontSizer, asyncCall, getTime, fontFamily, fontDescription, hasWebkitFallbackBug, opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.domHelper_ = domHelper;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.fontFamily_ = fontFamily;
  this.fontDescription_ = fontDescription;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
  this.hasWebkitFallbackBug_ = hasWebkitFallbackBug;
  this.lastObservedSizeA_ = this.getDefaultFontSize_(
      webfont.FontWatchRunner.DEFAULT_FONTS_A);
  this.lastObservedSizeB_ = this.getDefaultFontSize_(
      webfont.FontWatchRunner.DEFAULT_FONTS_B);
  this.sizeChangeCount_ = 0;
  this.requestedFontA_ = new webfont.FontRuler(this.domHelper_, this.fontSizer_,
      this.fontFamily_ + ',' + webfont.FontWatchRunner.DEFAULT_FONTS_A,
      this.fontDescription_, this.fontTestString_);
  this.requestedFontB_ = new webfont.FontRuler(this.domHelper_, this.fontSizer_,
      this.fontFamily_ + ',' + webfont.FontWatchRunner.DEFAULT_FONTS_B,
      this.fontDescription_, this.fontTestString_);
};

/**
 * A set of sans-serif fonts and a generic family that cover most platforms:
 * Windows - arial - 99.71%
 * Mac - arial - 97.67%
 * Linux - 97.67%
 * (Based on http://www.codestyle.org/css/font-family/sampler-CombinedResults.shtml)
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_FONTS_A = "arial,'URW Gothic L',sans-serif";

/**
 * A set of serif fonts and a generic family that cover most platforms. We
 * want each of these fonts to have a different width when rendering the test
 * string than each of the fonts in DEFAULT_FONTS_A:
 * Windows - Georgia - 98.98%
 * Mac - Georgia - 95.60%
 * Linux - Century Schoolbook L - 97.97%
 * (Based on http://www.codestyle.org/css/font-family/sampler-CombinedResults.shtml)
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_FONTS_B = "Georgia,'Century Schoolbook L',serif";

/**
 * Default test string. Characters are chosen so that their widths vary a lot
 * between the fonts in the default stacks. We want each fallback stack
 * to always start out at a different width than the other.
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_TEST_STRING = 'BESbswy';

webfont.FontWatchRunner.prototype.start = function() {
  this.started_ = this.getTime_();
  this.check_();
};

/**
 * Checks the size of the two spans against their original sizes during each
 * async loop. If the size of one of the spans is different than the original
 * size, then we know that the font is rendering and finish with the active
 * callback. If we wait more than 5 seconds and nothing has changed, we finish
 * with the inactive callback.
 *
 * @private
 */
webfont.FontWatchRunner.prototype.check_ = function() {
  var sizeA = this.requestedFontA_.getSize();
  var sizeB = this.requestedFontB_.getSize();

  if (this.lastObservedSizeA_.width != sizeA.width || this.lastObservedSizeB_.width != sizeB.width ||
      this.lastObservedSizeA_.height != sizeB.height || this.lastObservedSizeB_.height != sizeB.height) {
    if ((this.hasWebkitFallbackBug_ && this.sizeChangeCount_ === 1) ||
        (!this.hasWebkitFallbackBug_ && this.sizeChangeCount_ === 0)) {
      this.finish_(this.activeCallback_);
    } else {
      this.lastObservedSizeA_ = sizeA;
      this.lastObservedSizeB_ = sizeB;
      this.sizeChangeCount_ += 1;
      this.asyncCheck_();
    }
  } else if (this.getTime_() - this.started_ >= 5000) {
    if (this.hasWebkitFallbackBug_ && this.sizeChangeCount_ === 1) {
      // If we reach the timeout and we are in a Webkit browser with the
      // fallback and we observed at least one size change, hope for the
      // best and assume that the font has loaded and has identical font
      // metrics compared to the browser's last resort font.
      this.finish_(this.activeCallback_);
    } else {
      this.finish_(this.inactiveCallback_);
    }
  } else {
    this.asyncCheck_();
  }
};

/**
 * @private
 */
webfont.FontWatchRunner.prototype.asyncCheck_ = function() {
  this.asyncCall_(function(context, func) {
    return function() {
      func.call(context);
    }
  }(this, this.check_), 25);
};

/**
 * @private
 * @param {function(string, string)} callback
 */
webfont.FontWatchRunner.prototype.finish_ = function(callback) {
  this.requestedFontA_.remove();
  this.requestedFontB_.remove();
  callback(this.fontFamily_, this.fontDescription_);
};

/**
 * @private
 * @param {string} defaultFonts
 * @return {{width: number, height: number}}
 */
webfont.FontWatchRunner.prototype.getDefaultFontSize_ = function(defaultFonts) {
  var defaultFont = new webfont.FontRuler(this.domHelper_, this.fontSizer_, defaultFonts, this.fontDescription_, this.fontTestString_);
  var size = defaultFont.getSize();
  defaultFont.remove();
  return size;
};
