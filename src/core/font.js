goog.provide('webfont.WebFont');

goog.require('webfont.DomHelper');
goog.require('webfont.EventDispatcher');
goog.require('webfont.FontWatcher');
goog.require('webfont.Size');

/**
 * @param {Window} mainWindow The main application window containing
 *   webfontloader.js.
 * @param {webfont.FontModuleLoader} fontModuleLoader A loader instance to use.
 * @param {function(function(), number)} asyncCall An async function to use.
 * @param {webfont.UserAgent} userAgent The detected user agent to load for.
 * @constructor
 */
webfont.WebFont = function(mainWindow, fontModuleLoader, asyncCall, userAgent) {
  this.mainWindow_ = mainWindow;
  this.fontModuleLoader_ = fontModuleLoader;
  this.asyncCall_ = asyncCall;
  this.userAgent_ = userAgent;
  this.moduleLoading_ = 0;
  this.moduleFailedLoading_ = 0;
};

goog.scope(function () {
  var WebFont = webfont.WebFont,
      DomHelper = webfont.DomHelper,
      EventDispatcher = webfont.EventDispatcher,
      FontWatcher = webfont.FontWatcher,
      Size = webfont.Size;

  WebFont.prototype.addModule = function(name, factory) {
    this.fontModuleLoader_.addModuleFactory(name, factory);
  };

  WebFont.prototype.load = function(configuration) {
    var context = configuration['context'] || this.mainWindow_;
    this.domHelper_ = new DomHelper(this.mainWindow_, context);

    var eventDispatcher = new EventDispatcher(
        this.domHelper_, context.document.documentElement, configuration);

    if (this.userAgent_.getBrowserInfo().hasWebFontSupport()) {
      this.load_(eventDispatcher, configuration);
    } else {
      eventDispatcher.dispatchInactive();
    }
  };

  WebFont.prototype.isModuleSupportingUserAgent_ = function(module, eventDispatcher,
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
    module.load(goog.bind(this.onModuleReady_, this, eventDispatcher,
        fontWatcher, fontWatchRunnerCtor));
  };

  WebFont.prototype.onModuleReady_ = function(eventDispatcher, fontWatcher,
      fontWatchRunnerCtor, fontFamilies, opt_fontDescriptions, opt_fontTestStrings) {
    var allModulesLoaded = --this.moduleLoading_ == 0;

    if (allModulesLoaded) {
      eventDispatcher.dispatchLoading();
    }
    this.asyncCall_(goog.bind(function(_fontWatcher, _fontFamilies,
        _fontDescriptions, _fontTestStrings, _fontWatchRunnerCtor,
        _allModulesLoaded) {
          _fontWatcher.watch(_fontFamilies, _fontDescriptions || {},
            _fontTestStrings || {}, _fontWatchRunnerCtor, _allModulesLoaded);
        }, this, fontWatcher, fontFamilies, opt_fontDescriptions, opt_fontTestStrings,
        fontWatchRunnerCtor, allModulesLoaded), 0);
  };

  WebFont.prototype.load_ = function(eventDispatcher, configuration) {
    var modules = this.fontModuleLoader_.getModules(configuration, this.domHelper_),
        self = this;

    this.moduleFailedLoading_ = this.moduleLoading_ = modules.length;

    var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.domHelper_,
        eventDispatcher, {
          getSize: function(elem) {
            return new Size(elem.offsetWidth, elem.offsetHeight);
          }}, self.asyncCall_);

    for (var i = 0, len = modules.length; i < len; i++) {
      var module = modules[i];

      module.supportUserAgent(this.userAgent_,
          goog.bind(this.isModuleSupportingUserAgent_, this, module,
          eventDispatcher, fontWatcher));
    }
  };
});
