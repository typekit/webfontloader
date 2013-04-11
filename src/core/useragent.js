goog.provide('webfont.UserAgent');

/**
 * @export
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
webfont.UserAgent = function(name, version, engine, engineVersion, platform,
    platformVersion, documentMode, browserInfo) {
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
   * @export
   * @return {string}
   */
  UserAgent.prototype.getName = function() {
    return this.name_;
  };

  /**
   * @export
   * @return {webfont.Version}
   */
  UserAgent.prototype.getVersion = function() {
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
   * @return {webfont.Version}
   */
  UserAgent.prototype.getEngineVersion = function() {
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
   * @return {webfont.Version}
   */
  UserAgent.prototype.getPlatformVersion = function() {
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
