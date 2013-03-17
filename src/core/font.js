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
   * @return {string}
   */
  Font.prototype.getCssName = function () {
    return this.quote_(this.name_);
  };

  /**
   * @private
   * @param {string} name
   * @return {string}
   */
  Font.prototype.quote_ = function (name) {
    var quoted = [];
    var split = name.split(/,\s*/);
    for (var i = 0; i < split.length; i++) {
      var part = split[i].replace(/['"]/g, '');
      if (part.indexOf(' ') == -1) {
        quoted.push(part);
      } else {
        quoted.push("'" + part + "'");
      }
    }
    return quoted.join(',');
  };

  /**
   * @return {webfont.FontVariationDescription}
   */
  Font.prototype.getVariation = function () {
    return this.variation_;
  };
});
