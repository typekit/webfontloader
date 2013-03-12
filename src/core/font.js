goog.provide('webfont.Font');

goog.require('webfont.FontVariationDescription');

/**
 * @constructor
 * @param {string} name The font family name
 * @param {webfont.FontVariationDescription=} opt_variation A font variation..
 */
webfont.Font = function (name, opt_variation) {
  this.name_ = name;
  this.variation_ = opt_variation || new webfont.FontVariationDescription('n4');
};

goog.scope(function () {
  var Font = webfont.Font;

  /**
   * @return {string}
   */
  Font.prototype.getName = function () {
    return this.name_;
  };

  /**
   * @return {webfont.FontVariationDescription}
   */
  Font.prototype.getVariation = function () {
    return this.variation_;
  };
});
