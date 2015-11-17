describe('NativeFontWatchRunner', function () {
  var NativeFontWatchRunner = webfont.NativeFontWatchRunner,
      Font = webfont.Font,
      DomHelper = webfont.DomHelper,
      FontRuler = webfont.FontRuler;

  var domHelper = null,
      activeCallback = null,
      inactiveCallback = null,
      nullFont = null,
      sourceSansC = null,
      sourceSansDup = null,
      elena = null;

  beforeEach(function () {
    domHelper = new DomHelper(window);

    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');

    nullFont = new Font('__webfontloader_test_3__');
    sourceSansC = new Font('SourceSansC');
    sourceSansDup = new Font('SourceSansDup');
    elena = new Font('Elena');
  });

  if (window['FontFace']) {
    it('should fail to load a null font', function () {
      var fontWatchRunner = new NativeFontWatchRunner(activeCallback, inactiveCallback,
          domHelper, nullFont);

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

    function succesfulLoadingSpec(getFontToBeLoaded, getFontNameToBeLoaded) {
      var fontToBeLoaded = getFontToBeLoaded(),
          fontNameToBeLoaded = getFontNameToBeLoaded(),
          fontWatchRunner = new NativeFontWatchRunner(activeCallback, inactiveCallback,
          domHelper, fontToBeLoaded),
          ruler = new FontRuler(domHelper, 'abcdef'),
          monospace = new Font('monospace'),
          fallbackFont = new Font(fontNameToBeLoaded + ', monospace'),
          activeWidth = null,
          originalWidth = null,
          finalCheck = false;

      runs(function () {
        ruler.insert();
        ruler.setFont(monospace);
        originalWidth = ruler.getWidth();
        ruler.setFont(fallbackFont);
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(activeCallback).toHaveBeenCalledWith(fontToBeLoaded);
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
    }

    it('should load font succesfully',
       succesfulLoadingSpec.bind(null, function() { return sourceSansC; }, function() { return 'SourceSansC'; }));

    it('should load font succesfully even if it is duplicated',
       succesfulLoadingSpec.bind(null, function() { return sourceSansDup; }, function() { return 'SourceSansDup'; }));

    it('should attempt to load a non-existing font', function () {
      var fontWatchRunner = new NativeFontWatchRunner(activeCallback, inactiveCallback,
          domHelper, elena);

      runs(function () {
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(inactiveCallback).toHaveBeenCalledWith(elena);
      });
    });
  }
});
