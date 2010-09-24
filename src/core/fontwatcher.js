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
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_FONT = '_,arial,helvetica';

/**
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_VARIATION = 'n4';

/**
 * Watches a set of font families.
 * @param {Array.<string>} fontFamilies The font family names to watch.
 * @param {Object.<string, Array.<string>>} fontDescriptions The font variations
 *    of each family to watch. Described with FVD.
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
    var fontTestString  = fontTestStrings[fontFamily] || 'Mm';

    for (var j = 0, len = descriptions.length; j < len; j++) {
      var fontDescription = descriptions[j];
      var originalSize = this.getDefaultFontSize_(fontDescription,
          fontTestString);

      this.watch_(fontFamily, fontDescription, fontTestString, originalSize);
    }
  }
};

/**
 * @private
 */
webfont.FontWatcher.prototype.watch_ = function(fontFamily, fontDescription,
    fontTestString, originalSize) {
  this.eventDispatcher_.dispatchFontLoading(fontFamily, fontDescription);
  var requestedFont = this.createHiddenElementWithFont_(this.nameHelper_.quote(fontFamily),
      fontDescription, fontTestString);
  var size = this.fontSizer_.getWidth(requestedFont);

  if (originalSize != size) {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFontActive(fontFamily, fontDescription);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  } else {
    this.asyncCheck_(this.getTime_(), originalSize, requestedFont,
        fontFamily, fontDescription);
  }
};

/**
 * @private
 */
webfont.FontWatcher.prototype.decreaseCurrentlyWatched_ = function() {
  alert('this.currentlyWatched_: ' + (this.currentlyWatched_ - 1) + ' ' + this.last_);
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
webfont.FontWatcher.prototype.check_ = function(started, originalSize,
    requestedFont, fontFamily, fontDescription) {
  var size = this.fontSizer_.getWidth(requestedFont);

  if (originalSize != size) {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFontActive(fontFamily, fontDescription);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  } else if ((this.getTime_() - started) < 5000) {
    this.asyncCheck_(started, originalSize, requestedFont, fontFamily, fontDescription);
  } else {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFontInactive(fontFamily, fontDescription);
    this.decreaseCurrentlyWatched_();
  }
};

/**
 * @private
 */
webfont.FontWatcher.prototype.asyncCheck_ = function(started, originalSize,
    requestedFont, fontFamily, fontDescription) {
  this.asyncCall_(function(context, func) {
    return function() {
      func.call(context, started, originalSize, requestedFont, fontFamily, fontDescription);
    }
  }(this, this.check_), 50);
};

/**
 * @private
 */
webfont.FontWatcher.prototype.getDefaultFontSize_ = function(fontDescription,
    fontTestString) {
  var defaultFont = this.createHiddenElementWithFont_(
      webfont.FontWatcher.DEFAULT_FONT, fontDescription, fontTestString);
  var size = this.fontSizer_.getWidth(defaultFont);

  this.domHelper_.removeElement(defaultFont);
  return size;
};

/**
 * @private
 */
webfont.FontWatcher.prototype.createHiddenElementWithFont_ = function(
    fontFamily, fontDescription, fontTestString) {
  var variationCss = this.fvd_.expand(fontDescription);
  var styleString = "position:absolute;top:-999px;font-size:300px;font-family:" +
      fontFamily + "," + webfont.FontWatcher.DEFAULT_FONT + ";" + variationCss;
  var span = this.domHelper_.createElement('span', { 'style': styleString },
      fontTestString);

  this.domHelper_.insertInto('body', span);
  return span;
};
