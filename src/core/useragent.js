/**
 * @constructor
 */
webfont.UserAgent = function(name, version, engine, engineVersion, platform,
    webFontSupport) {
  this.name_ = name;
  this.version_ = version;
  this.engine_ = engine;
  this.engineVersion_ = engineVersion;
  this.platform_ = platform;
  this.webFontSupport_ = webFontSupport;
};

webfont.UserAgent.prototype.getName = function() {
  return this.name_;
};

webfont.UserAgent.prototype.getVersion = function() {
  return this.version_;
};

webfont.UserAgent.prototype.getEngine = function() {
  return this.engine_;
};

webfont.UserAgent.prototype.getEngineVersion = function() {
  return this.engineVersion_;
};

webfont.UserAgent.prototype.getPlatform = function() {
  return this.platform_;
};

webfont.UserAgent.prototype.isSupportingWebFont = function() {
  return this.webFontSupport_;
};
