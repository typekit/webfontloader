goog.provide('webfont.FontVariationDescription');

/**
 * @constructor
 * @param {string=} str
 */
webfont.FontVariationDescription = function (str) {
  this.style = 'n';
  this.weight =  4;

  if (str) {
    str = str.replace(/\s*/g, '');
    if (str.length === 2) {
      this.parseFvd(str);
    } else {
      this.parseCss(str);
    }
  }
};

goog.scope(function () {
  var FontVariationDescription = webfont.FontVariationDescription;

  /**
   * @private
   * @param {string} fvd
   */
  FontVariationDescription.prototype.parseFvd = function (fvd) {
    var match = fvd.match(/([nio])([1-9])/i);

    if (match) {
      this.style = match[1];
      this.weight = parseInt(match[2], 10);
    }
  };

  /**
   * @private
   * @param {string} css
   */
  FontVariationDescription.prototype.parseCss = function (css) {
    var style = css.match(/font-style:(normal|oblique|italic)/i),
        weight = css.match(/font-weight:([1-9]00|normal|bold)/i);

    if (style && style[1]) {
      this.style = style[1].substr(0, 1).toLowerCase();
    }

    if (weight) {
      if (/bold/i.test(weight[1])) {
        this.weight = 7;
      } else if (/[1-9]00/.test(weight[1])) {
        this.weight = parseInt(weight[1].substr(0, 1), 10);
      }
    }
  };

  /**
   * @return {string}
   */
  FontVariationDescription.prototype.toString = function () {
    return this.style + this.weight;
  };

  /**
   * @return {string}
   */
  FontVariationDescription.prototype.toCss = function () {
    var style = 'normal',
        weight = this.weight + '00';

    if (this.style === 'o') {
      style = 'oblique';
    } else if (this.style === 'i') {
      style = 'italic';
    }

    return 'font-style:' + style + ';font-weight:' + weight + ';';
  };
});
