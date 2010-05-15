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
};

webfont.FontWatcher.DEFAULT_FONT = 'DEFAULT_FONT';

webfont.FontWatcher.prototype.watch = function(fontFamilies, last,
    opt_variations, opt_transformName) {
  var originalSize = this.getDefaultFontSize_();
  var variations = opt_variations || {};
  var length = fontFamilies.length;

  this.currentlyWatched_ += this.calculateFontNumberToWatch(fontFamilies,
      variations);
  if (last) {
    this.last_ = last;
  }
  for (var i = 0; i < length; i++) {
    var fontFamily = fontFamilies[i];
    var availableVariations = variations[fontFamily] || [ '' ];
    var variationsLength = availableVariations.length;

    for (var j = 0; j < variationsLength; j++) {
      var variation = availableVariations[j];

      this.watch_(fontFamily, originalSize, variation, opt_transformName);
    }
  }
};

webfont.FontWatcher.prototype.calculateFontNumberToWatch = function(
    fontFamilies, variations) {
  var length = fontFamilies.length;
  var number = 0;

  for (var i = 0; i < length; i++) {
    var availableVariations = variations[fontFamilies[i]];

    if (availableVariations) {
      number += availableVariations.length;
    } else {
      number++;
    }
  }
  return number;
};

webfont.FontWatcher.prototype.watch_ = function(fontFamily, originalSize,
    opt_cssRules, opt_transformName) {
  if (opt_cssRules && opt_transformName) {
    fontFamily = opt_transformName(fontFamily, opt_cssRules);
  }
  this.eventDispatcher_.dispatchFamilyLoading(fontFamily);
  var requestedFont = this.createHiddenElementWithFont_(fontFamily,
      opt_cssRules);
  var size = this.fontSizer_.getWidth(requestedFont);

  if (originalSize != size) {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFamilyActive(fontFamily);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  } else {
    this.asyncCheck_(this.getTime_(), originalSize, requestedFont,
        fontFamily);
  }
};

webfont.FontWatcher.prototype.decreaseCurrentlyWatched_ = function() {
  if (--this.currentlyWatched_ == 0 && this.last_) {
    if (this.success_) {
      this.eventDispatcher_.dispatchActive();
    } else {
      this.eventDispatcher_.dispatchInactive();
    }
  }
};

webfont.FontWatcher.prototype.check_ = function(started, originalSize,
    requestedFont, fontFamily) {
  var size = this.fontSizer_.getWidth(requestedFont);

  if (originalSize != size) {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFamilyActive(fontFamily);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  } else if ((this.getTime_() - started) < 5000) {
    this.asyncCheck_(started, originalSize, requestedFont, fontFamily);
  } else {
    this.domHelper_.removeElement(requestedFont);
    this.eventDispatcher_.dispatchFamilyInactive(fontFamily);
    this.decreaseCurrentlyWatched_();
  }
};

webfont.FontWatcher.prototype.asyncCheck_ = function(started, originalSize,
    requestedFont, fontFamily) {
  this.asyncCall_(function(context, func) {
    return function() {
      func.call(context, started, originalSize, requestedFont, fontFamily);
    }
  }(this, this.check_), 50);
};

webfont.FontWatcher.prototype.getDefaultFontSize_ = function() {
  var defaultFont = this.createHiddenElementWithFont_(
      webfont.FontWatcher.DEFAULT_FONT);
  var size = this.fontSizer_.getWidth(defaultFont);

  this.domHelper_.removeElement(defaultFont);
  return size;
};

webfont.FontWatcher.prototype.createHiddenElementWithFont_ = function(
    fontFamily, opt_cssRules) {
  var quotedName = this.nameHelper_.quote(fontFamily);
  var styleString = "position:absolute;top:-999px;font-size:300px;font-family:" +
      quotedName + "," + webfont.FontWatcher.DEFAULT_FONT + ";";

  if (opt_cssRules) {
    styleString += opt_cssRules;
  }
  var span = this.domHelper_.createElement('span', {

    // IE must have a fallback font option, else sometimes the loaded font
    // won't be detected - typically in the fully cached case.
    'style': styleString }, 'Mm');

  this.domHelper_.insertInto('html', span);
  return span;
};
