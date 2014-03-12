describe('NativeFontWatchRunner', function () {
  var NativeFontWatchRunner = webfont.NativeFontWatchRunner,
      Font = webfont.Font,
      UserAgentParser = webfont.UserAgentParser,
      DomHelper = webfont.DomHelper,
      FontRuler = webfont.FontRuler;

  var domHelper = null,
      activeCallback = null,
      inactiveCallback = null,
      userAgent = null,
      nullFont = null,
      sourceSansC = null,
      sourceSansD = null,
      elena = null;

  beforeEach(function () {
    domHelper = new DomHelper(window);

    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');

    var userAgentParser = new UserAgentParser(window.navigator.userAgent, window.document);

    nullFont = new Font('__webfontloader_test_3__');
    sourceSansC = new Font('SourceSansC');
    sourceSansD = new Font('SourceSansD');
    elena = new Font('Elena');

    userAgent = userAgentParser.parse();
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

    it('should load font succesfully', function () {
      var fontWatchRunner = new NativeFontWatchRunner(activeCallback, inactiveCallback,
          domHelper, sourceSansC),
          ruler = new FontRuler(domHelper, 'abcdef'),
          monospace = new Font('monospace'),
          sourceSansCFallback = new Font('SourceSansC, monospace'),
          activeWidth = null,
          originalWidth = null,
          finalCheck = false;

      runs(function () {
        ruler.insert();
        ruler.setFont(monospace);
        originalWidth = ruler.getWidth();
        ruler.setFont(sourceSansCFallback);
        fontWatchRunner.start();
      });

      waitsFor(function () {
        return activeCallback.wasCalled || inactiveCallback.wasCalled;
      });

      runs(function () {
        expect(activeCallback).toHaveBeenCalledWith(sourceSansC);
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
    });

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
