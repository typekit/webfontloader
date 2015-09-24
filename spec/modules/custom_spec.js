describe('modules.Custom', function () {
  var Custom = webfont.modules.Custom,
      FontFamily = webfont.FontFamily,
      Any = jasmine.Matchers.Any;

  describe('insert links correctly', function () {
    var fakeDomHelper = null,
        load = null;

    function notiySheetsLoaded() {
      var argsForCall = fakeDomHelper.loadStylesheet.argsForCall;
      for (var i = 0; i < argsForCall.length; i++) {
        var args = argsForCall[i];
        args[1]();
      }
    }

    beforeEach(function () {
      fakeDomHelper = {
        loadStylesheet: jasmine.createSpy('createCssLink')
      };

      load = jasmine.createSpy('load');

      var defaultModule = new Custom(fakeDomHelper, {
        families: ['Font1', 'Font2', 'Font3'],
        urls: ['http://moo', 'http://meuh'],
        testStrings: {
          Font3: 'hello world'
        }
      });

      defaultModule.load(load);
    });

    it('should have inserted the links correctly', function () {
      expect(fakeDomHelper.loadStylesheet.callCount).toEqual(2);
      expect(fakeDomHelper.loadStylesheet).toHaveBeenCalledWith('http://moo', new Any(Function));
      expect(fakeDomHelper.loadStylesheet).toHaveBeenCalledWith('http://meuh', new Any(Function));
    });

    if (webfont.StyleSheetWaiter.shouldWait) {
      it('should not invoke callback before all CSS are loaded', function () {
        expect(load.callCount).toEqual(0);
        notiySheetsLoaded();
        expect(load.callCount).toEqual(1);
      });
    }

    it('should have loaded the families correctly', function () {
      notiySheetsLoaded();
      expect(load.callCount).toEqual(1);
      expect(load.calls[0].args[0].length).toEqual(3);
      expect(load.calls[0].args[0][0].getName()).toEqual('Font1');
      expect(load.calls[0].args[0][1].getName()).toEqual('Font2');
      expect(load.calls[0].args[0][2].getName()).toEqual('Font3');
    });

    it('should have set a custom test string', function () {
      notiySheetsLoaded();
      expect(load.callCount).toEqual(1);
      expect(load.calls[0].args[1]).toEqual({ Font3: 'hello world' });
    });
  });

});
