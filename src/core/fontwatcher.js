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

webfont.FontWatcher.prototype.watch = function(fontFamilies, last) {
  var originalSize = this.getDefaultFontSize_();
  var length = fontFamilies.length;

  this.currentlyWatched_ += length;
  if (last) {
    this.last_ = last;
  }
  for (var i = 0; i < length; i++) {
    var fontFamily = fontFamilies[i];

    this.eventDispatcher_.dispatchFamilyLoading(fontFamily);
    var requestedFont = this.createHiddenElementWithFont_(fontFamily);
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
    this.eventDispatcher_.dispatchFamilyFailed(fontFamily);
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
    fontFamily) {
  var quotedName = this.nameHelper_.quote(fontFamily);
  var span = this.domHelper_.createElement('span', {
    // IE must have a fallback font option, else sometimes the loaded font
    // won't be detected - typically in the fully cached case.
    'style': "position:absolute;top:-999px;font-size:300px;font-family:" +
        quotedName + "," + webfont.FontWatcher.DEFAULT_FONT + ";"
  }, 'Mm');

  this.domHelper_.insertInto('html', span);
  return span;
};
