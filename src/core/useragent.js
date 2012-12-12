/**
 * @param {string} name
 * @param {string} version
 * @param {string} engine
 * @param {string} engineVersion
 * @param {string} platform
 * @param {string} platformVersion
 * @param {number|undefined} documentMode
 * @param {Object.<webfont.UserAgent.BrowserInfo, boolean>} browserInfo
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
  this.browserInfo_ = browserInfo || {};
};

/**
 * @enum {number}
 */
webfont.UserAgent.BrowserInfo = {
  HAS_WEBFONT_SUPPORT: 1,
  WEBKIT_FALLBACK_BUG: 2
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getName = function() {
  return this.name_;
};

/**
 * @param {webfont.UserAgent.BrowserInfo} property
 * @return {boolean}
 */
webfont.UserAgent.prototype.getInfo = function(property) {
  return !!this.browserInfo_[property];
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getVersion = function() {
  return this.version_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getEngine = function() {
  return this.engine_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getEngineVersion = function() {
  return this.engineVersion_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getPlatform = function() {
  return this.platform_;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getPlatformVersion = function() {
  return this.platformVersion_;
};

/**
 * @return {number|undefined}
 */
webfont.UserAgent.prototype.getDocumentMode = function() {
  return this.documentMode_;
};

/**
 * @return {boolean}
 */
webfont.UserAgent.prototype.isSupportingWebFont = function() {
  return this.getInfo(webfont.UserAgent.BrowserInfo.HAS_WEBFONT_SUPPORT);
};
