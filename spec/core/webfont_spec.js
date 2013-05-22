describe('WebFont', function () {
  var WebFont = webfont.WebFont,
      UserAgent = webfont.UserAgent,
      FontWatchRunner = webfont.FontWatchRunner,
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
      new BrowserInfo(true, false, false)
    );
    fontModuleLoader = new FontModuleLoader();
  });

  describe('font load', function () {
    var font = null,
        testModule = null;

    beforeEach(function () {
      font = new WebFont(window, fontModuleLoader, userAgent);
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
        fakeMainWindow = {};

    beforeEach(function () {
      font = new WebFont(fakeMainWindow, fontModuleLoader, userAgent);
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
      webfont = new WebFont(window, fontModuleLoader, userAgent);
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
      font = new WebFont(window, fontModuleLoader, userAgent);

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
      font = new WebFont(window, fontModuleLoader, new UserAgent(
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
        new BrowserInfo(false, false, false)
      ));
      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {
          this.conf = conf;
          this.loadCalled = false;
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

      expect(testModule).toBeNull()
      expect(inactive).toHaveBeenCalled();
    });
  });
});
