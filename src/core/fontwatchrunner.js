/**
 * @constructor
 * @param {function(function(), number=)} asyncCall
 * @param {function(): number} getTime
 * @param {Object} strategy
 */
webfont.FontWatchRunner = function(asyncCall, getTime, strategy) {
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.strategy_ = strategy;
  this.strategy_.setUp();
  this.started_ = getTime();
  this.check_();
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
webfont.FontWatchRunner.SANS_STACK = "arial,'URW Gothic L',sans-serif";

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
webfont.FontWatchRunner.SERIF_STACK = "Georgia,'Century Schoolbook L',serif";

/**
 * Default test string. Characters are chosen so that their widths vary a lot
 * between the fonts in the default stacks. We want each fallback stack
 * to always start out at a different width than the other.
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_TEST_STRING = 'BESs';

/**
 * @private
 */
webfont.FontWatchRunner.prototype.check_ = function() {
  if (this.strategy_.isLoaded()) {
    this.finish_(this.strategy_.getActiveCallback());
  } else if (this.getTime_() - this.started_ >= 5000) {
    this.finish_(this.strategy_.getTimeoutCallback());
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
 * @param {function()} callback
 */
webfont.FontWatchRunner.prototype.finish_ = function(callback) {
  this.strategy_.tearDown();
  callback();
};
