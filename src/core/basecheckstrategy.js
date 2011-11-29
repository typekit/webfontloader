/**
 * @constructor
 */
webfont.BaseCheckStrategy = function(sizingElementCreator, activeCallback,
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

webfont.BaseCheckStrategy.prototype.setUp = function() {
  this.originalSizeA_ = this.getStackSize_(webfont.FontWatchRunner.SANS_STACK);
  this.originalSizeB_ = this.getStackSize_(webfont.FontWatchRunner.SERIF_STACK);
  this.requestedFontA_ = this.sizingElementCreator_.createSizingElement(
      this.fontFamily_, webfont.FontWatchRunner.SANS_STACK,
      this.fontDescription_, this.fontTestString_);
  this.requestedFontB_ = this.sizingElementCreator_.createSizingElement(
      this.fontFamily_, webfont.FontWatchRunner.SERIF_STACK,
      this.fontDescription_, this.fontTestString_);
};

webfont.BaseCheckStrategy.prototype.tearDown = function() {
  this.sizingElementCreator_.deleteSizingElement(this.requestedFontA_);
  this.sizingElementCreator_.deleteSizingElement(this.requestedFontB_);
};

webfont.BaseCheckStrategy.prototype.getStackSize_ = function(stack) {
  var stackElement = this.sizingElementCreator_.createSizingElement('',
      stack, this.fontDescription_, this.fontTestString_);
  var size = this.fontSizer_.getWidth(stackElement);
  this.sizingElementCreator_.deleteSizingElement(stackElement);
  return size;
};
