describe('FontModuleLoader', function () {
  var FontModuleLoader = webfont.FontModuleLoader;

  describe('#getModules', function () {
    var fontModuleLoader = new FontModuleLoader();

    it('should return an array', function () {
      var modules = fontModuleLoader.getModules();

      expect(modules).not.toBeNull();
      expect(modules.length).toEqual(0);
    });

    fontModuleLoader.addModuleFactory('booh', function () {
      return {
        scary: true
      };
    });

    fontModuleLoader.addModuleFactory('haha', function () {
      return {
        funny: true
      };
    });

    fontModuleLoader.addModuleFactory('moo', function () {
      return {
        cowy: true
      };
    });

    var modules = fontModuleLoader.getModules({
      booh: {},
      moo: {},
      nothing: {}
    });

    it('should have modules', function () {
      expect(modules).not.toBeNull();
      expect(modules.length).toEqual(2);
    });

    it('should have a valid module 1', function () {
      var module = modules[0];
      expect(module).not.toBeNull();
      expect(module.scary || module.cowy).toBe(true);
    });

    it('should have a valid module 2', function () {
      var module = modules[1];
      expect(module).not.toBeNull();
      expect(module.scary || module.cowy).toBe(true);
    });
  });
});
