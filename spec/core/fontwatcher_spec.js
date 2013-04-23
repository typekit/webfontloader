describe('FontWatcher', function () {
  var FontWatcher = webfont.FontWatcher,
      FontWatchRunner = webfont.FontWatchRunner,
      Font = webfont.Font,
      UserAgent = webfont.UserAgent,
      BrowserInfo = webfont.BrowserInfo,
      DomHelper = webfont.DomHelper,
      domHelper = new DomHelper(window),
      eventDispatcher = {},
      testStrings = null,
      timeout = null,
      font1 = null,
      font2 = null,
      font3 = null,
      font4 = null,
      userAgent = null,
      activeFonts = [];

  beforeEach(function () {
    userAgent = new UserAgent('Firefox', '3.6', 'Gecko', '1.9.3', 'Macintosh', '10.6', undefined, new BrowserInfo(true, false, false));
    font1 = new Font('font1');
    font2 = new Font('font2');
    font3 = new Font('font3');
    font4 = new Font('font4');
    activeFonts = [];
    testStrings = jasmine.createSpy('testStrings');
    timeout = jasmine.createSpy('timeout');
    eventDispatcher.dispatchLoading = jasmine.createSpy('dispatchLoading');
    eventDispatcher.dispatchFontLoading = jasmine.createSpy('dispatchFontLoading');
    eventDispatcher.dispatchFontActive = jasmine.createSpy('dispatchFontActive');
    eventDispatcher.dispatchFontInactive = jasmine.createSpy('dispatchFontInactive');
    eventDispatcher.dispatchActive = jasmine.createSpy('dispatchActive');
    eventDispatcher.dispatchInactive = jasmine.createSpy('dispatchInactive');

    spyOn(FontWatchRunner.prototype, 'start').andCallFake(function (font, fontTestString) {
      var found = false;

      testStrings(this.fontTestString_);
      timeout(this.timeout_);

      for (var i = 0; i < activeFonts.length; i += 1) {
        if (activeFonts[i].getName() === this.font_.getName()) {
          found = true;
          break;
        }
      }

      if (found) {
        this.activeCallback_(this.font_);
      } else {
        this.inactiveCallback_(this.font_);
      }
    });
  });

  describe('watch zero fonts', function () {
    it('should call inactive when there are no fonts to load', function () {
      activeFonts = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([], {}, true);
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });

    it('should not call inactive when there are no fonts to load, but this is not the last set', function () {
      activeFonts = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([], {}, false);
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch one font not last', function () {
    it('should not call font inactive, inactive or active', function () {
      activeFonts = [font1];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([font1], {}, false);
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch one font active', function () {
    it('should call font active and active', function () {
      activeFonts = [font1];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([font1], {}, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font1);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith(font1);
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch one font inactive', function () {
    it('should call inactive', function () {
      activeFonts = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([font1], {}, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font1);
      expect(eventDispatcher.dispatchFontActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(font1);
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts active', function () {
    it('should call font active and active', function () {
      activeFonts = [font1, font2, font3];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([font1, font2, font3], {}, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font1);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith(font1);
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts inactive', function () {
    it('should call inactive', function () {
      activeFonts = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([font1, font2, font3], {}, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font1);
      expect(eventDispatcher.dispatchFontActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(font1);
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts mixed', function () {
    it('should call the correct callbacks', function () {
      activeFonts = [font1, font3];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([font1, font2, font3], {}, true);
      expect(eventDispatcher.dispatchFontLoading.callCount).toEqual(3);
      expect(eventDispatcher.dispatchFontLoading.calls[0].args[0]).toEqual(font1);
      expect(eventDispatcher.dispatchFontLoading.calls[1].args[0]).toEqual(font2);
      expect(eventDispatcher.dispatchFontLoading.calls[2].args[0]).toEqual(font3);

      expect(eventDispatcher.dispatchFontActive.callCount).toEqual(2);
      expect(eventDispatcher.dispatchFontActive.calls[0].args[0]).toEqual(font1);
      expect(eventDispatcher.dispatchFontActive.calls[1].args[0]).toEqual(font3);

      expect(eventDispatcher.dispatchFontInactive.callCount).toEqual(1);
      expect(eventDispatcher.dispatchFontInactive.calls[0].args[0]).toEqual(font2);

      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts with descriptions', function () {
    it('should call the correct callbacks', function () {
      var font5 = new Font('font4', 'i7'),
          font6 = new Font('font5'),
          font7 = new Font('font6'),
          font8 = new Font('font7', 'i4'),
          font9 = new Font('font8', 'n7');

      activeFonts = [font5, font6];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([font5, font6, font7, font8, font9], {}, true);

      expect(eventDispatcher.dispatchFontLoading.callCount).toEqual(5);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font5);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font6);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font7);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font8);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith(font9);

      expect(eventDispatcher.dispatchFontActive.callCount).toEqual(2);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith(font5);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith(font6);

      expect(eventDispatcher.dispatchFontInactive.callCount).toEqual(3);
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(font7);
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(font8);
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith(font9);

      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts with test strings', function () {
    it('should use the correct tests strings', function () {
      activeFonts = [font1, font2];

      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([font1, font2, font3, font4], {
        'font1': 'testString1',
        'font2': null,
        'font3': 'testString2',
        'font4': null
      }, true);

      expect(testStrings.callCount).toEqual(4);
      expect(testStrings).toHaveBeenCalledWith('testString1');
      expect(testStrings).toHaveBeenCalledWith('testString2');
    });
  });

  it('should pass on the timeout to FontWatchRunner', function () {
    var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher, 4000);

    fontWatcher.watch([font1], {}, true);

    expect(timeout).toHaveBeenCalledWith(4000);
  });
});
