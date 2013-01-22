describe('FontWatcher', function () {
  var FontWatcher = webfont.FontWatcher,
      DomHelper = webfont.DomHelper,
      domHelper = new DomHelper(window),
      eventDispatcher = {},
      activeFontFamilies = [];

  beforeEach(function () {
    activeFontFamilies = [];
    eventDispatcher.dispatchLoading = jasmine.createSpy('dispatchLoading');
    eventDispatcher.dispatchFontLoading = jasmine.createSpy('dispatchFontLoading');
    eventDispatcher.dispatchFontActive = jasmine.createSpy('dispatchFontActive');
    eventDispatcher.dispatchFontInactive = jasmine.createSpy('dispatchFontInactive');
    eventDispatcher.dispatchActive = jasmine.createSpy('dispatchActive');
    eventDispatcher.dispatchInactive = jasmine.createSpy('dispatchInactive');
  });

  function FakeFontWatchRunner(activeCallback, inactiveCallback, domHelper, fontSizer, asyncCall, getTime,
    fontFamily, fontDescription, opt_fontTestString) {
    this.activeCallback = activeCallback;
    this.inactiveCallback = inactiveCallback;
    this.fontFamily = fontFamily;
    this.fontDescription = fontDescription;
  }

  FakeFontWatchRunner.prototype.start = function () {
    if (activeFontFamilies.indexOf(this.fontFamily) > -1) {
      this.activeCallback(this.fontFamily, this.fontDescription);
    } else {
      this.inactiveCallback(this.fontFamily, this.fontDescription);
    }
  };

  describe('watch one font not last', function () {
    it('should not call font inactive, inactive or active', function () {
      activeFontFamilies = ['fontFamily1'];
      var fontWatcher = new FontWatcher(domHelper, eventDispatcher, jasmine.createSpy('fakeFontSizer'),
          jasmine.createSpy('fakeAsyncCall'), jasmine.createSpy('fakeGetTime'));

      fontWatcher.watch(['fontFamily1'], {}, {}, FakeFontWatchRunner, false);
      expect(eventDispatcher.dispatchFontInactive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchActive).not.toHaveBeenCalled();
      expect(eventDispatcher.dispatchInactive).not.toHaveBeenCalled();
    });
  });

  describe('watch one font active', function () {
    it('should call font active and active', function () {
      activeFontFamilies = ['fontFamily1'];
      var fontWatcher = new FontWatcher(domHelper, eventDispatcher, jasmine.createSpy('fakeFontSizer'),
          jasmine.createSpy('fakeAsyncCall'), jasmine.createSpy('fakeGetTime'));

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
      var fontWatcher = new FontWatcher(domHelper, eventDispatcher, jasmine.createSpy('fakeFontSizer'),
          jasmine.createSpy('fakeAsyncCall'), jasmine.createSpy('fakeGetTime'));

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
      var fontWatcher = new FontWatcher(domHelper, eventDispatcher, jasmine.createSpy('fakeFontSizer'),
          jasmine.createSpy('fakeAsyncCall'), jasmine.createSpy('fakeGetTime'));

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
      var fontWatcher = new FontWatcher(domHelper, eventDispatcher, jasmine.createSpy('fakeFontSizer'),
          jasmine.createSpy('fakeAsyncCall'), jasmine.createSpy('fakeGetTime'));

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
      var fontWatcher = new FontWatcher(domHelper, eventDispatcher, jasmine.createSpy('fakeFontSizer'),
          jasmine.createSpy('fakeAsyncCall'), jasmine.createSpy('fakeGetTime'));

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
});
