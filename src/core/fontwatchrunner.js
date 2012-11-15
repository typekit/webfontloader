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

  this.lastObservedSizeA_ = null;
  this.lastObservedSizeB_ = null;

  this.fontRulerA_ = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);
  this.fontRulerA_.insert();
  this.fontRulerA_.setFont(webfont.FontWatchRunner.DEFAULT_FONTS_A, this.fontDescription_);
  this.originalSizeA_ = this.fontRulerA_.getSize();
  this.fontRulerA_.setFont(this.fontFamily_ + ',' + webfont.FontWatchRunner.DEFAULT_FONTS_A, this.fontDescription_);

  this.fontRulerB_ = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);
  this.fontRulerB_.insert();
  this.fontRulerB_.setFont(webfont.FontWatchRunner.DEFAULT_FONTS_B, this.fontDescription_);
  this.originalSizeB_ = this.fontRulerB_.getSize();
  this.fontRulerB_.setFont(this.fontFamily_ + ',' + webfont.FontWatchRunner.DEFAULT_FONTS_B, this.fontDescription_);
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
 * @private
 * Returns true if two metrics are the same.
 * @param {?{width: number, height: number}} a
 * @param {?{width: number, height: number}} b
 * @return {boolean}
 */
webfont.FontWatchRunner.prototype.sizeEquals_ = function(a, b) {
  return !!a && !!b && a.width === b.width && a.height === b.height;
};

/**
 * @private
 * Returns true if the loading has timed out.
 * @return {boolean}
 */
webfont.FontWatchRunner.prototype.hasTimedOut_ = function() {
  return this.getTime_() - this.started_ >= 5000;
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
  var sizeA = this.fontRulerA_.getSize();
  var sizeB = this.fontRulerB_.getSize();

  if (this.hasWebkitFallbackBug_) {
    // Check if we have seen the first change in size
    if (!this.lastObservedSizeA_ && !this.lastObservedSizeB_) {
      if (this.hasTimedOut_()) {
        // We didn't observe any size changes and the timeout occurred, so fire `inactive`
        this.finish_(this.inactiveCallback_);
      } else if (this.sizeEquals_(sizeA, this.originalSizeA_) && this.sizeEquals_(sizeB, this.originalSizeB_)) {
        this.asyncCheck_(); // Nothing, so let's wait.
      } else {
        // First size change. Record the size and wait for the next one.
        this.lastObservedSizeA_ = sizeA;
        this.lastObservedSizeB_ = sizeB;
        this.asyncCheck_();
      }
    } else {
      if (this.hasTimedOut_()) {
        if (this.sizeEquals_(sizeA, this.lastObservedSizeA_) && this.sizeEquals_(sizeB, this.lastObservedSizeB_)) {
          this.finish_(this.activeCallback_);
        } else {
          this.finish_(this.inactiveCallback_);
        }
      } else if (this.sizeEquals_(sizeA, this.lastObservedSizeA_) && this.sizeEquals_(sizeB, this.lastObservedSizeB_)) {
        this.asyncCheck_();
      } else {
        if (this.sizeEquals_(sizeA, this.originalSizeA_) && this.sizeEquals_(sizeB, this.originalSizeB_)) {
          this.finish_(this.inactiveCallback_);
        } else {
          this.finish_(this.activeCallback_);
        }
      }
    }
  } else {
    if (this.hasTimedOut_()) {
      this.finish_(this.inactiveCallback_);
    } else if (this.sizeEquals_(sizeA, this.originalSizeA_) && this.sizeEquals_(sizeB, this.originalSizeB_)) {
      this.asyncCheck_();
    } else {
      this.finish_(this.activeCallback_);
    }
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
  this.fontRulerA_.remove();
  this.fontRulerB_.remove();
  callback(this.fontFamily_, this.fontDescription_);
};
