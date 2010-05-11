webfont.TypekitScript = function(global, domHelper, configuration) {
  this.global_ = global;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.TypekitScript.NAME = 'typekit';

webfont.TypekitScript.prototype.getScriptSrc = function(kitId) {
  var api = this.configuration_['api'] || 'http://use.typekit.com'
  return api + '/' + kitId + '.js';
};

webfont.TypekitScript.prototype.supportUserAgent = function(userAgent, support) {
  if (userAgent.getName() == "Opera") {
      support(false);
  }
  return support(userAgent.isSupportingWebFont());
};

webfont.TypekitScript.prototype.load = function(onReady) {
  var kitId = this.configuration_['id'];

  if (kitId) {
    this.domHelper_.insertInto('head', this.domHelper_.createScriptSrc(
        this.getScriptSrc(kitId)));

    // Set up global listener so that Typekit can tell us the fonts it will provide.
    if (!this.global_.__typekitScriptModules__) {
      this.global_.__typekitScriptModules__ = {};
    }
    this.global_.__typekitScriptModules__[kitId] = onReady;
  }
};

WebFont.addModule(webfont.TypekitScript.NAME, function(configuration) {
  return new webfont.TypekitScript(window, new webfont.DomHelper(document), configuration);
});
