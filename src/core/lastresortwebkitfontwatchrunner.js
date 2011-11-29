/**
 * @constructor
 */
webfont.LastResortWebKitFontWatchRunner = function(activeCallback,
    inactiveCallback, domHelper, fontSizer, asyncCall, getTime, fontFamily,
    fontDescription, opt_fontTestString) {
  webfont.LastResortWebKitFontWatchRunner.superCtor_.call(this,
      activeCallback, inactiveCallback, domHelper, fontSizer, asyncCall,
      getTime, fontFamily, fontDescription, opt_fontTestString);
  this.webKitLastResortFontSizes_ = this.setUpWebKitLastResortFontSizes_();
};
webfont.extendsClass(webfont.FontWatchRunner, webfont.LastResortWebKitFontWatchRunner);

webfont.FontWatchRunner.prototype.setUpWebKitLastResortFontSizes_ = function() {
  var lastResortFonts = ["'Times New Roman'",
      "'Lucida Sans Unicode'", "'Courier New'", "Tahoma", "Arial",
      "'Microsoft Sans Serif'", "Times", "'Lucida Console'", "Sans", "Serif",
      "Monospace"];
  var lastResortFontSizes = lastResortFonts.length;
  var webKitLastResortFontSizes = {};
  var element = this.createHiddenElementWithFont_(lastResortFonts[0], true);

  webKitLastResortFontSizes[this.fontSizer_.getWidth(element)] = true;
  for (var i = 1; i < lastResortFontSizes; i++) {
    var font = lastResortFonts[i];
    this.domHelper_.setStyle(element, this.computeStyleString_(font, true));
    webKitLastResortFontSizes[this.fontSizer_.getWidth(element)] = true;
  }
  this.domHelper_.removeElement(element);
  return webKitLastResortFontSizes;
};

webfont.LastResortWebKitFontWatchRunner.prototype.check_ = function() {
  var sizeA = this.fontSizer_.getWidth(this.requestedFontA_);
  var sizeB = this.fontSizer_.getWidth(this.requestedFontB_);

  if ((this.originalSizeA_ != sizeA || this.originalSizeB_ != sizeB) &&
      (this.webKitLastResortFontSizes_ == null ||
      (!this.webKitLastResortFontSizes_[sizeA] &&
       !this.webKitLastResortFontSizes_[sizeB]))) {
    this.finish_(this.activeCallback_);
  } else if (this.getTime_() - this.started_ >= 5000) {

    // In order to handle the fact that a font could be the same size as the
    // default browser font on a webkit browser, mark the font as active
    // after 5 seconds if the latest 2 sizes are in webKitLastResortFontSizes_.
    if (this.webKitLastResortFontSizes_
        && this.webKitLastResortFontSizes_[sizeA]
        && this.webKitLastResortFontSizes_[sizeB]) {
      this.finish_(this.activeCallback_);
    } else {
      this.finish_(this.inactiveCallback_);
    }
  } else {
    this.asyncCheck_();
  }
};
