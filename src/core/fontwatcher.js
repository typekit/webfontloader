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

webfont.FontWatcher.DEFAULT_FONT = 'DEFAULT_FONT';
webfont.FontWatcher.DEFAULT_FVD = 'n4';

webfont.FontWatcher.prototype.watch = function(fontFamilies, fontDescriptions, last) {
  var originalSize = this.getDefaultFontSize_();
  var length = fontFamilies.length;

  this.currentlyWatched_ += this.calculateFontNumberToWatch(fontFamilies, fontDescriptions);
  if (last) {
    this.last_ = last;
  }
  for (var i = 0; i < length; i++) {
    var fontFamily = fontFamilies[i];
    var availableDescriptions = fontDescriptions[fontFamily] || [ '' ];
    var fontDescriptionsLength = availableDescriptions.length;

    for (var j = 0; j < fontDescriptionsLength; j++) {
      var fontDescription = availableDescriptions[j] || webfont.FontWatcher.DEFAULT_FVD;

      this.watch_(fontFamily, fontDescription, originalSize);
    }
  }
};

webfont.FontWatcher.prototype.calculateFontNumberToWatch = function(
    fontFamilies, fontDescriptions) {
  var length = fontFamilies.length;
  var number = 0;

  for (var i = 0; i < length; i++) {
    var availableDescriptions = fontDescriptions[fontFamilies[i]];

    if (availableDescriptions) {
      number += availableDescriptions.length;
    } else {
      number++;
    }
  }
  return number;
};

webfont.FontWatcher.prototype.watch_ = function(fontFamily, fontDescription, originalSize) {
  this.eventDispatcher_.dispatchFontLoading(fontFamily, fontDescription);
  var requestedFont = this.createHiddenElementWithFont_(fontFamily, fontDescription);
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

webfont.FontWatcher.prototype.asyncCheck_ = function(started, originalSize,
    requestedFont, fontFamily, fontDescription) {
  this.asyncCall_(function(context, func) {
    return function() {
      func.call(context, started, originalSize, requestedFont, fontFamily, fontDescription);
    }
  }(this, this.check_), 50);
};

webfont.FontWatcher.prototype.getDefaultFontSize_ = function() {
  var defaultFont = this.createHiddenElementWithFont_(
      webfont.FontWatcher.DEFAULT_FONT, 'n4');
  var size = this.fontSizer_.getWidth(defaultFont);

  this.domHelper_.removeElement(defaultFont);
  return size;
};

webfont.FontWatcher.prototype.createHiddenElementWithFont_ = function(
    fontFamily, fontDescription) {
  var quotedName = this.nameHelper_.quote(fontFamily);
  var styleString = "position:absolute;top:-999px;font-size:300px;font-family:" +
      quotedName + "," + webfont.FontWatcher.DEFAULT_FONT + ";";

  if (fontDescription) {
    styleString += this.fvd_.expand(fontDescription);
  }
  var span = this.domHelper_.createElement('span', {
    // IE must have a fallback font option, else sometimes the loaded font
    // won't be detected - typically in the fully cached case.
    'style': styleString }, 'Mm');

  this.domHelper_.insertInto('html', span);
  return span;
};
