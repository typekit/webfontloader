goog.provide('webfont.FontRuler');

goog.require('webfont.CssFontFamilyName');
goog.require('webfont.FontVariationDescription');
goog.require('webfont.Size');

/**
 * An element that can be used to measure the metrics
 * of a given font and string.
 * @constructor
 * @param {webfont.DomHelper} domHelper
 * @param {string} fontTestString
 */
webfont.FontRuler = function(domHelper, fontTestString) {
  this.domHelper_ = domHelper;
  this.fontTestString_ = fontTestString;
  this.nameHelper_ = new webfont.CssFontFamilyName();
  this.fvd_ = new webfont.FontVariationDescription();
  this.el_ = this.domHelper_.createElement('span', {}, this.fontTestString_);
};

goog.scope(function () {
  var FontRuler = webfont.FontRuler,
      Size = webfont.Size;

  /**
   * @param {string} fontFamily
   * @param {string=} opt_fontDescription
   */
  FontRuler.prototype.setFont = function(fontFamily, opt_fontDescription) {
    var styleString = this.computeStyleString_(fontFamily, opt_fontDescription);
    this.domHelper_.setStyle(this.el_, styleString);
  };

  /**
   * Inserts the ruler into the DOM.
   */
  FontRuler.prototype.insert = function() {
    this.domHelper_.insertInto('body', this.el_);
  };

  /**
   * @private
   * @param {string} fontFamily
   * @param {string=} opt_fontDescription
   * @return {string}
   */
  FontRuler.prototype.computeStyleString_ = function(fontFamily, opt_fontDescription) {
    var variationCss = opt_fontDescription ? this.fvd_.expand(opt_fontDescription) : '';
    var styleString = "position:absolute;top:-999px;left:-999px;" +
        "font-size:300px;width:auto;height:auto;line-height:normal;margin:0;" +
        "padding:0;font-variant:normal;white-space:nowrap;font-family:" +
        this.nameHelper_.quote(fontFamily) + ";" + variationCss;
    return styleString;
  };

  /**
   * @return {webfont.Size}
   */
  FontRuler.prototype.getSize = function() {
    return new Size(this.el_.offsetWidth, this.el_.offsetHeight);
  };

  /**
   * Removes the ruler element from the DOM.
   */
  FontRuler.prototype.remove = function() {
    this.domHelper_.removeElement(this.el_);
  };
});
