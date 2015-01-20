goog.provide('webfont.UserAgent');

/**
 * A user agent string representation.
 *
 * @param {string} name
 * @param {webfont.Version} version
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
    engine,
    engineVersion,
    platform,
    platformVersion,
    documentMode,
    browserInfo) {
  this.name_ = name;
  this.version_ = version;
  this.engine_ = engine;
  this.engineVersion_ = engineVersion;
  this.platform_ = platform;
  this.platformVersion_ = platformVersion;
  this.documentMode_ = documentMode;
  this.browserInfo_ = browserInfo;
};

goog.scope(function () {
  var UserAgent = webfont.UserAgent;

  /**
   * @return {string}
   */
  UserAgent.prototype.getName = function() {
    return this.name_;
  };

  /**
   * @return {webfont.Version}
   */
  UserAgent.prototype.getVersion = function() {
    return this.version_;
  };

  /**
   * @return {string}
   */
  UserAgent.prototype.getEngine = function() {
    return this.engine_;
  };

  /**
   * @return {webfont.Version}
   */
  UserAgent.prototype.getEngineVersion = function() {
    return this.engineVersion_;
  };

  /**
   * @return {string}
   */
  UserAgent.prototype.getPlatform = function() {
    return this.platform_;
  };

  /**
   * @return {webfont.Version}
   */
  UserAgent.prototype.getPlatformVersion = function() {
    return this.platformVersion_;
  };

  /**
   * @return {number|undefined}
   */
  UserAgent.prototype.getDocumentMode = function() {
    return this.documentMode_;
  };

  /**
   * @return {webfont.BrowserInfo}
   */
  UserAgent.prototype.getBrowserInfo = function() {
    return this.browserInfo_;
  };
});
