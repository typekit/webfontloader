goog.provide('webfont.FontRuler');

/**
 * An element that can be used to measure the metrics
 * of a given font and string.
 * @constructor
 * @param {webfont.DomHelper} domHelper
 * @param {string} fontTestString
 */
webfont.FontRuler = function (domHelper, fontTestString) {
  this.domHelper_ = domHelper;
  this.fontTestString_ = fontTestString;
  this.el_ = this.domHelper_.createElement('span', {
    "aria-hidden": "true"
  }, this.fontTestString_);
};

goog.scope(function () {
  var FontRuler = webfont.FontRuler;

  /**
   * @param {webfont.Font} font
   */
  FontRuler.prototype.setFont = function(font) {
    this.domHelper_.setStyle(this.el_, this.computeStyleString_(font));
  };

  /**
   * Inserts the ruler into the DOM.
   */
  FontRuler.prototype.insert = function() {
    this.domHelper_.insertInto('body', this.el_);
  };

  /**
   * @private
   * @param {webfont.Font} font
   * @return {string}
   */
  FontRuler.prototype.computeStyleString_ = function(font) {
    return "display:block;position:absolute;top:-9999px;left:-9999px;" +
           "font-size:300px;width:auto;height:auto;line-height:normal;margin:0;" +
           "padding:0;font-variant:normal;white-space:nowrap;font-family:" +
           font.getCssName() + ";" + font.getCssVariation();
  };

  /**
   * @return {number}
   */
  FontRuler.prototype.getWidth = function() {
    return this.el_.offsetWidth;
  };

  /**
   * Removes the ruler element from the DOM.
   */
  FontRuler.prototype.remove = function() {
    this.domHelper_.removeElement(this.el_);
  };
});
