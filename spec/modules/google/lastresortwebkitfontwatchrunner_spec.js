describe('modules.google.LastResortWebKitFontWatchRunner', function () {
  var LastResortWebKitFontWatchRunner = webfont.modules.google.LastResortWebKitFontWatchRunner,
      BrowserInfo = webfont.BrowserInfo,
      DomHelper = webfont.DomHelper,
      FontRuler = webfont.FontRuler,
      Font = webfont.Font,
      domHelper = new DomHelper(window),
      font = new Font('My Family', 'n4');

  var TARGET_SIZE = 3,
      FALLBACK_SIZE_A = 1,
      FALLBACK_SIZE_B = 2,
      LAST_RESORT_SIZE = 4,

      browserInfo = new BrowserInfo(true, true, false),
      setupWidths = [FALLBACK_SIZE_A, FALLBACK_SIZE_B, LAST_RESORT_SIZE],
      actualWidths = [],
      timesToGetTimeBeforeTimeout = 10,
      activeCallback = null,
      inactiveCallback = null;

  beforeEach(function () {
    jasmine.Clock.useMock();

    actualWidths = [];

    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');
    timesToGetTimeBeforeTimeout = 10;

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

    spyOn(goog, 'now').andCallFake(function () {
      if (timesToGetTimeBeforeTimeout <= 0) {
        return 6000;
      } else {
        timesToGetTimeBeforeTimeout -= 1;
        return 1;
      }
    });

    var originalStart = LastResortWebKitFontWatchRunner.prototype.start;

    spyOn(LastResortWebKitFontWatchRunner.prototype, 'start').andCallFake(function () {
      setupFinished = true;
      fakeGetWidthCount = 0;
      originalStart.apply(this);
    });
  });

  it('should ignore fallback size and call active', function () {
    actualWidths = [
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      TARGET_SIZE, TARGET_SIZE
    ];

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, font, browserInfo);

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

    var arimo = new Font('Arimo');

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, arimo, browserInfo);

    fontWatchRunner.start();

    jasmine.Clock.tick(1 * 25);
    expect(activeCallback).toHaveBeenCalledWith(arimo);
  });

  it('should fail to load font and call inactive', function () {
    actualWidths = [
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      FALLBACK_SIZE_A, FALLBACK_SIZE_B
    ];

    timesToGetTimeBeforeTimeout = 3;

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, font, browserInfo);

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

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, font, browserInfo);

    fontWatchRunner.start();
    jasmine.Clock.tick(1 * 25);
    expect(inactiveCallback).toHaveBeenCalledWith(font);
  });
});
