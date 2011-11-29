/**
 * @constructor
 */
webfont.LastResortWebKitCheckStrategy = function(sizingElementCreator, activeCallback,
    inactiveCallback, fontSizer, fontFamily, fontDescription, opt_fontTestString) {
  webfont.LastResortWebKitCheckStrategy.superCtor_.call(this,
      sizingElementCreator, activeCallback, inactiveCallback, fontSizer,
      fontFamily, fontDescription, opt_fontTestString);
};
webfont.extendsClass(webfont.BaseCheckStrategy,
    webfont.LastResortWebKitCheckStrategy);

webfont.LastResortWebKitCheckStrategy.prototype.setUp = function() {
  webfont.LastResortWebKitCheckStrategy.super_.setUp.call(this);
  this.webKitLastResortFontSizes_ = this.setUpWebKitLastResortFontSizes_();
};

webfont.LastResortWebKitCheckStrategy.prototype.isLoaded = function() {
  var sizeA = this.fontSizer_.getWidth(this.requestedFontA_);
  var sizeB = this.fontSizer_.getWidth(this.requestedFontB_);
  return ((this.originalSizeA_ != sizeA || this.originalSizeB_ != sizeB)
      && (!this.webKitLastResortFontSizes_[sizeA]
          && !this.webKitLastResortFontSizes_[sizeB]));
};

webfont.LastResortWebKitCheckStrategy.prototype.getTimeoutCallback = function() {
  return this.getActiveCallback();
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
