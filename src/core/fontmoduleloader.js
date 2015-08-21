goog.provide('webfont.FontModuleLoader');
goog.provide('webfont.FontModuleFactory');

/** @typedef {function(Object, webfont.DomHelper): webfont.FontModule} */
webfont.FontModuleFactory;

/**
 * @constructor
 */
webfont.FontModuleLoader = function() {
  /**
   * @type {Object.<string, webfont.FontModuleFactory>}
   */
  this.modules_ = {};
};

goog.scope(function () {
  var FontModuleLoader = webfont.FontModuleLoader;

  /**
   * @param {string} name
   * @param {webfont.FontModuleFactory} factory
   */
  FontModuleLoader.prototype.addModuleFactory = function(name, factory) {
    this.modules_[name] = factory;
  };

  /**
   * @param {Object} configuration
   * @param {webfont.DomHelper} domHelper
   * @return {Array.<webfont.FontModule>}
   */
  FontModuleLoader.prototype.getModules = function(configuration, domHelper) {
    var modules = [];

    for (var key in configuration) {
      if (configuration.hasOwnProperty(key)) {
        var moduleFactory = this.modules_[key];

        if (moduleFactory) {
          modules.push(moduleFactory(configuration[key], domHelper));
        }
      }
    }
    return modules;
  };
});
