goog.provide('webfont.WebFont');

goog.require('webfont.DomHelper');
goog.require('webfont.EventDispatcher');
goog.require('webfont.FontWatcher');
goog.require('webfont.FontModuleLoader');
goog.require('webfont.UserAgentParser');

/**
 * @param {Window} mainWindow The main application window containing
 *   webfontloader.js.
 * @constructor
 */
webfont.WebFont = function(mainWindow) {
  this.mainWindow_ = mainWindow;
  this.fontModuleLoader_ = new webfont.FontModuleLoader();
  this.userAgentParser_ = new webfont.UserAgentParser(mainWindow.navigator.userAgent, mainWindow.document);
  this.userAgent_ = this.userAgentParser_.parse();
  this.moduleLoading_ = 0;
  this.moduleFailedLoading_ = 0;
};

goog.scope(function () {
  var WebFont = webfont.WebFont,
      DomHelper = webfont.DomHelper,
      EventDispatcher = webfont.EventDispatcher,
      FontWatcher = webfont.FontWatcher;

  /**
   * @param {string} name
   * @param {webfont.FontModuleFactory} factory
   */
  WebFont.prototype.addModule = function(name, factory) {
    this.fontModuleLoader_.addModuleFactory(name, factory);
  };

  /**
   * @param {Object} configuration
   */
  WebFont.prototype.load = function(configuration) {
    var context = configuration['context'] || this.mainWindow_;
    this.domHelper_ = new DomHelper(this.mainWindow_, context);

    var eventDispatcher = new EventDispatcher(
        this.domHelper_, context.document.documentElement, configuration);

    this.load_(eventDispatcher, configuration);
  };

  /**
   * @param {webfont.FontModule} module
   * @param {webfont.EventDispatcher} eventDispatcher
   * @param {webfont.FontWatcher} fontWatcher
   * @param {boolean} support
   */
  WebFont.prototype.isModuleSupportingUserAgent_ = function(module, eventDispatcher,
      fontWatcher, support) {
    var fontWatchRunnerCtor = module.getFontWatchRunnerCtor ?
        module.getFontWatchRunnerCtor() : webfont.FontWatchRunner,
        that = this;

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
      fontWatcher.watch([], {}, fontWatchRunnerCtor, allModulesLoaded);
      return;
    }

    module.load(function (fonts, opt_fontTestStrings) {
      that.onModuleReady_(eventDispatcher, fontWatcher, fontWatchRunnerCtor, fonts, opt_fontTestStrings);
    });
  };

  /**
   * @param {webfont.EventDispatcher} eventDispatcher
   * @param {webfont.FontWatcher} fontWatcher
   * @param {function(new:webfont.FontWatchRunner,
   *                  function(webfont.Font),
   *                  function(webfont.Font),
   *                  webfont.DomHelper,
   *                  webfont.Font,
   *                  webfont.BrowserInfo,
   *                  number=,
   *                  Object.<string, boolean>=,
   *                  string=)} fontWatchRunnerCtor
   * @param {Array.<webfont.Font>} fonts
   * @param {webfont.FontTestStrings=} opt_fontTestStrings
   */
  WebFont.prototype.onModuleReady_ = function(eventDispatcher, fontWatcher,
      fontWatchRunnerCtor, fonts, opt_fontTestStrings) {
    var allModulesLoaded = --this.moduleLoading_ == 0;

    if (allModulesLoaded) {
      eventDispatcher.dispatchLoading();
    }

    setTimeout(function () {
      fontWatcher.watch(fonts, opt_fontTestStrings || {}, fontWatchRunnerCtor, allModulesLoaded);
    }, 0);
  };

  /**
   * @param {webfont.EventDispatcher} eventDispatcher
   * @param {Object} configuration
   */
  WebFont.prototype.load_ = function(eventDispatcher, configuration) {
    var modules = this.fontModuleLoader_.getModules(configuration, this.domHelper_),
        timeout = configuration['timeout'],
        self = this;

    this.moduleFailedLoading_ = this.moduleLoading_ = modules.length;

    var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.domHelper_, eventDispatcher, timeout);

    for (var i = 0, len = modules.length; i < len; i++) {
      var module = modules[i];

      module.supportUserAgent(this.userAgent_,
          goog.bind(this.isModuleSupportingUserAgent_, this, module,
          eventDispatcher, fontWatcher));
    }
  };
});
