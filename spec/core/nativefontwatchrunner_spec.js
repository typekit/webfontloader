describe('NativeFontWatchRunner', function () {
  var NativeFontWatchRunner = webfont.NativeFontWatchRunner,
      Font = webfont.Font,
      DomHelper = webfont.DomHelper,
      FontRuler = webfont.FontRuler;

  var domHelper = null,
      activeCallback = null,
      inactiveCallback = null,
      nullFont = null,
      elena = null,
      loadFontGenerator = null;

  beforeEach(function () {
    domHelper = new DomHelper(window);

    activeCallback = jasmine.createSpy('activeCallback');
    inactiveCallback = jasmine.createSpy('inactiveCallback');

    nullFont = new Font('__webfontloader_test_3__');
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

    loadFontGenerator = function(fontName) {
      var baseFont = new Font(fontName);
      return function() {
        var fontWatchRunner = new NativeFontWatchRunner(activeCallback, inactiveCallback,
            domHelper, baseFont),
            ruler = new FontRuler(domHelper, 'abcdef'),
            monospace = new Font('monospace'),
            fallbackFont = new Font(fontName + ', monospace'),
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
          expect(activeCallback).toHaveBeenCalledWith(baseFont);
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
      };
    }

    it('should load font succesfully', loadFontGenerator('SourceSansC'));

    it('should load font imported multiple times successfully', loadFontGenerator('SourceSansE'))

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
