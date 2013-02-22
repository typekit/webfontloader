goog.provide('webfont.Size');

/**
 * @constructor
 * @param {number} width
 * @param {number} height
 */
webfont.Size = function (width, height) {
  this.width = width;
  this.height = height;
};

goog.scope(function () {
  var Size = webfont.Size;

  /**
   * Returns true if this size equals other.
   *
   * @param {webfont.Size} other
   * @return {boolean}
   */
  Size.prototype.equals = function (other) {
    return !!other && this.width == other.width && this.height == other.height;
  };
});
