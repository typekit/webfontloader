describe('LastResortWebKitFontWatchRunner', function () {
  var LastResortWebKitFontWatchRunner = webfont.LastResortWebKitFontWatchRunner,
      BrowserInfo = webfont.BrowserInfo,
      Size = webfont.Size,
      DomHelper = webfont.DomHelper,
      domHelper = new DomHelper(window),
      fontFamily = 'My Family',
      fontDescription = 'n4';

  var timesToCheckSizeBeforeChange = 0,
      TARGET_SIZE = new Size(3, 3),
      FALLBACK_SIZE_A = new Size(1, 1),
      FALLBACK_SIZE_B = new Size(2, 2),
      LAST_RESORT_SIZE = new Size(4, 4),

      browserInfo = new BrowserInfo(true, true, false),
      setupSizes = [FALLBACK_SIZE_A, FALLBACK_SIZE_B, LAST_RESORT_SIZE],
      actualSizes = [],
      fakeGetSizeCount = 0,
      setupFinished = false,
      fakeFontSizer = {
        getSize: function (el) {
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
        }
      },
      timesToGetTimeBeforeTimeout = 10,
      fakeGetTime = function () {
        if (timesToGetTimeBeforeTimeout <= 0) {
          return 6000;
        } else {
          timesToGetTimeBeforeTimeout -= 1;
          return 1;
        }
      },
      asyncCount = 0,
      fakeAsyncCall = function (func, timeout) {
        asyncCount += 1;
        func();
      },
      setupFinished = false,
      originalStartMethod = null,
      activeCallback = null,
      inactiveCallback = null;

  beforeEach(function () {
    actualSizes = [];
    setupFinished = false;
    fakeGetSizeCount = 0;

    asyncCount = 0;
    timesToGetTimeBeforeTimeout = 10;
    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');

    originalStartMethod = LastResortWebKitFontWatchRunner.prototype.start;

    LastResortWebKitFontWatchRunner.prototype.start = function () {
      setupFinished = true;
      fakeGetSizeCount = 0;
      originalStartMethod.apply(this);
    };
  });

  afterEach(function () {
    LastResortWebKitFontWatchRunner.prototype.start = originalStartMethod;
  });

  it('should ignore fallback size and call active', function () {
    actualSizes = [
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      TARGET_SIZE, TARGET_SIZE
    ];

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, browserInfo);

    fontWatchRunner.start();

    expect(asyncCount).toEqual(1);
    expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
  });

  it('should consider last resort font as having identical metrics and call active', function () {
    actualSizes = [
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      LAST_RESORT_SIZE, LAST_RESORT_SIZE
    ];

    timesToGetTimeBeforeTimeout = 2;

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, 'Arimo', fontDescription, browserInfo);

    fontWatchRunner.start();

    expect(asyncCount).toEqual(1);
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
        domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, browserInfo);

    fontWatchRunner.start();

    expect(asyncCount).toEqual(2);
    expect(inactiveCallback).toHaveBeenCalledWith('My Family', 'n4');
  });

  it('should call inactive when we are loading a metric incompatible font', function () {
    actualSizes = [
      LAST_RESORT_SIZE, LAST_RESORT_SIZE,
      LAST_RESORT_SIZE, LAST_RESORT_SIZE
    ];

    timesToGetTimeBeforeTimeout = 2;

    var fontWatchRunner = new LastResortWebKitFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, browserInfo);

    fontWatchRunner.start();
    expect(asyncCount).toEqual(1);
    expect(inactiveCallback).toHaveBeenCalledWith('My Family', 'n4');
  });
});
