describe('FontWatchRunner', function () {
  var FontWatchRunner = webfont.FontWatchRunner,
      UserAgentParser = webfont.UserAgentParser,
      Size = webfont.Size,
      DomHelper = webfont.DomHelper,
      FontRuler = webfont.FontRuler;

  var domHelper = null,
      activeCallback = null,
      inactiveCallback = null;

  beforeEach(function () {
    domHelper = new DomHelper(window);

    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');
  });

  describe('Fake browser', function () {
    var fontFamily =  'My Family',
        fontDescription = 'n4',
        TARGET_SIZE = new Size(3, 3),
        FALLBACK_SIZE_A = new Size(1, 1),
        FALLBACK_SIZE_B = new Size(2, 2),
        LAST_RESORT_SIZE = new Size(4, 4),

        setupSizes = [],
        actualSizes = [],
        fakeGetSizeCount = 0,
        setupFinished = false,
        timesToGetTimeBeforeTimeout = 10,
        originalGoogNow = null,
        setupFinished = false,
        originalStartMethod = null;

    beforeEach(function () {
      jasmine.Clock.useMock();

      setupSizes = [FALLBACK_SIZE_A, FALLBACK_SIZE_B, LAST_RESORT_SIZE];

      actualSizes = [];

      fakeGetSizeCount = 0;

      setupFinished = false;

      spyOn(FontRuler.prototype, 'getSize').andCallFake(function () {
        var result = null;

        if (setupFinished) {
          // If you are getting an exception here your tests does not specify enough
          // size data to run properly.
          if (fakeGetSizeCount >= actualSizes.length) {
            throw 'Invalid test data';
          }
          result = actualSizes[fakeGetSizeCount];
          fakeGetSizeCount += 1;
        } else {
          result = setupSizes[Math.min(fakeGetSizeCount, setupSizes.length - 1)];
          fakeGetSizeCount += 1;
        }
        return result;
      });

      timesToGetBeforeTimeout = 10;

      originalGoogNow = goog.now;

      goog.now = function () {
        if (timesToGetTimeBeforeTimeout <= 0) {
          return 6000;
        } else {
          timesToGetTimeBeforeTimeout -= 1;
          return 1;
        }
      };

      originalStartMethod = FontWatchRunner.prototype.start;

      FontWatchRunner.prototype.start = function () {
        setupFinished = true;
        fakeGetSizeCount = 0;
        originalStartMethod.apply(this);
      };
    });

    afterEach(function () {
      goog.now = originalGoogNow;
      FontWatchRunner.prototype.start = originalStartMethod;
    });

    it('should call active if fonts are already loaded', function () {
      actualSizes = [
        TARGET_SIZE, TARGET_SIZE
      ];

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fontFamily, fontDescription, false);

      fontWatchRunner.start();

      jasmine.Clock.tick(1 * 25);
      expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
    });

    it('should wait for font load and call active', function () {
      actualSizes = [
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        TARGET_SIZE, TARGET_SIZE
      ];

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fontFamily, fontDescription, false);

      fontWatchRunner.start();

      jasmine.Clock.tick(3 * 25);
      expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
    });

    it('should wait for font inactive and call inactive', function () {
      timesToGetTimeBeforeTimeout = 5;

      actualSizes = [
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B
      ];

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fontFamily, fontDescription, false);

      fontWatchRunner.start();

      jasmine.Clock.tick(4 * 25);
      expect(inactiveCallback).toHaveBeenCalledWith('My Family', 'n4');
    });

    describe('WebKit fallback bug', function () {
      it('should ignore fallback size and call active', function () {
        actualSizes = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          TARGET_SIZE, TARGET_SIZE
        ];

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, fontFamily, fontDescription, true);

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
      });

      it('should consider last resort font as having identical metrics and call active', function () {
        actualSizes = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          LAST_RESORT_SIZE, LAST_RESORT_SIZE
        ];

        timesToGetTimeBeforeTimeout = 2;

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, fontFamily, fontDescription, true);

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
      });

      it('should fail to load font and call inactive', function () {
        actualSizes = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          FALLBACK_SIZE_A, FALLBACK_SIZE_B
        ];

        timesToGetTimeBeforeTimeout = 3;

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, fontFamily, fontDescription, true);

        fontWatchRunner.start();

        jasmine.Clock.tick(2 * 25);
        expect(inactiveCallback).toHaveBeenCalledWith('My Family', 'n4');
      });

      it('should call inactive when we are loading a metric incompatible font', function () {
        actualSizes = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          LAST_RESORT_SIZE, LAST_RESORT_SIZE
        ];

        timesToGetTimeBeforeTimeout = 2;

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, fontFamily, fontDescription, true,
            { 'My Other Family': true });

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(inactiveCallback).toHaveBeenCalledWith('My Family', 'n4');
      });

      it('should call active when we are loading a metric compatible font', function () {
        actualSizes = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          LAST_RESORT_SIZE, LAST_RESORT_SIZE
        ];

        timesToGetTimeBeforeTimeout = 2;

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, fontFamily, fontDescription, true,
            { 'My Family': true });

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
      });
    });

    describe('test string', function () {
      var fontWatchRunner = null;

      beforeEach(function () {
        spyOn(domHelper, 'createElement').andCallThrough();
      });

      it('should be the default', function () {
        actualSizes = [
          TARGET_SIZE, TARGET_SIZE
        ];

        fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, fontFamily, fontDescription, false);

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(domHelper.createElement.mostRecentCall.args[2]).toEqual('BESbswy');
      });

      it('should be a custom string', function () {
        actualSizes = [
          TARGET_SIZE, TARGET_SIZE
        ];

        fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, fontFamily, fontDescription, false, {}, 'TestString');

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(domHelper.createElement.mostRecentCall.args[2]).toEqual('TestString');
      });
    });
  });

  describe('real browser testing', function () {
    var userAgent = null;

    beforeEach(function () {
      var userAgentParser = new UserAgentParser(window.navigator.userAgent, window.document);

      userAgent = userAgentParser.parse();
    });

    it('should fail to load a null font', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, '__webfontloader_test__', '', userAgent.getBrowserInfo().hasWebKitFallbackBug());

      runs(function () {
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(inactiveCallback).toHaveBeenCalledWith('__webfontloader_test__', '');
      });
    });

    it('should load font succesfully', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, 'SourceSansA', '', userAgent.getBrowserInfo().hasWebKitFallbackBug()),
          ruler = new FontRuler(domHelper, 'abcdef'),
          activeSize = null,
          originalSize = null,
          finalCheck = false;

      runs(function () {
        ruler.insert();
        ruler.setFont('monospace');
        originalSize = ruler.getSize();
        ruler.setFont("'SourceSansA', monospace");
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(activeCallback).toHaveBeenCalledWith('SourceSansA', '');
        activeSize = ruler.getSize();
        expect(activeSize).not.toEqual(originalSize);

        window.setTimeout(function () {
          finalCheck = true;
        }, 200);
      });

      waitsFor(function () {
        return finalCheck;
      });

      runs(function () {
        expect(ruler.getSize()).not.toEqual(originalSize);
        expect(ruler.getSize()).toEqual(activeSize);
      });
    });

    it('should attempt to load a non-existing font', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, 'Elena', '', userAgent.getBrowserInfo().hasWebKitFallbackBug());

      runs(function () {
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(inactiveCallback).toHaveBeenCalledWith('Elena', '');
      });
    });

    it('should load even if @font-face is inserted after watching has started', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, 'SourceSansB', '', userAgent.getBrowserInfo().hasWebKitFallbackBug()),
          ruler = new FontRuler(domHelper, 'abcdef'),
          activeSize = null,
          originalSize = null,
          finalCheck = false;

      runs(function () {
        ruler.insert();
        ruler.setFont('monospace');
        originalSize = ruler.getSize();
        ruler.setFont("'SourceSansB', monospace");
        fontWatchRunner.start();
        var link = document.createElement('link');

        link.rel = "stylesheet";
        link.href= "fonts/sourcesansb.css";

        document.head.appendChild(link);
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(activeCallback).toHaveBeenCalledWith('SourceSansB', '');
        activeSize = ruler.getSize();
        expect(activeSize).not.toEqual(originalSize);

        window.setTimeout(function () {
          finalCheck = true;
        }, 200);
      });

      waitsFor(function () {
        return finalCheck;
      });

      runs(function () {
        expect(ruler.getSize()).not.toEqual(originalSize);
        expect(ruler.getSize()).toEqual(activeSize);
      });
    });
  });
});
