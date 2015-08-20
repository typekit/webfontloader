describe('FontModuleLoader', function () {
  var FontModuleLoader = webfont.FontModuleLoader;

  describe('#getModules', function () {
    var fontModuleLoader = null;

    beforeEach(function () {
      fontModuleLoader = new FontModuleLoader();
    });

    it('should return an empty array without modules', function () {
      var modules = fontModuleLoader.getModules();

      expect(modules).not.toBeNull();
      expect(modules.length).toEqual(0);
    });

    it('should have modules', function () {
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

      expect(modules).not.toBeNull();
      expect(modules.length).toEqual(2);

      var module = modules[0];
      expect(module).not.toBeNull();
      expect(module.scary || module.cowy).toBe(true);

      var module = modules[1];
      expect(module).not.toBeNull();
      expect(module.scary || module.cowy).toBe(true);
    });
  });
});
