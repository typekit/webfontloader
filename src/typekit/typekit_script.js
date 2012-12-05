/**
 * @constructor
 */
webfont.TypekitScript = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
  this.fontVariations_ = {};
};

webfont.TypekitScript.NAME = 'typekit';
webfont.TypekitScript.HOOK = '__webfonttypekitmodule__';

webfont.TypekitScript.prototype.getScriptSrc = function(kitId) {
  var protocol = this.domHelper_.getProtocol();
  var api = this.configuration_['api'] || protocol + '//use.typekit.com';
  return api + '/' + kitId + '.js';
};

webfont.TypekitScript.prototype.supportUserAgent = function(userAgent, support) {
  var kitId = this.configuration_['id'];
  var configuration = this.configuration_;
  var mainWindow = this.domHelper_.getMainWindow();
  var self = this;

  if (kitId) {
    // Provide data to Typekit for processing.
    if (!mainWindow[webfont.TypekitScript.HOOK]) {
      mainWindow[webfont.TypekitScript.HOOK] = {};
    }

    // Typekit will call 'init' to indicate whether it supports fonts
    // and what fonts will be provided.
    mainWindow[webfont.TypekitScript.HOOK][kitId] = function(callback) {
      var init = function(typekitSupports, fontFamilies, fontVariations) {
        self.fontFamilies_ = fontFamilies;
        self.fontVariations_ = fontVariations;
        support(typekitSupports);
      };
      callback(userAgent, configuration, init);
    };

    // Load the Typekit script.
    var script = this.domHelper_.createScriptSrc(this.getScriptSrc(kitId))
    this.domHelper_.insertInto('head', script);

  } else {
    support(true);
  }
};

webfont.TypekitScript.prototype.load = function(onReady) {
  onReady(this.fontFamilies_, this.fontVariations_);
};

globalNamespaceObject.addModule(webfont.TypekitScript.NAME, function(configuration, domHelper) {
  return new webfont.TypekitScript(domHelper, configuration);
});

