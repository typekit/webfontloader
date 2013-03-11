goog.provide('webfont.FontFamily');

goog.require('webfont.FontVariationDescription');

/**
 * @constructor
 * @param {string} name The font family name
 * @param {webfont.FontVariationDescription=} opt_variation A font variation..
 */
webfont.FontFamily = function (name, opt_variation) {
  this.name_ = name;
  this.variation_ = opt_variation || new webfont.FontVariationDescription('n4');
};

goog.scope(function () {
  var FontFamily = webfont.FontFamily;

  /**
   * @return {string}
   */
  FontFamily.prototype.getName = function () {
    return this.name_;
  };

  /**
   * @return {webfont.FontVariationDescription}
   */
  FontFamily.prototype.getVariation = function () {
    return this.variation_;
  };
});
