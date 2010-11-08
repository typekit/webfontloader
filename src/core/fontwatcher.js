/**
 * @constructor
 */
webfont.FontWatcher = function(domHelper, eventDispatcher, fontSizer,
    asyncCall, getTime) {
  this.domHelper_ = domHelper;
  this.eventDispatcher_ = eventDispatcher;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.currentlyWatched_ = 0;
  this.last_ = false;
  this.success_ = false;
  this.nameHelper_ = new webfont.CssFontFamilyName();
  this.fvd_ = new webfont.FontVariationDescription();
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
webfont.FontWatcher.DEFAULT_FONTS_A = 'arial,"URW Gothic L",sans-serif';

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
webfont.FontWatcher.DEFAULT_FONTS_B = 'Georgia,"Century Schoolbook L",serif';

/**
 * Default test string. Characters are chosen so that their widths vary a lot
 * between the fonts in the default stacks. We want each fallback stack
 * to always start out at a different width than the other.
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_TEST_STRING = 'BESs';

/**
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_VARIATION = 'n4';

/**
 * Watches a set of font families.
 * @param {Array.<string>} fontFamilies The font family names to watch.
 * @param {Object.<string, Array.<string>>} fontDescriptions The font variations
 *     of each family to watch. Described with FVD.
 * @param {Object.<string, string>} fontTestStrings The font test strings for
 *     each family.
 * @param {boolean} last True if this is the last set of families to watch.
 */
webfont.FontWatcher.prototype.watch = function(fontFamilies, fontDescriptions,
    fontTestStrings, last) {
  var length = fontFamilies.length;

  for (var i = 0; i < length; i++) {
    var fontFamily = fontFamilies[i];
    if (!fontDescriptions[fontFamily]) {
      fontDescriptions[fontFamily] = [webfont.FontWatcher.DEFAULT_VARIATION];
    }
    this.currentlyWatched_ += fontDescriptions[fontFamily].length;
  }

  if (last) {
    this.last_ = last;
  }

  for (var i = 0; i < length; i++) {
    var fontFamily = fontFamilies[i];
    var descriptions = fontDescriptions[fontFamily];
    var fontTestString  = fontTestStrings[fontFamily] || webfont.FontWatcher.DEFAULT_TEST_STRING;

    for (var j = 0, len = descriptions.length; j < len; j++) {
      var fontDescription = descriptions[j];

      var defaultFontsA = webfont.FontWatcher.DEFAULT_FONTS_A;
      var originalSizeA = this.getDefaultFontSize_(defaultFontsA,
          fontDescription, fontTestString);

      var defaultFontsB = webfont.FontWatcher.DEFAULT_FONTS_B;
      var originalSizeB = this.getDefaultFontSize_(defaultFontsB,
          fontDescription, fontTestString);

      this.watch_(fontFamily, fontDescription, fontTestString,
          originalSizeA, defaultFontsA, originalSizeB, defaultFontsB);
    }
  }
};

/**
 * @private
 */
webfont.FontWatcher.prototype.watch_ = function(fontFamily, fontDescription,
    fontTestString, originalSizeA, defaultFontsA, originalSizeB, defaultFontsB) {
  this.eventDispatcher_.dispatchFontLoading(fontFamily, fontDescription);
  var requestedFontA = this.createHiddenElementWithFont_(this.nameHelper_.quote(fontFamily),
      defaultFontsA, fontDescription, fontTestString);
  var sizeA = this.fontSizer_.getWidth(requestedFontA);

  var requestedFontB = this.createHiddenElementWithFont_(this.nameHelper_.quote(fontFamily),
      defaultFontsB, fontDescription, fontTestString);
  var sizeB = this.fontSizer_.getWidth(requestedFontB);

  if (originalSizeA != sizeA || originalSizeB != sizeB) {
    this.domHelper_.removeElement(requestedFontA);
    this.domHelper_.removeElement(requestedFontB);
    this.eventDispatcher_.dispatchFontActive(fontFamily, fontDescription);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  } else {
    this.asyncCheck_(this.getTime_(), fontFamily, fontDescription,
        originalSizeA, requestedFontA, originalSizeB, requestedFontB);
  }
};

/**
 * @private
 */
webfont.FontWatcher.prototype.decreaseCurrentlyWatched_ = function() {
  if (--this.currentlyWatched_ == 0 && this.last_) {
    if (this.success_) {
      this.eventDispatcher_.dispatchActive();
    } else {
      this.eventDispatcher_.dispatchInactive();
    }
  }
};

/**
 * @private
 */
webfont.FontWatcher.prototype.check_ = function(started, fontFamily,
    fontDescription, originalSizeA, requestedFontA, originalSizeB, requestedFontB) {
  var sizeA = this.fontSizer_.getWidth(requestedFontA);
  var sizeB = this.fontSizer_.getWidth(requestedFontB);

  if (originalSizeA != sizeA || originalSizeB != sizeB) {
    this.domHelper_.removeElement(requestedFontA);
    this.domHelper_.removeElement(requestedFontB);
    this.eventDispatcher_.dispatchFontActive(fontFamily, fontDescription);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  } else if ((this.getTime_() - started) < 5000) {
    this.asyncCheck_(started, fontFamily, fontDescription, originalSizeA,
        requestedFontA, originalSizeB, requestedFontB);
  } else {
    this.domHelper_.removeElement(requestedFontA);
    this.domHelper_.removeElement(requestedFontB);
    this.eventDispatcher_.dispatchFontInactive(fontFamily, fontDescription);
    this.decreaseCurrentlyWatched_();
  }
};

/**
 * @private
 */
webfont.FontWatcher.prototype.asyncCheck_ = function(started, fontFamily,
    fontDescription, originalSizeA, requestedFontA, originalSizeB, requestedFontB) {
  this.asyncCall_(function(context, func) {
    return function() {
      func.call(context, started, fontFamily, fontDescription, originalSizeA,
          requestedFontA, originalSizeB, requestedFontB);
    }
  }(this, this.check_), 50);
};

/**
 * @private
 */
webfont.FontWatcher.prototype.getDefaultFontSize_ = function(defaultFonts,
    fontDescription, fontTestString) {
  var defaultFont = this.createHiddenElementWithFont_(
      null, defaultFonts, fontDescription, fontTestString);
  var size = this.fontSizer_.getWidth(defaultFont);

  this.domHelper_.removeElement(defaultFont);
  return size;
};

/**
 * @private
 */
webfont.FontWatcher.prototype.createHiddenElementWithFont_ = function(
    fontFamily, defaultFonts, fontDescription, fontTestString) {
  fontFamily = fontFamily ? fontFamily + "," : "";
  var variationCss = this.fvd_.expand(fontDescription);
  var styleString = "position:absolute;top:-999px;font-size:300px;font-family:" +
      fontFamily + defaultFonts + ";" + variationCss;
  var span = this.domHelper_.createElement('span', { 'style': styleString },
      fontTestString);

  this.domHelper_.insertInto('body', span);
  return span;
};
