describe('EventDispatcher', function () {
  var EventDispatcher = webfont.EventDispatcher,
      DomHelper = webfont.DomHelper,
      FontFamily = webfont.FontFamily,
      FontVariationDescription = webfont.FontVariationDescription,
      domHelper = new DomHelper(window),
      element = null
      eventDispatcher = null,
      namespace = 'ns',
      fontFamily = null,
      nullFn = function () {},
      callbacks = {
        loading: nullFn,
        active: nullFn,
        inactive: nullFn,
        fontloading: nullFn,
        fontactive: nullFn,
        fontinactive: nullFn
      };

  beforeEach(function () {
    element = domHelper.createElement();
    eventDispatcher = new EventDispatcher(domHelper, element, callbacks, namespace);

    fontFamily = new FontFamily('My Family', new FontVariationDescription('n4'));

    spyOn(callbacks, 'loading');
    spyOn(callbacks, 'active');
    spyOn(callbacks, 'inactive');
    spyOn(callbacks, 'fontloading');
    spyOn(callbacks, 'fontactive');
    spyOn(callbacks, 'fontinactive');
  });

  describe('#dispatchLoading', function () {
    beforeEach(function () {
      eventDispatcher.dispatchLoading();
    });

    it('should call the correct callback', function () {
      expect(callbacks.loading).toHaveBeenCalled();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-loading');
    });
  });

  describe('#dispatchFontLoading', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontLoading(fontFamily);
    });

    it('should call the correct callback', function () {
      expect(callbacks.fontloading).toHaveBeenCalledWith(fontFamily);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-loading');
    });
  });

  describe('#dispatchFontInactive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontInactive(fontFamily);
    });

    it('should call the correct callback', function () {
      expect(callbacks.fontinactive).toHaveBeenCalledWith(fontFamily);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-inactive');
    });
  });

  describe('#dispatchFontInactive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontLoading(fontFamily);
      eventDispatcher.dispatchFontInactive(fontFamily);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-inactive');
    });
  });

  describe('#dispatchFontInactive - with active class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontActive(fontFamily);
      eventDispatcher.dispatchFontInactive(fontFamily);
    });

    it('should not append the inactive class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-active');
    });

    it('should still call the correct callback', function () {
      expect(callbacks.fontinactive).toHaveBeenCalledWith(fontFamily);
    });
  });

  describe('#dispatchFontActive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontActive(fontFamily);
    });

    it('should call the correct callback', function () {
      expect(callbacks.fontactive).toHaveBeenCalledWith(fontFamily);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-active');
    });
  });

  describe('#dispatchFontActive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontLoading(fontFamily);
      eventDispatcher.dispatchFontActive(fontFamily);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-active');
    });
  });

  describe('#dispatchFontActive - with inactive class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontInactive(fontFamily);
      eventDispatcher.dispatchFontActive(fontFamily);
    });

    it('should set the correct class', function () {
      expect(element.className).toEqual('ns-myfamily-n4-active');
    });
  });

  describe('#dispatchInactive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchInactive();
    });

    it('should call the correct callback', function () {
      expect(callbacks.inactive).toHaveBeenCalled();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-inactive');
    });
  });

  describe('#dispatchInactive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchLoading();
      eventDispatcher.dispatchInactive();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-inactive');
    });
  });

  describe('#dispatchInactive - with active class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchActive();
      eventDispatcher.dispatchInactive();
    });

    it('should not set the the inactive class', function () {
      expect(element.className).toEqual('ns-active');
    });

    it('should still call the inactive callback', function () {
      expect(callbacks.inactive).toHaveBeenCalled();
    });
  });

  describe('#dispatchActive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchActive();
    });

    it('should call the correct callback', function () {
      expect(callbacks.active).toHaveBeenCalled();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-active');
    });
  });

  describe('#dispatchActive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchLoading();
      eventDispatcher.dispatchActive();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-active');
    });
  });

  describe('#dispatchActive - with inactive class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchInactive();
      eventDispatcher.dispatchActive();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-active');
    });
  });
});
