goog.provide('webfont.Font');

/**
 * @constructor
 * @param {string} name The font family name
 * @param {string=} opt_variation A font variation description
 */
webfont.Font = function (name, opt_variation) {
  this.name_ = name;
  this.weight_ = 4;
  this.style_ = 'n'

  var variation = opt_variation || 'n4',
      match = variation.match(/^([nio])([1-9])$/i);

  if (match) {
    this.style_ = match[1];
    this.weight_ = parseInt(match[2], 10);
  }
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
   * @return {string}
   */
  Font.prototype.getVariation = function () {
    return this.style_ + this.weight_;
  };

  /**
   * @return {string}
   */
  Font.prototype.getCssVariation = function () {
    var style = 'normal',
        weight = this.weight_ + '00';

    if (this.style_ === 'o') {
      style = 'oblique';
    } else if (this.style_ === 'i') {
      style = 'italic';
    }

    return 'font-style:' + style + ';font-weight:' + weight + ';';
  };
});
