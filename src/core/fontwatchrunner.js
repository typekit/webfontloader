goog.provide('webfont.FontWatchRunner');

goog.require('webfont.FontRuler');

/**
 * @constructor
 * @param {function(string, string)} activeCallback
 * @param {function(string, string)} inactiveCallback
 * @param {webfont.DomHelper} domHelper
 * @param {string} fontFamily
 * @param {string} fontDescription
 * @param {webfont.BrowserInfo} browserInfo
 * @param {number=} opt_timeout
 * @param {Object.<string, boolean>=} opt_metricCompatibleFonts
 * @param {string=} opt_fontTestString
 */
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
    fontFamily, fontDescription, browserInfo, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.domHelper_ = domHelper;
  this.fontFamily_ = fontFamily;
  this.fontDescription_ = fontDescription;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
  this.browserInfo_ = browserInfo;
  this.lastResortWidths_ = {};
  this.timeout_ = opt_timeout || 5000;

  this.metricCompatibleFonts_ = opt_metricCompatibleFonts || null;

  this.fontRulerA_ = null;
  this.fontRulerB_ = null;

  this.setupLastResortWidths_();
};

/**
 * @enum {string}
 * @const
 */
webfont.FontWatchRunner.LastResortFonts = {
  SERIF: 'serif',
  SANS_SERIF: 'sans-serif',
  MONOSPACE: 'monospace'
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
      FontRuler = webfont.FontRuler;

  /**
   * @private
   */
  FontWatchRunner.prototype.setupLastResortWidths_ = function() {
    var fontRuler = new FontRuler(this.domHelper_, this.fontTestString_);

    fontRuler.insert();

    for (var font in FontWatchRunner.LastResortFonts) {
      if (FontWatchRunner.LastResortFonts.hasOwnProperty(font)) {
        fontRuler.setFont(FontWatchRunner.LastResortFonts[font], this.fontDescription_);
        this.lastResortWidths_[FontWatchRunner.LastResortFonts[font]] = fontRuler.getWidth();
      }
    }
    fontRuler.remove();
  };

  FontWatchRunner.prototype.start = function() {
    this.fontRulerA_ = new FontRuler(this.domHelper_, this.fontTestString_);
    this.fontRulerA_.insert();
    this.fontRulerB_ = new FontRuler(this.domHelper_, this.fontTestString_);
    this.fontRulerB_.insert();

    this.started_ = goog.now();

    this.fontRulerA_.setFont(this.fontFamily_ + ',' + FontWatchRunner.LastResortFonts.SERIF, this.fontDescription_);
    this.fontRulerB_.setFont(this.fontFamily_ + ',' + FontWatchRunner.LastResortFonts.SANS_SERIF, this.fontDescription_);

    this.check_();
  };

  /**
   * Returns true if the given width matches the generic font family width.
   *
   * @private
   * @param {number} width
   * @param {string} lastResortFont
   * @return {boolean}
   */
  FontWatchRunner.prototype.widthMatches_ = function(width, lastResortFont) {
    return width === this.lastResortWidths_[lastResortFont];
  };

  /**
   * Return true if the given widths match any of the generic font family
   * widths.
   *
   * @private
   * @param {number} a
   * @param {number} b
   * @return {boolean}
   */
  FontWatchRunner.prototype.widthsMatchLastResortWidths_ = function(a, b) {
    for (var font in FontWatchRunner.LastResortFonts) {
      if (FontWatchRunner.LastResortFonts.hasOwnProperty(font)) {
        if (this.widthMatches_(a, FontWatchRunner.LastResortFonts[font]) &&
            this.widthMatches_(b, FontWatchRunner.LastResortFonts[font])) {
          return true;
        }
      }
    }
    return false;
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
   * Returns true if both fonts match the normal fallback fonts.
   *
   * @private
   * @param {number} a
   * @param {number} b
   * @return {boolean}
   */
  FontWatchRunner.prototype.isFallbackFont_ = function (a, b) {
    return this.widthMatches_(a, FontWatchRunner.LastResortFonts.SERIF) &&
           this.widthMatches_(b, FontWatchRunner.LastResortFonts.SANS_SERIF);
  };

  /**
   * Returns true if the WebKit bug is present and both widths match a last resort font.
   *
   * @private
   * @param {number} a
   * @param {number} b
   * @return {boolean}
   */
  FontWatchRunner.prototype.isLastResortFont_ = function (a, b) {
    return this.browserInfo_.hasWebKitFallbackBug() && this.widthsMatchLastResortWidths_(a, b);
  };

  /**
   * Returns true if the current font is metric compatible. Also returns true
   * if we do not have a list of metric compatible fonts.
   *
   * @private
   * @return {boolean}
   */
  FontWatchRunner.prototype.isMetricCompatibleFont_ = function () {
    return this.metricCompatibleFonts_ === null || this.metricCompatibleFonts_.hasOwnProperty(this.fontFamily_);
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

    if (this.isFallbackFont_(widthA, widthB) || this.isLastResortFont_(widthA, widthB)) {
      if (this.hasTimedOut_()) {
        if (this.isLastResortFont_(widthA, widthB) && this.isMetricCompatibleFont_()) {
          this.finish_(this.activeCallback_);
        } else {
          this.finish_(this.inactiveCallback_);
        }
     } else {
        this.asyncCheck_();
      }
    } else {
      this.finish_(this.activeCallback_);
    }
  };

  /**
   * @private
   */
  FontWatchRunner.prototype.asyncCheck_ = function() {
    setTimeout(goog.bind(function () {
      this.check_();
    }, this), 25);
  };

  /**
   * @private
   * @param {function(string, string)} callback
   */
  FontWatchRunner.prototype.finish_ = function(callback) {
    this.fontRulerA_.remove();
    this.fontRulerB_.remove();
    callback(this.fontFamily_, this.fontDescription_);
  };
});
