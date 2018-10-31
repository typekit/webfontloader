goog.provide('webfont.WebFont');

goog.require('webfont.DomHelper');
goog.require('webfont.EventDispatcher');
goog.require('webfont.FontWatcher');
goog.require('webfont.FontModuleLoader');
goog.require('webfont.FontModulesLoadCounter');

/**
 * @param {Window} mainWindow The main application window containing
 *   webfontloader.js.
 * @constructor
 */
webfont.WebFont = function(mainWindow) {
  this.mainWindow_ = mainWindow;
  this.fontModuleLoader_ = new webfont.FontModuleLoader();
  this.events_ = true;
  this.classes_ = true;
};

goog.scope(function () {
  var WebFont = webfont.WebFont,
      DomHelper = webfont.DomHelper,
      EventDispatcher = webfont.EventDispatcher,
      FontWatcher = webfont.FontWatcher,
      FontModulesLoadCounter = webfont.FontModulesLoadCounter;

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
   * @param {webfont.EventDispatcher} eventDispatcher
   * @param {webfont.FontWatcher} fontWatcher
   * @param {Array.<webfont.Font>} fonts
   * @param {webfont.FontTestStrings=} opt_fontTestStrings
   * @param {Object.<string, boolean>=} opt_metricCompatibleFonts
   */
  WebFont.prototype.onModuleReady_ = function(eventDispatcher, fontWatcher, fonts, lastModule, opt_fontTestStrings, opt_metricCompatibleFonts) {
    if (this.classes_ || this.events_) {
      setTimeout(function () {
        fontWatcher.watchFonts(fonts, opt_fontTestStrings || null, opt_metricCompatibleFonts || null, lastModule);
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

    var fontWatcher = new FontWatcher(this.domHelper_, eventDispatcher, timeout);
    var fontModulesLoadCounter = new FontModulesLoadCounter(modules.length);

    for (var i = 0, len = modules.length; i < len; i++) {
      var module = modules[i];
      module.load(function (fonts, opt_fontTestStrings, opt_metricCompatibleFonts) {
        fontModulesLoadCounter.decrement();
        var wasLastModule = fontModulesLoadCounter.count() == 0;
        self.onModuleReady_(eventDispatcher, fontWatcher, fonts, wasLastModule, opt_fontTestStrings, opt_metricCompatibleFonts);
      });
    }
  };
});
