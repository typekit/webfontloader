webfont.WebFont = function(domHelper, fontModuleLoader, htmlElement, asyncCall,
    userAgent) {
  this.domHelper_ = domHelper;
  this.fontModuleLoader_ = fontModuleLoader;
  this.htmlElement_ = htmlElement;
  this.asyncCall_ = asyncCall;
  this.userAgent_ = userAgent;
  this.moduleLoading_ = 0;
  this.moduleFailedLoading_ = 0;
};

webfont.WebFont.prototype.addModule = function(name, factory) {
  this.fontModuleLoader_.addModuleFactory(name, factory);
};

webfont.WebFont.prototype.load = function(configuration) {
  var eventDispatcher = new webfont.EventDispatcher(
      this.domHelper_, this.htmlElement_, configuration);

  if (this.userAgent_.isSupportingWebFont()) {
    this.load_(eventDispatcher, configuration);
  } else {
    eventDispatcher.dispatchInactive();
  }
};

webfont.WebFont.prototype.isModuleSupportingUserAgent_ = function(module, eventDispatcher,
    fontWatcher, support) {
  if (!support) {
    var allModulesLoaded = --this.moduleLoading_ == 0;

    this.moduleFailedLoading_--;
    if (allModulesLoaded) {
      if (this.moduleFailedLoading_ == 0) {
        eventDispatcher.dispatchInactive();
      } else {
        eventDispatcher.dispatchLoading();
      }
    }
    fontWatcher.watch([], allModulesLoaded);
    return;
  }
  module.load(webfont.bind(this, this.onModuleReady_, eventDispatcher,
      fontWatcher));
};

webfont.WebFont.prototype.onModuleReady_ = function(eventDispatcher, fontWatcher,
    fontFamilies, opt_variations) {
  var allModulesLoaded = --this.moduleLoading_ == 0;

  if (allModulesLoaded) {
    eventDispatcher.dispatchLoading();
  }
  this.asyncCall_(webfont.bind(this, function(_fontWatcher, _fontFamilies,
      _allModulesLoaded, _opt_variations) {
    _fontWatcher.watch(_fontFamilies, _opt_variations, _allModulesLoaded);
  }, fontWatcher, fontFamilies, opt_variations, allModulesLoaded));
};

webfont.WebFont.prototype.load_ = function(eventDispatcher, configuration) {
  var modules = this.fontModuleLoader_.getModules(configuration),
      self = this;

  this.moduleFailedLoading_ = this.moduleLoading_ = modules.length;

  var fontWatcher = new webfont.FontWatcher(this.domHelper_,
      eventDispatcher, {
        getWidth: function(elem) {
          return elem.offsetWidth;
        }}, self.asyncCall_, function() {
          return +new Date();
        });

  for (var i = 0, len = modules.length; i < len; i++) {
    var module = modules[i];

    module.supportUserAgent(this.userAgent_,
        webfont.bind(this, this.isModuleSupportingUserAgent_, module,
        eventDispatcher, fontWatcher));
  }
};

window['webfont']['WebFont'] = webfont.WebFont;
webfont.WebFont.prototype['load'] = webfont.WebFont.prototype.load;
webfont.WebFont.prototype['addModule'] = webfont.WebFont.prototype.addModule;
window['WebFont'] = function() {
  var domHelper = new webfont.DomHelper(document);
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent);
  var userAgent = userAgentParser.parse();

  return new webfont.WebFont(domHelper, new webfont.FontModuleLoader(),
      document.documentElement, function(func, timeout) {
        setTimeout(func, timeout);
      }, userAgent);
}();
