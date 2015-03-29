describe('LastResortFontWatchRunner', function () {
  var LastResortFontWatchRunner = webfont.LastResortFontWatchRunner,
      Font = webfont.Font,
      DomHelper = webfont.DomHelper,
      FontRuler = webfont.FontRuler;

  var domHelper = null,
      activeCallback = null,
      inactiveCallback = null,
      nullFont = null,
      sourceSansA = null,
      sourceSansB = null,
      elena = null;

  beforeEach(function () {
    domHelper = new DomHelper(window);

    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');

    nullFont = new Font('__webfontloader_test__');
    sourceSansA = new Font('SourceSansA');
    sourceSansB = new Font('SourceSansB');
    elena = new Font('Elena');
  });

  it('should fail to load a null font', function () {
    var fontWatchRunner = new LastResortFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, nullFont, 500, {});

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
    var fontWatchRunner = new LastResortFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, sourceSansA, 5000),
        ruler = new FontRuler(domHelper, 'abcdef'),
        monospace = new Font('monospace'),
        sourceSansAFallback = new Font("'SourceSansA', monospace"),
        activeWidth = null,
        originalWidth = null,
        finalCheck = false;

    runs(function () {
      ruler.insert();
      ruler.setFont(monospace);
      originalWidth = ruler.getWidth();
      ruler.setFont(sourceSansAFallback);
      fontWatchRunner.start();
    });

    waitsFor(function () {
      return activeCallback.wasCalled || inactiveCallback.wasCalled;
    });

    runs(function () {
      expect(activeCallback).toHaveBeenCalledWith(sourceSansA);
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
    var fontWatchRunner = new LastResortFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, elena, 500, {});

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

  it('should load even if @font-face is inserted after watching has started', function () {
    var fontWatchRunner = new LastResortFontWatchRunner(activeCallback, inactiveCallback,
        domHelper, sourceSansB, 5000),
        ruler = new FontRuler(domHelper, 'abcdef'),
        monospace = new Font('monospace'),
        sourceSansBFallback = new Font("'SourceSansB', monospace"),
        activeWidth = null,
        originalWidth = null,
        finalCheck = false;

    runs(function () {
      ruler.insert();
      ruler.setFont(monospace);
      originalWidth = ruler.getWidth();
      ruler.setFont(sourceSansBFallback);
      fontWatchRunner.start();
      var link = document.createElement('link');

      link.rel = "stylesheet";
      link.href= "fixtures/fonts/sourcesansb.css";

      domHelper.insertInto('head', link);
    });

    waitsFor(function () {
      return activeCallback.wasCalled || inactiveCallback.wasCalled;
    });

    runs(function () {
      expect(activeCallback).toHaveBeenCalledWith(sourceSansB);
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
});
