/**
 * An element that can be used to measure the metrics
 * of a given font and string.
 * @constructor
 * @param {webfont.DomHelper} domHelper
 * @param {Object.<string, function(Object): {width: number, height: number}>} fontSizer
 * @param {string} fontTestString
 */
webfont.FontRuler = function(domHelper, fontSizer, fontTestString) {
  this.domHelper_ = domHelper;
  this.fontSizer_ = fontSizer;
  this.fontTestString_ = fontTestString;
  this.nameHelper_ = new webfont.CssFontFamilyName();
  this.fvd_ = new webfont.FontVariationDescription();
  this.el_ = null;
};

/**
 * @param {string} fontFamily
 * @param {string=} opt_fontDescription
 */
webfont.FontRuler.prototype.setFont = function(fontFamily, opt_fontDescription) {
  var styleString = this.computeStyleString_(fontFamily, opt_fontDescription);
  this.domHelper_.setStyle(this.el_, styleString);
};

/**
 * Inserts the ruler into the DOM.
 */
webfont.FontRuler.prototype.insert = function() {
  this.el_ = this.domHelper_.createElement('span', {}, this.fontTestString_);
  this.domHelper_.insertInto('body', this.el_);
};

/**
 * @private
 * @param {string} fontFamily
 * @param {string=} opt_fontDescription
 * @return {string}
 */
webfont.FontRuler.prototype.computeStyleString_ = function(fontFamily, opt_fontDescription) {
  var variationCss = this.fvd_.expand(opt_fontDescription || '');
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
