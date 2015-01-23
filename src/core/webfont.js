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
  this.events_ = true;
  this.classes_ = true;
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

    this.events_ = configuration['events'] !== false;
    this.classes_ = configuration['classes'] !== false;

    var eventDispatcher = new EventDispatcher(
        this.domHelper_,
        configuration
    );

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
    var that = this;

    if (support) {
      module.load(function (fonts, opt_fontTestStrings, opt_metricCompatibleFonts) {
        that.onModuleReady_(eventDispatcher, fontWatcher, fonts, opt_fontTestStrings, opt_metricCompatibleFonts);
      });
    } else {
      var allModulesLoaded = --this.moduleLoading_ == 0;

      this.moduleFailedLoading_--;

      if (allModulesLoaded && this.moduleFailedLoading_ == 0) {
        eventDispatcher.dispatchInactive();
      } else {
        if (this.classes_ || this.events_) {
          fontWatcher.watchFonts([], {}, null, allModulesLoaded);
        }
      }
    }
  };

  /**
   * @param {webfont.EventDispatcher} eventDispatcher
   * @param {webfont.FontWatcher} fontWatcher
   * @param {Array.<webfont.Font>} fonts
   * @param {webfont.FontTestStrings=} opt_fontTestStrings
   * @param {Object.<string, boolean>=} opt_metricCompatibleFonts
   */
  WebFont.prototype.onModuleReady_ = function(eventDispatcher, fontWatcher, fonts, opt_fontTestStrings, opt_metricCompatibleFonts) {
    var allModulesLoaded = --this.moduleLoading_ == 0;

    if (this.classes_ || this.events_) {
      setTimeout(function () {
        fontWatcher.watchFonts(fonts, opt_fontTestStrings || null, opt_metricCompatibleFonts || null, allModulesLoaded);
      }, 0);
    }
  };

  /**
   * @param {webfont.EventDispatcher} eventDispatcher
   * @param {Object} configuration
   */
  WebFont.prototype.load_ = function(eventDispatcher, configuration) {
    var modules = [],
        timeout = configuration['timeout'],
        self = this;

    // Immediately dispatch the loading event before initializing the modules
    // so we know for sure that the loading event is synchronous.
    eventDispatcher.dispatchLoading();

    modules = this.fontModuleLoader_.getModules(configuration, this.domHelper_);

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
