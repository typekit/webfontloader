/**
 * @constructor
 */
webfont.DefaultCheckStrategy = function(sizingElementCreator, activeCallback,
    inactiveCallback, fontSizer, fontFamily, fontDescription, opt_fontTestString) {
  webfont.DefaultCheckStrategy.superCtor_.call(this, sizingElementCreator,
      activeCallback, inactiveCallback, fontSizer, fontFamily, fontDescription,
      opt_fontTestString);
};
webfont.extendsClass(webfont.BaseCheckStrategy, webfont.DefaultCheckStrategy);

webfont.DefaultCheckStrategy.prototype.setUp = function() {
  webfont.DefaultCheckStrategy.super_.setUp.call(this);
  this.lastObservedSizeA_ = this.originalSizeA_;
  this.lastObservedSizeB_ = this.originalSizeB_;
};

webfont.DefaultCheckStrategy.prototype.isLoaded = function() {
  var sizeA = this.fontSizer_.getWidth(this.requestedFontA_);
  var sizeB = this.fontSizer_.getWidth(this.requestedFontB_);

  if ((this.originalSizeA_ != sizeA || this.originalSizeB_ != sizeB) &&
      this.lastObservedSizeA_ == sizeA && this.lastObservedSizeB_ == sizeB) {
    return true;
  }
  this.lastObservedSizeA_ = sizeA;
  this.lastObservedSizeB_ = sizeB;
  return false;
};
