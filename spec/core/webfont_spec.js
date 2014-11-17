describe('WebFont', function () {
  var WebFont = webfont.WebFont,
      Font = webfont.Font;
      UserAgent = webfont.UserAgent,
      FontWatchRunner = webfont.FontWatchRunner,
      NativeFontWatchRunner = webfont.NativeFontWatchRunner,
      BrowserInfo = webfont.BrowserInfo,
      Version = webfont.Version,
      Font = webfont.Font,
      FontModuleLoader = webfont.FontModuleLoader,
      fontModuleLoader = null,
      userAgent = null;

  beforeEach(function () {
    userAgent = new UserAgent(
      'Firefox',
      new Version(3, 6),
      '3.6',
      'Gecko',
      new Version(1, 9, 2),
      '1.9.2',
      'Macintosh',
      new Version(10, 6),
      '10.6',
      undefined,
      new BrowserInfo(true, false, false, false)
    );
    fontModuleLoader = new FontModuleLoader();
  });

  describe('font load', function () {
    var font = null,
        testModule = null;

    beforeEach(function () {
      font = new WebFont(window);
      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {
          this.conf = conf;
          this.domHelper = domHelper;
          this.loadCalled = true;
          this.supportUserAgentCalled = false;
        };

        testModule.load = function (onReady) {
          this.loadCalled = true;
          onReady([]);
        };

        testModule.supportUserAgent = function (ua, support) {
          this.supportUserAgentCalled = true;
          support(true);
        };

        return testModule;
      });
    });

    it('should not start loading', function () {
      expect(font.moduleFailedLoading_).toEqual(0);
      expect(font.moduleLoading_).toEqual(0);
    });

    it('should fail to load a module', function () {
      var loading = jasmine.createSpy('loading');

      font.load({
        test: {
          somedata: 'in french a cow says meuh'
        },
        loading: loading
      });

      expect(font.moduleFailedLoading_).toEqual(1);
      expect(font.moduleLoading_).toEqual(0);
      expect(testModule).not.toBeNull();

      expect(testModule.conf).not.toBeUndefined();
      expect(testModule.conf).not.toBeNull();

      expect(testModule.domHelper).not.toBeNull();
      expect(testModule.domHelper).not.toBeUndefined();

      expect(testModule.domHelper.getMainWindow()).toEqual(window);
      expect(testModule.domHelper.getLoadWindow()).toEqual(window);

      expect(testModule.conf.somedata).toEqual('in french a cow says meuh');
      expect(testModule.loadCalled).toBe(true);
      expect(testModule.supportUserAgentCalled).toBe(true);
      expect(loading).toHaveBeenCalled();
    });
  });

  describe('font load with context', function () {
    var font = null,
        testModule = null,
        fakeMainWindow = {
          navigator: {
            userAgent: 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.9 Safari/533.2'
          },
          document: {}
        };

    beforeEach(function () {
      font = new WebFont(fakeMainWindow);
      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {
          this.domHelper = domHelper;
        };
        testModule.load = function () {};
        testModule.supportUserAgent = function (ua, support) {
          support(true);
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
          this.fonts = [];
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

        testModule.supportUserAgent = function (userAgent, support) {
          if (conf.id) {
            // The monotype module only initializes font
            // and description if there is a kit id.
            this.fonts = [font];
          }
          support(true);
        };
        testModule.load = function (onReady) {
          onReady(this.fonts);
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
        testModule.supportUserAgent = function (ua, support) { support(true); };
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
      expect(font.onModuleReady_.calls[0].args[3]).toEqual({ 'Elena': '1234567' });
    });
  });

  describe('font inactive', function () {
    var font = null,
        testModule = null;

    beforeEach(function () {
      font = new WebFont(window);
      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {
          this.conf = conf;
          this.loadCalled = false;
        };
        testModule.supportUserAgent = function (ua, support) {
          support(false);
        };
        testModule.load = function () {};
        return testModule;
      });
    });

    it('should load with the correct context', function () {
      var inactive = jasmine.createSpy('inactive');

      font.load({
        test: {
          somedata: 'in french a cow says meuh'
        },
        inactive: inactive
      });

      expect(inactive).toHaveBeenCalled();
      expect(inactive.calls.length).toEqual(1);
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

      font = new WebFont(window, fontModuleLoader, userAgent);

      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {};
        testModule.supportUserAgent = function (ua, support) {
          window.setTimeout(function () {
            support(false);
          }, 100);
        };
        testModule.load = function (onReady) {
          onReady();
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

      font = new WebFont(window, fontModuleLoader, userAgent);

      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {};
        testModule.supportUserAgent = function (ua, support) {
          window.setTimeout(function () {
            support(true);
          }, 100);
        };
        testModule.load = function (onReady) {
          onReady([]);
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
