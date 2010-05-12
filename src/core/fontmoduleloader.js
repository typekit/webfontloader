webfont.FontModuleLoader = function() {
  this.modules_ = {};
};

webfont.FontModuleLoader.prototype.addModuleFactory = function(name, factory) {
  this.modules_[name] = factory;
};

webfont.FontModuleLoader.prototype.getModules = function(configuration) {
  var modules = [];

  for (var key in configuration) {
    if (configuration.hasOwnProperty(key)) {
      var moduleFactory = this.modules_[key];

      if (moduleFactory) {
        modules.push(moduleFactory(configuration[key]));
      }
    }
  }
  return modules;
};
