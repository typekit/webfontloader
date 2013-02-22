goog.provide('webfont.FontModuleLoader');

/**
 * @constructor
 */
webfont.FontModuleLoader = function() {
  this.modules_ = {};
};

goog.scope(function () {
  var FontModuleLoader = webfont.FontModuleLoader;

  FontModuleLoader.prototype.addModuleFactory = function(name, factory) {
    this.modules_[name] = factory;
  };

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
