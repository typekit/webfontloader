webfont.TypekitScript = function(kitId, global, domHelper) {
  this.kitId_ = kitId;
  this.global_ = global;
  this.domHelper_ = domHelper;
};

webfont.TypekitScript.NAME = 'typekit';

webfont.TypekitScript.prototype.getScriptSrc = function() {
  return 'http://use.typekit.com/' + this.kitId_ + '.js';
};

webfont.TypekitScript.prototype.supportUserAgent = function(userAgent, support) {
  if (userAgent.getName() == "Opera") {
      support(false);
  }
  return support(userAgent.isSupportingWebFont());
};

webfont.TypekitScript.prototype.load = function(onReady) {
  this.domHelper_.insertInto('head', this.domHelper_.createScriptSrc(
      this.getScriptSrc()));

  // Set up global listener so that Typekit can tell us the fonts it will provide.
  if (!this.global_.__typekitScriptModules__) {
    this.global_.__typekitScriptModules__ = {};
  }
  this.global_.__typekitScriptModules__[this.kitId_] = function(fontFamilyNames) {
    onReady(fontFamilyNames);
  };
};

WebFont.addModule(webfont.TypekitScript.NAME, function(kitId) {
  return new webfont.TypekitScript(kitId, window, new webfont.DomHelper(document));
});
