describe('WebFont', function () {
  var WebFont = webfont.WebFont,
      Font = webfont.Font;
      FontWatchRunner = webfont.FontWatchRunner,
      NativeFontWatchRunner = webfont.NativeFontWatchRunner,
      Version = webfont.Version,
      Font = webfont.Font,
      FontModuleLoader = webfont.FontModuleLoader,
      fontModuleLoader = null;

  beforeEach(function () {
    fontModuleLoader = new FontModuleLoader();
  });

  describe('font load with context', function () {
    var font = null,
        testModule = null,
        fakeMainWindow = {
          document: {}
        };

    beforeEach(function () {
      font = new WebFont(fakeMainWindow);
      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {
          this.domHelper = domHelper;
        };
        testModule.load = function (onReady) {
          onReady([]);
        };

        return testModule;
      });
    });

    it('should load with the correct context', function () {
      font.load({
        test: {
          somedata: 'in french a cow says meuh'
        },
        context: window
      });

      expect(testModule.domHelper).not.toBeNull();
      expect(testModule.domHelper).not.toBeUndefined();

      expect(testModule.domHelper.getMainWindow()).toEqual(fakeMainWindow);
      expect(testModule.domHelper.getLoadWindow()).toEqual(window);
    });
  });

  describe('module failed to provide families and descriptions because it did not initialize properly', function () {
    var webfont = null,
        testModule = null,
        font = null,
        inactive = jasmine.createSpy('inactive'),
        active = jasmine.createSpy('active');

    beforeEach(function () {
      font = new Font('Font1');
      jasmine.Clock.useMock();
      webfont = new WebFont(window);
      webfont.addModule('test', function (conf, domHelper) {
        testModule = new function () {
          this.conf = conf;
        };

        spyOn(FontWatchRunner.prototype, 'start').andCallFake(function () {
          if (conf.id) {
            active(font);
          } else {
            inactive(font);
          }
        });

        spyOn(NativeFontWatchRunner.prototype, 'start').andCallFake(function () {
          if (conf.id) {
            active(font);
          } else {
            inactive(font);
          }
        });

        testModule.load = function (onReady) {
          if (conf.id) {
            onReady([font]);
          } else {
            onReady([]);
          }
        };

        return testModule;
      });
    });

    it('should load with a project id', function () {
      webfont.load({
        test: {
          id: 'hello world'
        },
        inactive: inactive,
        active: active
      });

      jasmine.Clock.tick(1);

      expect(testModule).not.toBeNull();
      expect(active).toHaveBeenCalled();
    });

    it('should not load without a project id', function () {
      webfont.load({
        test: {
        },
        inactive: inactive,
        active: active
      });

      jasmine.Clock.tick(1);

      expect(testModule).not.toBeNull();
      expect(inactive).toHaveBeenCalled();
    });
  });

  describe('should pass both fonts and test strings to onready', function () {
    var font = null,
        fontTestStrings = null,
        testModule = null;

    beforeEach(function () {
      font = new WebFont(window);

      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {};
        testModule.load = function (onReady) {
          onReady([new Font('Elena')], { 'Elena': '1234567' });
        };

        return testModule;
      });

      spyOn(font, 'onModuleReady_');
    });

    it('should have called onModuleReady with the correct font and test string', function () {
      font.load({
        'test': {}
      });

      expect(font.onModuleReady_).toHaveBeenCalled();
      expect(font.onModuleReady_.calls[0].args[2]).toEqual([new Font('Elena')]);
      expect(font.onModuleReady_.calls[0].args[4]).toEqual({ 'Elena': '1234567' });
    });
  });

  describe('module fails to load', function () {
    var font = null,
        testModule = null,
        inactive = null,
        active = null;

    beforeEach(function () {
      inactive = jasmine.createSpy('inactive'),
      active = jasmine.createSpy('active');

      font = new WebFont(window, fontModuleLoader);

      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {};
        testModule.load = function (onReady) {
          onReady([]);
        };

        return testModule;
      });
    });

    it('times out and calls inactive', function () {
      runs(function () {
        font.load({
          'test': {},
          inactive: inactive,
          active: active
        });
      });

      waitsFor(function () {
        return active.wasCalled || inactive.wasCalled;
      });

      runs(function () {
        expect(inactive).toHaveBeenCalled();
        expect(active).not.toHaveBeenCalled();
      });
    });
  });

  describe('synchronous load event', function () {
    var font = null,
        testModule = null,
        inactive = null,
        loading = null,
        active = null;

    beforeEach(function () {
      inactive = jasmine.createSpy('inactive'),
      active = jasmine.createSpy('active');
      loading = jasmine.createSpy('loading');

      font = new WebFont(window, fontModuleLoader);

      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {};
        testModule.load = function (onReady) {
          onReady([new Font('Elena')]);
        };

        return testModule;
      });
    });

    it('fires loading event correctly', function () {
      runs(function () {
        font.load({
          'test': {},
          inactive: inactive,
          active: active,
          loading: loading
        });
        expect(loading).toHaveBeenCalled();
      });

      waitsFor(function () {
        return active.wasCalled || inactive.wasCalled;
      });

      runs(function () {
        expect(inactive).toHaveBeenCalled();
        expect(active).not.toHaveBeenCalled();
      });
    });
  });
});
