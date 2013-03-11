describe('FontWatcher', function () {
  var FontWatcher = webfont.FontWatcher,
      FontFamily = webfont.FontFamily,
      FontVariationDescription = webfont.FontVariationDescription,
      UserAgent = webfont.UserAgent,
      BrowserInfo = webfont.BrowserInfo,
      DomHelper = webfont.DomHelper,
      domHelper = new DomHelper(window),
      eventDispatcher = {},
      testStrings = null,
      timeout = null,
      fontFamily1 = null,
      fontFamily2 = null,
      fontFamily3 = null,
      fontFamily4 = null,
      userAgent = null,
      activeFontFamilies = [];

  beforeEach(function () {
    userAgent = new UserAgent('Firefox', '3.6', 'Gecko', '1.9.3', 'Macintosh', '10.6', undefined, new BrowserInfo(true, false, false));
    fontFamily1 = new FontFamily('fontFamily1');
    fontFamily2 = new FontFamily('fontFamily2');
    fontFamily3 = new FontFamily('fontFamily3');
    fontFamily4 = new FontFamily('fontFamily4');
    activeFontFamilies = [];
    testStrings = jasmine.createSpy('testStrings');
    timeout = jasmine.createSpy('timeout');
    eventDispatcher.dispatchLoading = jasmine.createSpy('dispatchLoading');
    eventDispatcher.dispatchFontLoading = jasmine.createSpy('dispatchFontLoading');
    eventDispatcher.dispatchFontActive = jasmine.createSpy('dispatchFontActive');
    eventDispatcher.dispatchFontInactive = jasmine.createSpy('dispatchFontInactive');
    eventDispatcher.dispatchActive = jasmine.createSpy('dispatchActive');
    eventDispatcher.dispatchInactive = jasmine.createSpy('dispatchInactive');
  });

  function FakeFontWatchRunner(activeCallback, inactiveCallback, domHelper,
    fontFamily, browserInfo, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString) {
    this.activeCallback = activeCallback;
    this.inactiveCallback = inactiveCallback;
    this.fontFamily = fontFamily;
    timeout(opt_timeout);

    if (opt_fontTestString) {
      testStrings(opt_fontTestString);
    }
  }

  FakeFontWatchRunner.prototype.start = function () {
    var found = false;

    for (var i = 0; i < activeFontFamilies.length; i += 1) {
      if (activeFontFamilies[i].getName() === this.fontFamily.getName()) {
        found = true;
        break;
      }
    }
    if (found) {
      this.activeCallback(this.fontFamily);
    } else {
      this.inactiveCallback(this.fontFamily);
    }
  };

  describe('watch zero fonts', function () {
    it('should call inactive when there are no fonts to load', function () {
      activeFontFamilies = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([], {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });
  });

  describe('watch one font not last', function () {
    it('should not call font inactive, inactive or active', function () {
      activeFontFamilies = [fontFamily1];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([fontFamily1], {}, FakeFontWatchRunner, false);
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch one font active', function () {
    it('should call font active and active', function () {
      activeFontFamilies = [fontFamily1];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([fontFamily1], {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily1);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith(fontFamily1);
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch one font inactive', function () {
    it('should call inactive', function () {
      activeFontFamilies = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([fontFamily1], {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily1);
      expect(eventDispatcher.dispatchFontActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(fontFamily1);
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts active', function () {
    it('should call font active and active', function () {
      activeFontFamilies = [fontFamily1, fontFamily2, fontFamily3];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([fontFamily1, fontFamily2, fontFamily3], {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily1);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith(fontFamily1);
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts inactive', function () {
    it('should call inactive', function () {
      activeFontFamilies = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([fontFamily1, fontFamily2, fontFamily3], {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily1);
      expect(eventDispatcher.dispatchFontActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(fontFamily1);
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts mixed', function () {
    it('should call the correct callbacks', function () {
      activeFontFamilies = [fontFamily1, fontFamily3];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([fontFamily1, fontFamily2, fontFamily3], {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading.callCount).toEqual(3);
      expect(eventDispatcher.dispatchFontLoading.calls[0].args[0]).toEqual(fontFamily1);
      expect(eventDispatcher.dispatchFontLoading.calls[1].args[0]).toEqual(fontFamily2);
      expect(eventDispatcher.dispatchFontLoading.calls[2].args[0]).toEqual(fontFamily3);

      expect(eventDispatcher.dispatchFontActive.callCount).toEqual(2);
      expect(eventDispatcher.dispatchFontActive.calls[0].args[0]).toEqual(fontFamily1);
      expect(eventDispatcher.dispatchFontActive.calls[1].args[0]).toEqual(fontFamily3);

      expect(eventDispatcher.dispatchFontInactive.callCount).toEqual(1);
      expect(eventDispatcher.dispatchFontInactive.calls[0].args[0]).toEqual(fontFamily2);

      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts with descriptions', function () {
    it('should call the correct callbacks', function () {
      var fontFamily5 = new FontFamily('fontFamily4', new FontVariationDescription('i7')),
          fontFamily6 = new FontFamily('fontFamily5'),
          fontFamily7 = new FontFamily('fontFamily6'),
          fontFamily8 = new FontFamily('fontFamily7', new FontVariationDescription('i4')),
          fontFamily9 = new FontFamily('fontFamily8', new FontVariationDescription('n7'));

      activeFontFamilies = [fontFamily5, fontFamily6];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([fontFamily5, fontFamily6, fontFamily7, fontFamily8, fontFamily9], {}, FakeFontWatchRunner, true);

      expect(eventDispatcher.dispatchFontLoading.callCount).toEqual(5);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily5);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily6);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily7);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily8);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(fontFamily9);

      expect(eventDispatcher.dispatchFontActive.callCount).toEqual(2);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith(fontFamily5);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith(fontFamily6);

      expect(eventDispatcher.dispatchFontInactive.callCount).toEqual(3);
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(fontFamily7);
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(fontFamily8);
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(fontFamily9);

      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts with test strings', function () {
    it('should use the correct tests strings', function () {
      activeFontFamilies = [fontFamily1, fontFamily2];

      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([fontFamily1, fontFamily2, fontFamily3, fontFamily4], {
        'fontFamily1': 'testString1',
        'fontFamily2': null,
        'fontFamily3': 'testString2',
        'fontFamily4': null
      }, FakeFontWatchRunner, true);

      expect(testStrings.callCount).toEqual(2);
      expect(testStrings).toHaveBeenCalledWith('testString1');
      expect(testStrings).toHaveBeenCalledWith('testString2');
    });
  });

  it('should pass on the timeout to FontWatchRunner', function () {
    var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher, 4000);

    fontWatcher.watch([fontFamily1], {}, FakeFontWatchRunner, true);

    expect(timeout).toHaveBeenCalledWith(4000);
  });
});
