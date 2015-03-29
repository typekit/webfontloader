goog.provide('webfont.FontWatchRunner');

goog.require('webfont.Font');
goog.require('webfont.FontRuler');

/**
 * @constructor
 * @param {function(webfont.Font)} activeCallback
 * @param {function(webfont.Font)} inactiveCallback
 * @param {webfont.DomHelper} domHelper
 * @param {webfont.Font} font
 * @param {number=} opt_timeout
 * @param {Object.<string, boolean>=} opt_metricCompatibleFonts
 * @param {string=} opt_fontTestString
 */
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
    font, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.domHelper_ = domHelper;
  this.font_ = font;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
  this.timeout_ = opt_timeout || 3000;

  this.metricCompatibleFonts_ = opt_metricCompatibleFonts || null;

  this.fontRulerA_ = null;
  this.fontRulerB_ = null;

  this.widthA_ = -1;
  this.widthB_ = -1;
};

/**
 * Default test string. Characters are chosen so that their widths vary a lot
 * between the fonts in the default stacks. We want each fallback stack
 * to always start out at a different width than the other.
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_TEST_STRING = 'BESbswy';

goog.scope(function () {
  var FontWatchRunner = webfont.FontWatchRunner,
      Font = webfont.Font,
      FontRuler = webfont.FontRuler;

  FontWatchRunner.prototype.start = function() {
    this.fontRulerA_ = new FontRuler(this.domHelper_, this.fontTestString_);
    this.fontRulerB_ = new FontRuler(this.domHelper_, this.fontTestString_);

    this.started_ = goog.now();

    this.fontRulerA_.setFont(new Font(this.font_.getName() + ',serif', this.font_.getVariation()));
    this.fontRulerB_.setFont(new Font(this.font_.getName() + ',sans-serif', this.font_.getVariation()));

    this.fontRulerA_.insert();
    this.fontRulerB_.insert();

    this.widthA_ = this.fontRulerA_.getWidth();
    this.widthB_ = this.fontRulerB_.getWidth();

    this.check_();
  };

  /**
   * @private
   * Returns true if the loading has timed out.
   * @return {boolean}
   */
  FontWatchRunner.prototype.hasTimedOut_ = function() {
    return goog.now() - this.started_ >= this.timeout_;
  };

  /**
   * Returns true if the current font is metric compatible. Also returns true
   * if we do not have a list of metric compatible fonts.
   *
   * @private
   * @return {boolean}
   */
  FontWatchRunner.prototype.isMetricCompatibleFont_ = function () {
    return this.metricCompatibleFonts_ === null || this.metricCompatibleFonts_.hasOwnProperty(this.font_.getName());
  };

  /**
   * Checks the width of the two spans against their original widths during each
   * async loop. If the width of one of the spans is different than the original
   * width, then we know that the font is rendering and finish with the active
   * callback. If we wait more than 5 seconds and nothing has changed, we finish
   * with the inactive callback.
   *
   * @private
   */
  FontWatchRunner.prototype.check_ = function() {
    var widthA = this.fontRulerA_.getWidth();
    var widthB = this.fontRulerB_.getWidth();

    if (this.hasTimedOut_()) {
      if (this.isMetricCompatibleFont_()) {
        this.finish_(this.activeCallback_);
      } else {
        this.finish_(this.inactiveCallback_);
      }
    } else if (this.widthA_ !== -1 && this.widthB_ !== -1 &&
               this.widthA_ !== widthA && this.widthB_ !== widthB &&
               widthA === widthB) {
      this.finish_(this.activeCallback_);
    } else {
      this.widthA_ = widthA;
      this.widthB_ = widthB;
      this.asyncCheck_();
    }
  };

  /**
   * @private
   */
  FontWatchRunner.prototype.asyncCheck_ = function() {
    setTimeout(goog.bind(function () {
      this.check_();
    }, this), 50);
  };

  /**
   * @private
   * @param {function(webfont.Font)} callback
   */
  FontWatchRunner.prototype.finish_ = function(callback) {
    this.fontRulerA_.remove();
    this.fontRulerB_.remove();
    callback(this.font_);
  };
});
