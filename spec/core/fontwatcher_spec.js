describe('FontWatcher', function () {
  var FontWatcher = webfont.FontWatcher,
      UserAgent = webfont.UserAgent,
      BrowserInfo = webfont.BrowserInfo,
      DomHelper = webfont.DomHelper,
      domHelper = new DomHelper(window),
      eventDispatcher = {},
      testStrings = null,
      timeout = null,
      userAgent = null,
      activeFontFamilies = [];

  beforeEach(function () {
    userAgent = new UserAgent('Firefox', '3.6', 'Gecko', '1.9.3', 'Macintosh', '10.6', undefined, new BrowserInfo(true, false, false));
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
    fontFamily, fontDescription, browserInfo, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString) {
    this.activeCallback = activeCallback;
    this.inactiveCallback = inactiveCallback;
    this.fontFamily = fontFamily;
    this.fontDescription = fontDescription;
    timeout(opt_timeout);

    if (opt_fontTestString) {
      testStrings(opt_fontTestString);
    }
  }

  FakeFontWatchRunner.prototype.start = function () {
    if (activeFontFamilies.indexOf(this.fontFamily) > -1) {
      this.activeCallback(this.fontFamily, this.fontDescription);
    } else {
      this.inactiveCallback(this.fontFamily, this.fontDescription);
    }
  };

  describe('watch zero fonts', function () {
    it('should call inactive when there are no fonts to load', function () {
      activeFontFamilies = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch([], {}, {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });
  });

  describe('watch one font not last', function () {
    it('should not call font inactive, inactive or active', function () {
      activeFontFamilies = ['fontFamily1'];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch(['fontFamily1'], {}, {}, FakeFontWatchRunner, false);
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch one font active', function () {
    it('should call font active and active', function () {
      activeFontFamilies = ['fontFamily1'];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch(['fontFamily1'], {}, {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily1', 'n4');
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith('fontFamily1', 'n4');
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch one font inactive', function () {
    it('should call inactive', function () {
      activeFontFamilies = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch(['fontFamily1'], {}, {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily1', 'n4');
      expect(eventDispatcher.dispatchFontActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith('fontFamily1', 'n4');
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts active', function () {
    it('should call font active and active', function () {
      activeFontFamilies = ['fontFamily1', 'fontFamily2', 'fontFamily3'];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch(['fontFamily1', 'fontFamily2', 'fontFamily3'], {}, {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily1', 'n4');
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith('fontFamily1', 'n4');
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts inactive', function () {
    it('should call inactive', function () {
      activeFontFamilies = [];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch(['fontFamily1', 'fontFamily2', 'fontFamily3'], {}, {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily1', 'n4');
      expect(eventDispatcher.dispatchFontActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith('fontFamily1', 'n4');
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts mixed', function () {
    it('should call the correct callbacks', function () {
      activeFontFamilies = ['fontFamily1', 'fontFamily3'];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch(['fontFamily1', 'fontFamily2', 'fontFamily3'], {}, {}, FakeFontWatchRunner, true);
      expect(eventDispatcher.dispatchFontLoading.callCount).toEqual(3);
      expect(eventDispatcher.dispatchFontLoading.calls[0].args[0]).toEqual('fontFamily1');
      expect(eventDispatcher.dispatchFontLoading.calls[1].args[0]).toEqual('fontFamily2');
      expect(eventDispatcher.dispatchFontLoading.calls[2].args[0]).toEqual('fontFamily3');

      expect(eventDispatcher.dispatchFontActive.callCount).toEqual(2);
      expect(eventDispatcher.dispatchFontActive.calls[0].args[0]).toEqual('fontFamily1');
      expect(eventDispatcher.dispatchFontActive.calls[1].args[0]).toEqual('fontFamily3');

      expect(eventDispatcher.dispatchFontInactive.callCount).toEqual(1);
      expect(eventDispatcher.dispatchFontInactive.calls[0].args[0]).toEqual('fontFamily2');

      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts with descriptions', function () {
    it('should call the correct callbacks', function () {
      activeFontFamilies = ['fontFamily1', 'fontFamily2'];
      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch(['fontFamily1', 'fontFamily2', 'fontFamily3'], {
        'fontFamily1': ['i7'],
        'fontFamily2': null,
        'fontFamily3': ['n4', 'i4', 'n7']
      }, {}, FakeFontWatchRunner, true);

      expect(eventDispatcher.dispatchFontLoading.callCount).toEqual(5);
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily1', 'i7');
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily2', 'n4');
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily3', 'n4');
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily3', 'i4');
      expect(eventDispatcher.dispatchFontLoading).toHaveBeenCalledWith('fontFamily3', 'n7');

      expect(eventDispatcher.dispatchFontActive.callCount).toEqual(2);
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith('fontFamily1', 'i7');
      expect(eventDispatcher.dispatchFontActive).toHaveBeenCalledWith('fontFamily2', 'n4');

      expect(eventDispatcher.dispatchFontInactive.callCount).toEqual(3);
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith('fontFamily3', 'n4');
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith('fontFamily3', 'i4');
      expect(eventDispatcher.dispatchFontInactive).toHaveBeenCalledWith('fontFamily3', 'n7');

      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).toHaveBeenCalled();
    });
  });

  describe('watch multiple fonts with test strings', function () {
    it('should use the correct tests strings', function () {
      activeFontFamilies = ['fontFamily1', 'fontFamily2'];

      var fontWatcher = new FontWatcher(userAgent, domHelper, eventDispatcher);

      fontWatcher.watch(['fontFamily1', 'fontFamily2', 'fontFamily3', 'fontFamily4'], {}, {
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

    fontWatcher.watch(['fontFamily1'], {}, {}, FakeFontWatchRunner, true);

    expect(timeout).toHaveBeenCalledWith(4000);
  });
});
