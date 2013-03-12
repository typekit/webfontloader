describe('WebFont', function () {
  var WebFont = webfont.WebFont,
      UserAgent = webfont.UserAgent,
      BrowserInfo = webfont.BrowserInfo,
      FontFamily = webfont.FontFamily,
      FontModuleLoader = webfont.FontModuleLoader,
      fontModuleLoader = null,
      userAgent = null;

  beforeEach(function () {
    userAgent = new UserAgent('Firefox', '3.6', 'Gecko', '1.9.2', 'Macintosh', '10.6', undefined, new BrowserInfo(true, false, false));
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
    var font = null,
        testModule = null,
        fontFamily = null,
        inactive = jasmine.createSpy('inactive'),
        active = jasmine.createSpy('active');

    beforeEach(function () {
      fontFamily = new FontFamily('Font1');
      jasmine.Clock.useMock();
      font = new WebFont(window, fontModuleLoader, new UserAgent('Firefox', '3.6', 'Gecko', '1.9.2', 'Macintosh', '10.6', undefined, new BrowserInfo(true, false)));
      font.addModule('test', function (conf, domHelper) {
        testModule = new function () {
          this.conf = conf;
          this.families = [];
        };

        testModule.getFontWatchRunnerCtor = function () {
          function FakeFontWatchRunner(activeCallback, inactiveCallback) {
            this.inactive = inactiveCallback;
            this.active = activeCallback;
          };

          FakeFontWatchRunner.prototype.start = function () {
            if (conf.id) {
              this.active(fontFamily);
            } else {
              this.inactive(fontFamily);
            }
          };

          return FakeFontWatchRunner;
        };

        testModule.supportUserAgent = function (userAgent, support) {
          if (conf.id) {
            // The monotype module only initializes font
            // and description if there is a kit id.
            this.families = [fontFamily];
          }
          support(true);
        };
        testModule.load = function (onReady) {
          onReady(this.families);
        };

        return testModule;
      });
    });

    it('should load with a project id', function () {
      font.load({
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
      font.load({
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

  describe('font inactive', function () {
    var font = null,
        testModule = null;

    beforeEach(function () {
      font = new WebFont(window, fontModuleLoader, new UserAgent('Firefox', '3.6', 'Gecko', '1.9.2', 'Macintosh', '10.6', undefined, new BrowserInfo(false, false, false)));
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
