describe('FontWatchRunner', function () {
  var FontWatchRunner = webfont.FontWatchRunner,
      DomHelper = webfont.DomHelper,
      domHelper = new DomHelper(window),
      fontFamily = 'My Family',
      fontDescription = 'n4';

  var timesToCheckWidthsBeforeChange = 0,
      timesToReportChangedWidth = 2,
      fakeFontSizer = {
        getWidth: function (el) {
          if (el.style.fontFamily.indexOf(fontFamily) !== -1) {
            if (timesToCheckWidthsBeforeChange <= 0) {
              timesToReportChangedWidth -= 0.5;
              return 2;
            } else {
              timesToCheckWidthsBeforeChange -= 0.5;
              return 1;
            }
          } else {
            return 1;
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
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription);

      fontWatchRunner.start();

      expect(asyncCount).toEqual(1);
      expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
    });
  });

  describe('wait for font load', function () {
    it('should call active', function () {
      timesToCheckWidthsBeforeChange = 3;

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription);

      fontWatchRunner.start();

      expect(asyncCount).toEqual(4);
      expect(activeCallback).toHaveBeenCalledWith('My Family', 'n4');
    });
  });

  describe('wait for font inactive', function () {
    it('should call inactive', function () {
      timesToCheckWidthsBeforeChange = 10;
      timesToGetTimeBeforeTimeout = 5;

      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription);

      fontWatchRunner.start();

      expect(asyncCount).toEqual(4);
      expect(inactiveCallback).toHaveBeenCalledWith('My Family', 'n4');
    });
  });

  describe('test string', function () {
    beforeEach(function () {
      spyOn(domHelper, 'createElement').andCallThrough();
    });

    it('should be the default', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription);

      expect(domHelper.createElement.mostRecentCall.args[2]).toEqual('BESbswy');
    });

    it('should be a custom string', function () {
      var fontWatchRunner = new FontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fakeFontSizer, fakeAsyncCall, fakeGetTime, fontFamily, fontDescription, 'TestString');

      expect(domHelper.createElement.mostRecentCall.args[2]).toEqual('TestString');
    });
  });
});
