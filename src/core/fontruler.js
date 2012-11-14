/**
 * An element that can be used to measure the metrics
 * of a given font and string.
 * @constructor
 * @param {webfont.DomHelper} domHelper
 * @param {Object.<string, function(Object): {width: number, height: number}>} fontSizer
 * @param {string} fontFamily
 * @param {string} fontDescription
 * @param {string} fontTestString
 */
webfont.FontRuler = function(domHelper, fontSizer, fontFamily, fontDescription, fontTestString) {
  this.domHelper_ = domHelper;
  this.fontSizer_ = fontSizer;
  this.fontFamily_ = fontFamily;
  this.fontDescription_ = fontDescription;
  this.fontTestString_ = fontTestString;
  this.nameHelper_ = new webfont.CssFontFamilyName();
  this.fvd_ = new webfont.FontVariationDescription();
  this.el_ = this.create_();
  this.setFont(fontFamily, fontDescription);
};

/**
 * @param {string} fontFamily
 * @param {string} fontDescription
 */
webfont.FontRuler.prototype.setFont = function(fontFamily, fontDescription) {
  var styleString = this.computeStyleString_(fontFamily, fontDescription);
  this.domHelper_.setStyle(this.el_, styleString);
};

/**
 * @private
 * @return {Element}
 */
webfont.FontRuler.prototype.create_ = function() {
  var span = this.domHelper_.createElement('span', {}, this.fontTestString_);
  this.domHelper_.insertInto('body', span);
  return span;
};

/**
 * @private
 * @param {string} fontFamily
 * @param {string} fontDescription
 * @return {string}
 */
webfont.FontRuler.prototype.computeStyleString_ = function(fontFamily, fontDescription) {
  var variationCss = this.fvd_.expand(fontDescription);
  var styleString = "position:absolute;top:-999px;left:-999px;" +
      "font-size:300px;width:auto;height:auto;line-height:normal;margin:0;" +
      "padding:0;font-variant:normal;font-family:" +
      this.nameHelper_.quote(fontFamily) + ";" + variationCss;
  return styleString;
};

/**
 * @return {{width: number, height: number}}
 */
webfont.FontRuler.prototype.getSize = function() {
  return this.fontSizer_.getSize(this.el_);
};

/**
 * Removes the ruler element from the DOM.
 */
webfont.FontRuler.prototype.remove = function() {
  this.domHelper_.removeElement(this.el_);
};
