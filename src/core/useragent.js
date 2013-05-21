goog.provide('webfont.UserAgent');

/**
 * A user agent string representation.
 *
 * This currently keeps a string and parsed `Version` representation
 * of version strings. This is done for backwards compatibility with
 * older versions of Typekit's KitJS when loaded through the Web Font
 * Loader. The old string based API is deprecated and will eventually
 * be removed.
 *
 * @export
 * @param {string} name
 * @param {webfont.Version} version
 * @param {string} versionString
 * @param {string} engine
 * @param {webfont.Version} engineVersion
 * @param {string} platform
 * @param {webfont.Version} platformVersion
 * @param {number|undefined} documentMode
 * @param {!webfont.BrowserInfo} browserInfo
 * @constructor
 */
webfont.UserAgent = function(
    name,
    version,
    versionString,
    engine,
    engineVersion,
    engineVersionString,
    platform,
    platformVersion,
    platformVersionString,
    documentMode,
    browserInfo) {
  this.name_ = name;
  this.version_ = version;
  this.versionString_ = versionString;
  this.engine_ = engine;
  this.engineVersion_ = engineVersion;
  this.engineVersionString_ = engineVersionString;
  this.platform_ = platform;
  this.platformVersion_ = platformVersion;
  this.platformVersionString_ = platformVersionString;
  this.documentMode_ = documentMode;
  this.browserInfo_ = browserInfo;
};

goog.scope(function () {
  var UserAgent = webfont.UserAgent;

  /**
   * @export
   * @return {string}
   */
  UserAgent.prototype.getName = function() {
    return this.name_;
  };

  /**
   * @export
   * @deprecated
   * @return {string}
   */
  UserAgent.prototype.getVersion = function() {
    return this.versionString_;
  };

  /**
   * @return {webfont.Version}
   */
  UserAgent.prototype.getParsedVersion = function() {
    return this.version_;
  };

  /**
   * @export
   * @return {string}
   */
  UserAgent.prototype.getEngine = function() {
    return this.engine_;
  };

  /**
   * @export
   * @deprecated
   * @return {string}
   */
  UserAgent.prototype.getEngineVersion = function() {
    return this.engineVersionString_;
  };

  /**
   * @return {webfont.Version}
   */
  UserAgent.prototype.getParsedEngineVersion = function() {
    return this.engineVersion_;
  };

  /**
   * @export
   * @return {string}
   */
  UserAgent.prototype.getPlatform = function() {
    return this.platform_;
  };

  /**
   * @export
   * @deprecated
   * @return {string}
   */
  UserAgent.prototype.getPlatformVersion = function() {
    return this.platformVersionString_;
  };

  /**
   * @return {webfont.Version}
   */
  UserAgent.prototype.getParsedPlatformVersion = function() {
    return this.platformVersion_;
  };

  /**
   * @export
   * @return {number|undefined}
   */
  UserAgent.prototype.getDocumentMode = function() {
    return this.documentMode_;
  };

  /**
   * @export
   * @return {webfont.BrowserInfo}
   */
  UserAgent.prototype.getBrowserInfo = function() {
    return this.browserInfo_;
  };
});
