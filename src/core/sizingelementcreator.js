/**
 * @constructor
 */
webfont.SizingElementCreator = function(domHelper) {
  this.domHelper_ = domHelper;
  this.fvd_ = new webfont.FontVariationDescription();
  this.nameHelper_ = new webfont.CssFontFamilyName();
};

webfont.SizingElementCreator.prototype.createSizingElement = function(
    fontFamily, fontFamilyStack, fontDescription, fontTestString) {
  var styleString = this.computeSizingElementStyle_(fontFamily,
      fontFamilyStack, fontDescription);
  var span = this.domHelper_.createElement('span', { 'style': styleString },
      fontTestString);

  this.domHelper_.insertInto('body', span);
  return span;
};

webfont.SizingElementCreator.prototype.deleteSizingElement = function(element) {
  this.domHelper_.removeElement(element);
};

/**
 * @return {string} The style string for a sizing element.
 */
webfont.SizingElementCreator.prototype.computeSizingElementStyle_ = function(
    fontFamily, fontFamilyStack, fontDescription) {
  var variationCss = this.fvd_.expand(fontDescription);
  var fontFamilyStringBuilder = [];
  if (fontFamily.length > 0) {
    fontFamilyStringBuilder.push(this.nameHelper_.quote(fontFamily));
  }
  if (fontFamilyStack.length > 0) {
    fontFamilyStringBuilder.push(fontFamilyStack);
  }
  var styleString = "position:absolute;top:-999px;left:-999px;" +
      "font-size:300px;width:auto;height:auto;line-height:normal;margin:0;" +
      "padding:0;font-variant:normal;font-family:"
      + fontFamilyStringBuilder.join(",") + ";" + variationCss;
  return styleString;
};

webfont.SizingElementCreator.prototype.updateSizingElementStyle = function(
    element, fontFamily, fontFamilyStack, fontDescription) {
  this.domHelper_.setStyle(element, this.computeSizingElementStyle_(fontFamily,
      fontFamilyStack, fontDescription));
};
