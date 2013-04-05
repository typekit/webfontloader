goog.provide('webfont.Version');

/**
 * Represents a version as used in user agent strings. Note
 * that this does not represent any sort of reliable versioning
 * scheme (like Semantic Versioning) but merely a best effort
 * at parsing a large amount of wildly different version strings.
 *
 * @constructor
 * @param {number=} opt_major
 * @param {number=} opt_minor
 * @param {number=} opt_patch
 * @param {string=} opt_build
 */
webfont.Version = function(opt_major, opt_minor, opt_patch, opt_build) {
  this.major = goog.isDefAndNotNull(opt_major) ? opt_major : null;
  this.minor = goog.isDefAndNotNull(opt_minor) ? opt_minor : null;
  this.patch = goog.isDefAndNotNull(opt_patch) ? opt_patch : null;
  this.build = goog.isDefAndNotNull(opt_build) ? opt_build : null;
}

goog.scope(function () {
  var Version = webfont.Version;

  Version.TOKENIZER = new RegExp(
    "^" +
    "([0-9]+)" +            // major
    "(?:" +
      "[\\._-]([0-9]+)" +   // minor
    ")?" +
    "(?:" +
      "[\\._-]([0-9]+)" +  // patch
    ")?" +
    "(?:" +
      "[\\._+-]?(.*)" +    // build
    ")?$"
  );

  /**
   * Returns true if the version is valid. A
   * version is considered valid if it has at
   * least a major version number.
   *
   * @return {boolean}
   */
  Version.prototype.isValid = function () {
    return !goog.isNull(this.major);
  };

  /**
   * @param {string} str
   * @return {!webfont.Version}
   */
  Version.parse = function (str) {
    var match = Version.TOKENIZER.exec(str),
        major = null,
        minor = null,
        patch = null,
        build = null;

    if (match) {
      if (!goog.isNull(match[1]) && !!match[1]) {
        major = parseInt(match[1], 10);
      }

      if (!goog.isNull(match[2]) && !!match[2]) {
        minor = parseInt(match[2], 10);
      }

      if (!goog.isNull(match[3]) && !!match[3]) {
        patch = parseInt(match[3], 10);
      }

      if (!goog.isNull(match[4]) && !!match[4]) {
        build = match[4];
      }
    }

    return new Version(major, minor, patch, build);
  };
});
