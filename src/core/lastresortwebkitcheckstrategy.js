/**
 * @constructor
 */
webfont.LastResortWebKitCheckStrategy = function(sizingElementCreator, activeCallback,
    inactiveCallback, fontSizer, fontFamily, fontDescription, opt_fontTestString) {
  this.sizingElementCreator_ = sizingElementCreator;
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.fontSizer_ = fontSizer;
  this.fontFamily_ = fontFamily;
  this.fontDescription_ = fontDescription;
  this.fontTestString_ = opt_fontTestString
      || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
};

webfont.LastResortWebKitCheckStrategy.prototype.setUp = function() {
  this.originalSizeA_ = this.getStackSize_(webfont.FontWatchRunner.SANS_STACK);
  this.originalSizeB_ = this.getStackSize_(webfont.FontWatchRunner.SERIF_STACK);
  this.webKitLastResortFontSizes_ = this.setUpWebKitLastResortFontSizes_();
  this.requestedFontA_ = this.sizingElementCreator_.createSizingElement(
      this.fontFamily_, webfont.FontWatchRunner.SANS_STACK,
      this.fontDescription_, this.fontTestString_);
  this.requestedFontB_ = this.sizingElementCreator_.createSizingElement(
      this.fontFamily_, webfont.FontWatchRunner.SERIF_STACK,
      this.fontDescription_, this.fontTestString_);
};

webfont.LastResortWebKitCheckStrategy.prototype.tearDown = function() {
  this.sizingElementCreator_.deleteSizingElement(this.requestedFontA_);
  this.sizingElementCreator_.deleteSizingElement(this.requestedFontB_);
};

webfont.LastResortWebKitCheckStrategy.prototype.isLoaded = function() {
  var sizeA = this.fontSizer_.getWidth(this.requestedFontA_);
  var sizeB = this.fontSizer_.getWidth(this.requestedFontB_);
  return ((this.originalSizeA_ != sizeA || this.originalSizeB_ != sizeB)
      && (!this.webKitLastResortFontSizes_[sizeA]
          && !this.webKitLastResortFontSizes_[sizeB]));
};

webfont.LastResortWebKitCheckStrategy.prototype.getActiveCallback = function() {
  return webfont.bind(this, function() {
      this.activeCallback_(this.fontFamily_, this.fontDescription_);
  });
};

webfont.LastResortWebKitCheckStrategy.prototype.getTimeoutCallback = function() {
  return this.getActiveCallback();
};

webfont.LastResortWebKitCheckStrategy.prototype.getStackSize_ = function(stack) {
  var stackElement = this.sizingElementCreator_.createSizingElement('',
      stack, this.fontDescription_, this.fontTestString_);
  var size = this.fontSizer_.getWidth(stackElement);
  this.sizingElementCreator_.deleteSizingElement(stackElement);
  return size;
};

/**
 * While loading a web font webkit applies a last resort fallback font to the
 * element on which the web font is applied.
 * See file: WebKit/Source/WebCore/css/CSSFontFaceSource.cpp.
 * Looking at the different implementation for the different platforms,
 * the last resort fallback font is different. This code uses the default
 * OS/browsers values.
 */
webfont.LastResortWebKitCheckStrategy.prototype.setUpWebKitLastResortFontSizes_ = function() {
  var lastResortFonts = ["Times New Roman",
      "Lucida Sans Unicode", "Courier New", "Tahoma", "Arial",
      "Microsoft Sans Serif", "Times", "Lucida Console", "Sans", "Serif",
      "Monospace"];
  var lastResortFontSizes = lastResortFonts.length;
  var webKitLastResortFontSizes = {};
  var element = this.sizingElementCreator_.createSizingElement(lastResortFonts[0],
      '', this.fontDescription_, this.fontTestString_);

  webKitLastResortFontSizes[this.fontSizer_.getWidth(element)] = true;
  for (var i = 1; i < lastResortFontSizes; i++) {
    var font = lastResortFonts[i];
    this.sizingElementCreator_.updateSizingElementStyle(element, font, '',
        this.fontDescription_);
    webKitLastResortFontSizes[this.fontSizer_.getWidth(element)] = true;
  }
  this.sizingElementCreator_.deleteSizingElement(element);
  return webKitLastResortFontSizes;
};
