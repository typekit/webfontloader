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
 * @param {boolean} hasWebKitFallbackBug
 * @param {string=} opt_fontTestString
 */
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
    fontSizer, asyncCall, getTime, fontFamily, fontDescription, hasWebKitFallbackBug, opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.domHelper_ = domHelper;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.fontFamily_ = fontFamily;
  this.fontDescription_ = fontDescription;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
  this.hasWebKitFallbackBug_ = hasWebKitFallbackBug;
  this.genericFontFamilySizes_ = {};

  this.fontRulerA_ = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);
  this.fontRulerA_.insert();
  this.fontRulerB_ = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);
  this.fontRulerB_.insert();

  this.setupGenericFontFamilySizes_();
};

/**
 * @enum {string}
 * @const
 */
webfont.FontWatchRunner.GenericFontFamily = {
  SERIF: 'serif',
  SANS_SERIF: 'sans-serif',
  MONOSPACE: 'monospace',
  CURSIVE: 'cursive',
  FANTASY: 'fantasy'
};

/**
 * Default test string. Characters are chosen so that their widths vary a lot
 * between the fonts in the default stacks. We want each fallback stack
 * to always start out at a different width than the other.
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_TEST_STRING = 'BESbswy';

/**
 * @private
 */
webfont.FontWatchRunner.prototype.setupGenericFontFamilySizes_ = function() {
  var fontRuler = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);

  fontRuler.insert();

  for (var genericFontFamily in webfont.FontWatchRunner.GenericFontFamily) {
    if (webfont.FontWatchRunner.GenericFontFamily.hasOwnProperty(genericFontFamily)) {
      fontRuler.setFont(webfont.FontWatchRunner.GenericFontFamily[genericFontFamily], this.fontDescription_);
      this.genericFontFamilySizes_[webfont.FontWatchRunner.GenericFontFamily[genericFontFamily]] = fontRuler.getSize();
    }
  }
  fontRuler.remove();
};

webfont.FontWatchRunner.prototype.start = function() {
  this.started_ = this.getTime_();

  this.fontRulerA_.setFont(this.fontFamily_ + ',' + webfont.FontWatchRunner.GenericFontFamily.SERIF, this.fontDescription_);
  this.fontRulerB_.setFont(this.fontFamily_ + ',' + webfont.FontWatchRunner.GenericFontFamily.SANS_SERIF, this.fontDescription_);

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
 * Returns true if the given size matches the generic font family size.
 *
 * @private
 * @param {?{width: number, height: number}} size
 * @param {string} genericFontFamily
 * @return {boolean}
 */
webfont.FontWatchRunner.prototype.sizeMatches_ = function(size, genericFontFamily) {
  return this.sizeEquals_(size, this.genericFontFamilySizes_[genericFontFamily]);
};

/**
 * Return true if the given sizes match any of the generic font family
 * sizes.
 *
 * @private
 * @param {?{width: number, height: number}} a
 * @param {?{width: number, height: number}} b
 * @return {boolean}
 */
webfont.FontWatchRunner.prototype.sizesMatchGenericFontSizes_ = function(a, b) {
  for (var genericFontFamily in webfont.FontWatchRunner.GenericFontFamily) {
    if (webfont.FontWatchRunner.GenericFontFamily.hasOwnProperty(genericFontFamily)) {
      if (this.sizeMatches_(a, genericFontFamily) && this.sizeMatches_(b, genericFontFamily)) {
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

  if ((this.sizeMatches_(sizeA, webfont.FontWatchRunner.GenericFontFamily.SERIF) && this.sizeMatches_(sizeB, webfont.FontWatchRunner.GenericFontFamily.SANS_SERIF)) ||
      (this.hasWebKitFallbackBug_ && this.sizesMatchGenericFontSizes_(sizeA, sizeB))) {
    if (this.hasTimedOut_()) {
      if (this.hasWebKitFallbackBug_ && this.sizesMatchGenericFontSizes_(sizeA, sizeB)) {
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
