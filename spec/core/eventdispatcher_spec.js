describe('EventDispatcher', function () {
  var EventDispatcher = webfont.EventDispatcher,
      DomHelper = webfont.DomHelper,
      Font = webfont.Font,
      domHelper = new DomHelper(window),
      element = null
      eventDispatcher = null,
      namespace = 'ns',
      font = null;

  beforeEach(function () {
    element = domHelper.createElement();
    callbacks = {
      loading: jasmine.createSpy('loading'),
      active: jasmine.createSpy('active'),
      inactive: jasmine.createSpy('inactive'),
      fontloading: jasmine.createSpy('fontloading'),
      fontactive: jasmine.createSpy('fontactive'),
      fontinactive: jasmine.createSpy('fontinactive')
    };

    eventDispatcher = new EventDispatcher(domHelper, element, callbacks, namespace);

    font = new Font('My Family', 'n4');
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
      eventDispatcher.dispatchFontLoading(font);
    });

    it('should call the correct callback', function () {
      expect(callbacks.fontloading).toHaveBeenCalledWith('My Family', 'n4');
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-loading');
    });
  });

  describe('#dispatchFontInactive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontInactive(font);
    });

    it('should call the correct callback', function () {
      expect(callbacks.fontinactive).toHaveBeenCalledWith('My Family', 'n4');
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-inactive');
    });
  });

  describe('#dispatchFontInactive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontLoading(font);
      eventDispatcher.dispatchFontInactive(font);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-inactive');
    });
  });

  describe('#dispatchFontInactive - with active class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontActive(font);
      eventDispatcher.dispatchFontInactive(font);
    });

    it('should not append the inactive class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-active');
    });

    it('should still call the correct callback', function () {
      expect(callbacks.fontinactive).toHaveBeenCalledWith('My Family', 'n4');
    });
  });

  describe('#dispatchFontActive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontActive(font);
    });

    it('should call the correct callback', function () {
      expect(callbacks.fontactive).toHaveBeenCalledWith('My Family', 'n4');
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-active');
    });
  });

  describe('#dispatchFontActive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontLoading(font);
      eventDispatcher.dispatchFontActive(font);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('ns-myfamily-n4-active');
    });
  });

  describe('#dispatchFontActive - with inactive class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontInactive(font);
      eventDispatcher.dispatchFontActive(font);
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

  describe('disable callbacks', function () {
    beforeEach(function () {
      eventDispatcher = new EventDispatcher(domHelper, element, callbacks, namespace, false);
      eventDispatcher.dispatchInactive();
      eventDispatcher.dispatchActive();
      eventDispatcher.dispatchLoading();
      eventDispatcher.dispatchFontInactive(font);
      eventDispatcher.dispatchFontActive(font);
      eventDispatcher.dispatchFontLoading(font);
    });

    it('should not fire any events', function () {
      expect(callbacks.inactive).not.toHaveBeenCalled();
      expect(callbacks.active).not.toHaveBeenCalled();
      expect(callbacks.loading).not.toHaveBeenCalled();
      expect(callbacks.fontinactive).not.toHaveBeenCalled();
      expect(callbacks.fontactive).not.toHaveBeenCalled();
      expect(callbacks.fontloading).not.toHaveBeenCalled();
    });
  });

  describe('disable classes', function () {
    beforeEach(function () {
      eventDispatcher = new EventDispatcher(domHelper, element, callbacks, namespace, true, false);
      eventDispatcher.dispatchInactive();
      eventDispatcher.dispatchActive();
      eventDispatcher.dispatchLoading();
      eventDispatcher.dispatchFontInactive(font);
      eventDispatcher.dispatchFontActive(font);
      eventDispatcher.dispatchFontLoading(font);
    });

    it('should not fire any events', function () {
      expect(element.className).toEqual('');
    });
  });
});
