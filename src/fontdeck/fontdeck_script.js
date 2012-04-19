/**
 * @constructor
 */
webfont.FontdeckScript = function(global, domHelper, configuration) {
  this.global_ = global;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
  this.fontVariations_ = {};
  this.fvd_ = new webfont.FontVariationDescription();
};

webfont.FontdeckScript.NAME = 'fontdeck';
webfont.FontdeckScript.HOOK = '__webfontfontdeckmodule__';
webfont.FontdeckScript.API = '//f.fontdeck.com/s/css/js/';

webfont.FontdeckScript.prototype.getScriptSrc = function(projectId) {
  var protocol = 'https:' == this.global_.location.protocol ? 'https:' : 'http:';
  var api = this.configuration_['api'] || webfont.FontdeckScript.API;
  return protocol + api + this.global_.document.location.hostname + '/' + projectId + '.js';
};

webfont.FontdeckScript.prototype.supportUserAgent = function(userAgent, support) {
  var projectId = this.configuration_['id'];
  var self = this;

  if (projectId) {
    // Provide data to Fontdeck for processing.
    if (!this.global_[webfont.FontdeckScript.HOOK]) {
      this.global_[webfont.FontdeckScript.HOOK] = {};
    }

    // Fontdeck will call this function to indicate support status
    // and what fonts are provided.
    this.global_[webfont.FontdeckScript.HOOK][projectId] = function(fontdeckSupports, data) {
      for (var i = 0, j = data['fonts'].length; i<j; ++i) {
        var font = data['fonts'][i];
        // Add the FVDs
        self.fontFamilies_.push(font['name']);
        self.fontVariations_[font['name']] = [self.fvd_.compact("font-weight:" + font['weight'] + ";font-style:" + font['style'])];
      }
      support(fontdeckSupports);
    };

    // Call the Fontdeck API.
    var script = this.domHelper_.createScriptSrc(this.getScriptSrc(projectId));
    this.domHelper_.insertInto('head', script);

  } else {
    support(true);
  }
};

webfont.FontdeckScript.prototype.load = function(onReady) {
  onReady(this.fontFamilies_, this.fontVariations_);
};

window['WebFont'].addModule(webfont.FontdeckScript.NAME, function(configuration) {
  var domHelper = new webfont.DomHelper(document);
  return new webfont.FontdeckScript(window, domHelper, configuration);
});