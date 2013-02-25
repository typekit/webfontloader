describe('LastResortWebKitFontWatchRunner', function () {
  var LastResortWebKitFontWatchRunner = webfont.LastResortWebKitFontWatchRunner,
      Size = webfont.Size,
      DomHelper = webfont.DomHelper,
      FontRuler = webfont.FontRuler,
      domHelper = new DomHelper(window),
      fontFamily = 'My Family',
      fontDescription = 'n4';

  var TARGET_SIZE = new Size(3, 3),
      FALLBACK_SIZE_A = new Size(1, 1),
      FALLBACK_SIZE_B = new Size(2, 2),
      LAST_RESORT_SIZE = new Size(4, 4),

      setupSizes = [FALLBACK_SIZE_A, FALLBACK_SIZE_B, LAST_RESORT_SIZE],
      actualSizes = [],
      timesToGetTimeBeforeTimeout = 10,
      activeCallback = null,
      inactiveCallback = null;

  beforeEach(function () {
    jasmine.Clock.useMock();

    actualSizes = [];

    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');
    timesToGetTimeBeforeTimeout = 10;

    var setupFinished = false,
        fakeGetSizeCount = 0;

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
      fakeGetSizeCount = 0;
      originalStart.apply(this);
    });
  });

  it('should ignore fallback size and call active', function () {
    actualSizes = [
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      TARGET_SIZE, TARGET_SIZE
    ];

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
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

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, 'Arimo', fontDescription, true);

    fontWatchRunner.start();

    jasmine.Clock.tick(1 * 25);
    expect(activeCallback).toHaveBeenCalledWith('Arimo', 'n4');
  });

  it('should fail to load font and call inactive', function () {
    actualSizes = [
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      FALLBACK_SIZE_A, FALLBACK_SIZE_B
    ];

    timesToGetTimeBeforeTimeout = 3;

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
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

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, fontFamily, fontDescription, true);

    fontWatchRunner.start();
    jasmine.Clock.tick(1 * 25);
    expect(inactiveCallback).toHaveBeenCalledWith('My Family', 'n4');
  });
});
