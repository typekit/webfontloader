webfont.TypekitScript = function(global, domHelper, configuration) {
  this.global_ = global;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
};

webfont.TypekitScript.NAME = 'typekit';

webfont.TypekitScript.prototype.getScriptSrc = function(kitId) {
  var api = this.configuration_['api'] || 'http://use.typekit.com';
  return api + '/' + kitId + '.js';
};

webfont.TypekitScript.prototype.supportUserAgent = function(userAgent, support) {
  var kitId = this.configuration_['id'];
  var self = this;

  if (kitId) {
    // Provide WebFont JS data to Typekit for processing.
    if (!this.global_.__typekitScriptModules__) {
      this.global_.__typekitScriptModules__ = {};
    }

    // Typekit will call 'init' to indicate whether it supports fonts
    // and what fonts will be provided.
    this.global_.__typekitScriptModules__[kitId] = {
      'ua': userAgent,
      'init': function(typekitSupports, fontFamilies) {
        self.fontFamilies_ = fontFamilies;
        support(typekitSupports);
      }
    };

    // Load the Typekit script.
    var script = this.domHelper_.createScriptSrc(this.getScriptSrc(kitId))
    this.domHelper_.insertInto('head', script);

  } else {
    // NOTE: is this right?
    support(true);
  }
};

webfont.TypekitScript.prototype.load = function(onReady) {
  onReady(this.fontFamilies_);
};

WebFont.addModule(webfont.TypekitScript.NAME, function(configuration) {
  return new webfont.TypekitScript(window, new webfont.DomHelper(document), configuration);
});
