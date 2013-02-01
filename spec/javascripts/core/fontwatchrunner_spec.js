describe('FontWatchRunner', function () {
  var FontWatchRunner = webfont.FontWatchRunner,
      Size = webfont.Size,
      DomHelper = webfont.DomHelper,
      domHelper = new DomHelper(window),
      fontFamily = 'My Family',
      fontDescription = 'n4';

  var timesToCheckWidthsBeforeChange = 0,
      timesToReportChangedWidth = 2,
      fakeFontSizer = {
        getSize: function (el) {
          if (el.style.fontFamily.indexOf(fontFamily) !== -1) {
            if (timesToCheckWidthsBeforeChange <= 0) {
              timesToReportChangedWidth -= 0.5;
              return new Size(2, 2);
            } else {
              timesToCheckWidthsBeforeChange -= 0.5;
              return new Size(1, 1);
            }
          } else {
            return new Size(1, 1);
          }
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
      activeCallback = null,
      inactiveCallback = null;

  beforeEach(function () {
    timesToCheckWidthsBeforeChange = 0;
    timesToReportChangedWidth = 2;
    asyncCount = 0;
    timesToGetTimeBeforeTimeout = 10;
    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');
  });

  describe('fonts already loaded', function () {
    it('should call active', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, false);

      fontWatchRunner.start();

      expect(asyncCount).toEqual(0);
      expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
    });
  });

  describe('wait for font load', function () {
    it('should call active', function () {
      timesToCheckWidthsBeforeChange = 3;

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, false);

      fontWatchRunner.start();

      expect(asyncCount).toEqual(3);
      expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
    });
  });

  describe('wait for font inactive', function () {
    it('should call inactive', function () {
      timesToCheckWidthsBeforeChange = 10;
      timesToGetTimeBeforeTimeout = 5;

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, false);

      fontWatchRunner.start();

      expect(asyncCount).toEqual(4);
      expect(inactiveCallback).toHaveBeenCalledWith('My Family', 'n4');
    });
  });

  describe('test string', function () {
    var fontWatchRunner = null;

    beforeEach(function () {
      spyOn(domHelper, 'createElement').andCallThrough();
    });

    it('should be the default', function () {
      fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, false);

      expect(domHelper.createElement.mostRecentCall.args[2]).toEqual('BESbswy');
    });

    it('should be a custom string', function () {
      fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, false, {}, 'TestString');

      expect(domHelper.createElement.mostRecentCall.args[2]).toEqual('TestString');
    });

    afterEach(function () {
      // This is just to ensure we don't leave any DOM nodes behind because these
      // tests do not actually do any font watching.
      fontWatchRunner.finish_(function () {});
    });
  });
});
