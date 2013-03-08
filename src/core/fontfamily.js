goog.provide('webfont.FontFamily');

/**
 * @constructor
 * @param {string} name The font family name
 * @param {Array.<webfont.FontVariationDescription>} An array of fvds.
 */
webfont.FontFamily = function (name, fvds) {
  this.name_ = name;
  this.fvds_ = fvds;
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
   * @return {Array.<webfont.FontVariationDescription>}
   */
  FontFamily.prototype.getFvds = function () {
    return this.fvds_;
  };
});
