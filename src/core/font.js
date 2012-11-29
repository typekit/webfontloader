/**
 * @constructor
 */
webfont.WebFont = function(fontModuleLoader, asyncCall, userAgent) {
  this.fontModuleLoader_ = fontModuleLoader;
  this.asyncCall_ = asyncCall;
  this.userAgent_ = userAgent;
  this.moduleLoading_ = 0;
  this.moduleFailedLoading_ = 0;
};

webfont.WebFont.prototype.addModule = function(name, factory) {
  this.fontModuleLoader_.addModuleFactory(name, factory);
};

webfont.WebFont.prototype.load = function(configuration, opt_context) {
  var context = opt_context || window;
  this.domHelper_ = new webfont.DomHelper(context.document);
  this.htmlElement_ = context.document.documentElement;

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
  var fontWatchRunnerCtor = module.getFontWatchRunnerCtor ?
      module.getFontWatchRunnerCtor() : webfont.FontWatchRunner;
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
    fontWatcher.watch([], {}, {}, fontWatchRunnerCtor, allModulesLoaded);
    return;
  }
  module.load(webfont.bind(this, this.onModuleReady_, eventDispatcher,
      fontWatcher, fontWatchRunnerCtor));
};

webfont.WebFont.prototype.onModuleReady_ = function(eventDispatcher, fontWatcher,
    fontWatchRunnerCtor, fontFamilies, opt_fontDescriptions, opt_fontTestStrings) {
  var allModulesLoaded = --this.moduleLoading_ == 0;

  if (allModulesLoaded) {
    eventDispatcher.dispatchLoading();
  }
  this.asyncCall_(webfont.bind(this, function(_fontWatcher, _fontFamilies,
      _fontDescriptions, _fontTestStrings, _fontWatchRunnerCtor,
      _allModulesLoaded) {
        _fontWatcher.watch(_fontFamilies, _fontDescriptions || {},
          _fontTestStrings || {}, _fontWatchRunnerCtor, _allModulesLoaded);
      }, fontWatcher, fontFamilies, opt_fontDescriptions, opt_fontTestStrings,
      fontWatchRunnerCtor, allModulesLoaded));
};

webfont.WebFont.prototype.load_ = function(eventDispatcher, configuration) {
  var modules = this.fontModuleLoader_.getModules(configuration, this.domHelper_),
      self = this;

  this.moduleFailedLoading_ = this.moduleLoading_ = modules.length;

  var fontWatcher = new webfont.FontWatcher(this.domHelper_,
      eventDispatcher, {
        getWidth: function(elem) {
          return elem.offsetWidth;
        }}, self.asyncCall_, function() {
          return new Date().getTime();
        });

  for (var i = 0, len = modules.length; i < len; i++) {
    var module = modules[i];

    module.supportUserAgent(this.userAgent_,
        webfont.bind(this, this.isModuleSupportingUserAgent_, module,
        eventDispatcher, fontWatcher));
  }
};
