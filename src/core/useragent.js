/**
 * @param {string} name
 * @param {string} version
 * @param {string} engine
 * @param {string} engineVersion
 * @param {string} platform
 * @param {string} platformVersion
 * @param {number|undefined} documentMode
 * @param {boolean} webFontSupport
 * @constructor
 */
webfont.UserAgent = function(name, version, engine, engineVersion, platform,
    platformVersion, documentMode, webFontSupport) {
  this.name_ = name;
  this.version_ = version;
  this.engine_ = engine;
  this.engineVersion_ = engineVersion;
  this.platform_ = platform;
  this.platformVersion_ = platformVersion;
  this.documentMode_ = documentMode;
  this.webFontSupport_ = webFontSupport;
};

/**
 * @return {string}
 */
webfont.UserAgent.prototype.getName = function() {
  return this.name_;
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
  return this.webFontSupport_;
};
