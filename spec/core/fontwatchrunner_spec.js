describe('FontWatchRunner', function () {
  var FontWatchRunner = webfont.FontWatchRunner,
      Font = webfont.Font,
      BrowserInfo = webfont.BrowserInfo,
      UserAgentParser = webfont.UserAgentParser,
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
    var font =  new Font('My Family', 'n4'),
        TARGET_SIZE = 3,
        FALLBACK_SIZE_A = 1,
        FALLBACK_SIZE_B = 2,
        LAST_RESORT_SIZE = 4,

        browserInfo = new BrowserInfo(true, false, false),
        fallbackBugBrowserInfo = new BrowserInfo(true, true, false),
        setupWidths = [],
        actualWidths = [],
        timesToGetTimeBeforeTimeout = 10;

    beforeEach(function () {
      jasmine.Clock.useMock();

      setupWidths = [FALLBACK_SIZE_A, FALLBACK_SIZE_B, LAST_RESORT_SIZE];

      actualWidths = [];

      var setupFinished = false,
          fakeGetWidthCount = 0;

      spyOn(FontRuler.prototype, 'getWidth').andCallFake(function () {
        var result = null;
        if (setupFinished) {
          // If you are getting an exception here your tests does not specify enough
          // size data to run properly.
          if (fakeGetWidthCount >= actualWidths.length) {
            throw 'Invalid test data';
          }
          result = actualWidths[fakeGetWidthCount];
          fakeGetWidthCount += 1;
        } else {
          result = setupWidths[Math.min(fakeGetWidthCount, setupWidths.length - 1)];
          fakeGetWidthCount += 1;
        }
        return result;
      });

      timesToGetBeforeTimeout = 10;

      spyOn(goog, 'now').andCallFake(function () {
        if (timesToGetTimeBeforeTimeout <= 0) {
          return 6000;
        } else {
          timesToGetTimeBeforeTimeout -= 1;
          return 1;
        }
      });

      var originalStart = FontWatchRunner.prototype.start;

      spyOn(FontWatchRunner.prototype, 'start').andCallFake(function () {
        setupFinished = true;
        fakeGetWidthCount = 0;

        originalStart.apply(this);
      });
    });

    it('should call active if fonts are already loaded', function () {
      actualWidths = [
        TARGET_SIZE, TARGET_SIZE
      ];

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, font, browserInfo);

      fontWatchRunner.start();

      jasmine.Clock.tick(1 * 25);
      expect(activeCallback).toHaveBeenCalledWith(font);
    });

    it('should wait for font load and call active', function () {
      actualWidths = [
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        TARGET_SIZE, TARGET_SIZE
      ];

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, font, browserInfo);

      fontWatchRunner.start();

      jasmine.Clock.tick(3 * 25);
      expect(activeCallback).toHaveBeenCalledWith(font);
    });

    it('should wait for font inactive and call inactive', function () {
      timesToGetTimeBeforeTimeout = 5;

      actualWidths = [
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B,
        FALLBACK_SIZE_A, FALLBACK_SIZE_B
      ];

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, font, browserInfo);

      fontWatchRunner.start();

      jasmine.Clock.tick(4 * 25);
      expect(inactiveCallback).toHaveBeenCalledWith(font);
    });

    describe('WebKit fallback bug', function () {
      it('should ignore fallback size and call active', function () {
        actualWidths = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          TARGET_SIZE, TARGET_SIZE
        ];

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, font, fallbackBugBrowserInfo);

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(activeCallback).toHaveBeenCalledWith(font);
      });

      it('should consider last resort font as having identical metrics and call active', function () {
        actualWidths = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          LAST_RESORT_SIZE, LAST_RESORT_SIZE
        ];

        timesToGetTimeBeforeTimeout = 2;

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, font, fallbackBugBrowserInfo);

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(activeCallback).toHaveBeenCalledWith(font);
      });

      it('should fail to load font and call inactive', function () {
        actualWidths = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          FALLBACK_SIZE_A, FALLBACK_SIZE_B
        ];

        timesToGetTimeBeforeTimeout = 3;

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, font, fallbackBugBrowserInfo);

        fontWatchRunner.start();

        jasmine.Clock.tick(2 * 25);
        expect(inactiveCallback).toHaveBeenCalledWith(font);
      });

      it('should call inactive when we are loading a metric incompatible font', function () {
        actualWidths = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          LAST_RESORT_SIZE, LAST_RESORT_SIZE
        ];

        timesToGetTimeBeforeTimeout = 2;

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, font, fallbackBugBrowserInfo, 0, { 'My Other Family': true });

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(inactiveCallback).toHaveBeenCalledWith(font);
      });

      it('should call active when we are loading a metric compatible font', function () {
        actualWidths = [
          LAST_RESORT_SIZE, LAST_RESORT_SIZE,
          LAST_RESORT_SIZE, LAST_RESORT_SIZE
        ];

        timesToGetTimeBeforeTimeout = 2;

        var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, new Font('Arimo'), fallbackBugBrowserInfo, 0, { 'Arimo': true });

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(activeCallback).toHaveBeenCalledWith(new Font('Arimo'));
      });
    });

    describe('test string', function () {
      var fontWatchRunner = null;

      beforeEach(function () {
        spyOn(domHelper, 'createElement').andCallThrough();
      });

      it('should be the default', function () {
        actualWidths = [
          TARGET_SIZE, TARGET_SIZE
        ];
        fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, font, browserInfo);

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(domHelper.createElement.mostRecentCall.args[2]).toEqual('BESbswy');
      });

      it('should be a custom string', function () {
        actualWidths = [
          TARGET_SIZE, TARGET_SIZE
        ];

        fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
            domHelper, font, browserInfo, 0, null, 'TestString');

        fontWatchRunner.start();

        jasmine.Clock.tick(1 * 25);
        expect(domHelper.createElement.mostRecentCall.args[2]).toEqual('TestString');
      });
    });
  });

  describe('real browser testing', function () {
    var userAgent = null,
        nullFont = null,
        sourceSansA = null,
        sourceSansB = null,
        sourceSansC = null,
        sourceSansCBold = null,
        elena = null;

    beforeEach(function () {
      var userAgentParser = new UserAgentParser(window.navigator.userAgent, window.document);

      nullFont = new Font('__webfontloader_test__');
      sourceSansA = new Font('SourceSansA');
      sourceSansB = new Font('SourceSansB');
      sourceSansC = new Font('SourceSansC');
      sourceSansCBold = new Font('SourceSansC', 'n7');
      elena = new Font('Elena');

      userAgent = userAgentParser.parse();
    });

    it('should fail to load a null font', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, nullFont, userAgent.getBrowserInfo(), 500);

      runs(function () {
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(inactiveCallback).toHaveBeenCalledWith(nullFont);
      });
    });

    it('should load font succesfully', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, sourceSansA, userAgent.getBrowserInfo(), 500),
          ruler = new FontRuler(domHelper, 'abcdef'),
          monospace = new Font('monospace'),
          sourceSansAFallback = new Font("'SourceSansA', monospace"),
          activeWidth = null,
          originalWidth = null,
          finalCheck = false;

      runs(function () {
        ruler.insert();
        ruler.setFont(monospace);
        originalWidth = ruler.getWidth();
        ruler.setFont(sourceSansAFallback);
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(activeCallback).toHaveBeenCalledWith(sourceSansA);
        activeWidth = ruler.getWidth();
        expect(activeWidth).not.toEqual(originalWidth);

        window.setTimeout(function () {
          finalCheck = true;
        }, 200);
      });

      waitsFor(function () {
        return finalCheck;
      });

      runs(function () {
        expect(ruler.getWidth()).not.toEqual(originalWidth);
        expect(ruler.getWidth()).toEqual(activeWidth);
      });
    });

    it('should attempt to load a non-existing font', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, elena, userAgent.getBrowserInfo(), 500);

      runs(function () {
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        if (userAgent.getBrowserInfo().hasWebKitFallbackBug()) {
          expect(activeCallback).toHaveBeenCalledWith(elena);
        } else {
          expect(inactiveCallback).toHaveBeenCalledWith(elena);
        }
      });
    });

    it('should load even if @font-face is inserted after watching has started', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, sourceSansB, userAgent.getBrowserInfo(), 500),
          ruler = new FontRuler(domHelper, 'abcdef'),
          monospace = new Font('monospace'),
          sourceSansBFallback = new Font("'SourceSansB', monospace"),
          activeWidth = null,
          originalWidth = null,
          finalCheck = false;

      runs(function () {
        ruler.insert();
        ruler.setFont(monospace);
        originalWidth = ruler.getWidth();
        ruler.setFont(sourceSansBFallback);
        fontWatchRunner.start();
        var link = document.createElement('link');

        link.rel = "stylesheet";
        link.href= "fixtures/fonts/sourcesansb.css";

        domHelper.insertInto('head', link);
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(activeCallback).toHaveBeenCalledWith(sourceSansB);
        activeWidth = ruler.getWidth();
        expect(activeWidth).not.toEqual(originalWidth);

        window.setTimeout(function () {
          finalCheck = true;
        }, 200);
      });

      waitsFor(function () {
        return finalCheck;
      });

      runs(function () {
        expect(ruler.getWidth()).not.toEqual(originalWidth);
        expect(ruler.getWidth()).toEqual(activeWidth);
      });
    });

    it('should load one weight after another', function () {
       var fontWatchRunnerRegular = new FontWatchRunner(activeCallback, inactiveCallback,
           domHelper, sourceSansC, userAgent.getBrowserInfo(), 500),
           fontWatchRunnerBold = new FontWatchRunner(activeCallback, inactiveCallback,
           domHelper, sourceSansCBold, userAgent.getBrowserInfo(), 500),
           fontRulerA = new FontRuler(domHelper, 'abcdef'),
           fontRulerB = new FontRuler(domHelper, 'abcdef');

      runs(function () {
        fontRulerA.insert();
        fontRulerA.setFont(sourceSansC);
        fontWatchRunnerRegular.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(activeCallback).toHaveBeenCalledWith(sourceSansC);

        activeCallback.reset();
        inactiveCallback.reset();

        fontRulerB.insert();
        fontRulerB.setFont(sourceSansCBold);
        fontWatchRunnerBold.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(activeCallback).toHaveBeenCalledWith(sourceSansCBold);
        expect(fontRulerA.getWidth()).not.toEqual(fontRulerB.getWidth());
      });
    });
  });
});
