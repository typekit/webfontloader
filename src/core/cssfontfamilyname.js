goog.provide('webfont.CssFontFamilyName');

/**
 * Handles quoting rules for a font family name in css.
 * @constructor
 */
webfont.CssFontFamilyName = function() {
  /** @type {string} */
  this.quote_ = "'";
};

goog.scope(function () {
  var CssFontFamilyName = webfont.CssFontFamilyName;

  /**
   * Quotes the name.
   * @param {string} name The name to quote.
   * @return {string} The quoted name.
   */
  CssFontFamilyName.prototype.quote = function(name) {
    var quoted = [];
    var split = name.split(/,\s*/);
    for (var i = 0; i < split.length; i++) {
      var part = split[i].replace(/['"]/g, '');
      if (part.indexOf(' ') == -1) {
        quoted.push(part);
      } else {
        quoted.push(this.quote_ + part + this.quote_);
      }
    }
    return quoted.join(',');
  };
});
