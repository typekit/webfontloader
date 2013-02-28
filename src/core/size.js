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
    return this.equalsWidth(other) && this.equalsHeight(other);
  };

  /**
   * Returns true if this.width equals other.width
   * @param {webfont.Size} other
   * @return {boolean}
   */
  Size.prototype.equalsWidth = function (other) {
    return !!other && this.width == other.width;
  };

  /**
   * Returns true if this.height equals other.height
   * @param {webfont.Size} other
   * @return {boolean}
   */
  Size.prototype.equalsHeight = function (other) {
    return !!other && this.height == other.height;
  };
});
