goog.provide('webfont.Font');

/**
 * This class is an abstraction for a single font or typeface.
 * It contains the font name and the variation (i.e. style
 * and weight.) A collection Font instances can represent a
 * font family.
 *
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
   * Returns a CSS string representation of the font that
   * can be used as the CSS font property shorthand.
   *
   * @return {string}
   */
  Font.prototype.toCssString = function () {
    return this.getCssStyle() + ' ' + this.getCssWeight() + ' 300px ' + this.getCssName();
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
      if (part.indexOf(' ') == -1 && !(/^\d/.test(part))) {
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
    return 'font-style:' + this.getCssStyle() + ';font-weight:' + this.getCssWeight() + ';';
  };

  /**
   * @return {string}
   */
  Font.prototype.getCssWeight = function () {
    return this.weight_ + '00';
  };

  /**
   * @return {string}
   */
  Font.prototype.getCssStyle = function () {
    var style = 'normal';

    if (this.style_ === 'o') {
      style = 'oblique';
    } else if (this.style_ === 'i') {
      style = 'italic';
    }

    return style;
  };

  /**
   * Parses a CSS font declaration and returns a font
   * variation description.
   *
   * @param {string} css
   * @return {string}
   */
  Font.parseCssVariation = function (css) {
    var weight = 4,
        style = 'n',
        m = null;

    if (css) {
      m = css.match(/(normal|oblique|italic)/i);

      if (m && m[1]) {
        style = m[1].substr(0, 1).toLowerCase();
      }

      m = css.match(/([1-9]00|normal|bold)/i);

      if (m && m[1]) {
        if (/bold/i.test(m[1])) {
          weight = 7;
        } else if (/[1-9]00/.test(m[1])) {
          weight = parseInt(m[1].substr(0, 1), 10);
        }
      }
    }
    return style + weight;
  }
});
