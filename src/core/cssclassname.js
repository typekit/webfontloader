goog.provide('webfont.CssClassName');

/**
 * Handles sanitization and construction of css class names.
 * @param {string=} opt_joinChar The character to join parts of the name on.
 *    Defaults to '-'.
 * @constructor
 */
webfont.CssClassName = function(opt_joinChar) {
  /** @type {string} */
  this.joinChar_ = opt_joinChar || webfont.CssClassName.DEFAULT_JOIN_CHAR;
};

/**
 * @const
 * @type {string}
 */
webfont.CssClassName.DEFAULT_JOIN_CHAR = '-';

goog.scope(function () {
  var CssClassName = webfont.CssClassName;

  /**
   * Sanitizes a string for use as a css class name. Removes non-word and
   * underscore characters.
   * @param {string} name The string.
   * @return {string} The sanitized string.
   */
  CssClassName.prototype.sanitize = function(name) {
    return name.replace(/[\W_]+/g, '').toLowerCase();
  };

  /**
   * Builds a complete css class name given a variable number of parts.
   * Sanitizes, then joins the parts together.
   * @param {...string} var_args The parts to join.
   * @return {string} The sanitized and joined string.
   */
  CssClassName.prototype.build = function(var_args) {
    var parts = []
    for (var i = 0; i < arguments.length; i++) {
      parts.push(this.sanitize(arguments[i]));
    }
    return parts.join(this.joinChar_);
  };
});
