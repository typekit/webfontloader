describe('EventDispatcher', function () {
  var EventDispatcher = webfont.EventDispatcher,
      DomHelper = webfont.DomHelper,
      Font = webfont.Font,
      domHelper = new DomHelper(window),
      element = null
      eventDispatcher = null,
      font = null;

  beforeEach(function () {
    element = domHelper.getLoadWindow().document.documentElement;
    config = {
      loading: jasmine.createSpy('loading'),
      active: jasmine.createSpy('active'),
      inactive: jasmine.createSpy('inactive'),
      fontloading: jasmine.createSpy('fontloading'),
      fontactive: jasmine.createSpy('fontactive'),
      fontinactive: jasmine.createSpy('fontinactive'),
      classes: true,
      events: true
    };

    element.className = '';

    eventDispatcher = new EventDispatcher(domHelper, config);

    font = new Font('My Family', 'n4');
  });

  describe('#dispatchLoading', function () {
    beforeEach(function () {
      eventDispatcher.dispatchLoading();
    });

    it('should call the correct callback', function () {
      expect(config.loading).toHaveBeenCalled();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-loading');
    });
  });

  describe('#dispatchFontLoading', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontLoading(font);
    });

    it('should call the correct callback', function () {
      expect(config.fontloading).toHaveBeenCalledWith('My Family', 'n4');
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-myfamily-n4-loading');
    });
  });

  describe('#dispatchFontInactive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontInactive(font);
    });

    it('should call the correct callback', function () {
      expect(config.fontinactive).toHaveBeenCalledWith('My Family', 'n4');
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-myfamily-n4-inactive');
    });
  });

  describe('#dispatchFontInactive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontLoading(font);
      eventDispatcher.dispatchFontInactive(font);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-myfamily-n4-inactive');
    });
  });

  describe('#dispatchFontInactive - with active class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontActive(font);
      eventDispatcher.dispatchFontInactive(font);
    });

    it('should not append the inactive class name', function () {
      expect(element.className).toEqual('wf-myfamily-n4-active');
    });

    it('should still call the correct callback', function () {
      expect(config.fontinactive).toHaveBeenCalledWith('My Family', 'n4');
    });
  });

  describe('#dispatchFontActive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontActive(font);
    });

    it('should call the correct callback', function () {
      expect(config.fontactive).toHaveBeenCalledWith('My Family', 'n4');
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-myfamily-n4-active');
    });
  });

  describe('#dispatchFontActive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontLoading(font);
      eventDispatcher.dispatchFontActive(font);
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-myfamily-n4-active');
    });
  });

  describe('#dispatchFontActive - with inactive class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchFontInactive(font);
      eventDispatcher.dispatchFontActive(font);
    });

    it('should set the correct class', function () {
      expect(element.className).toEqual('wf-myfamily-n4-active');
    });
  });

  describe('#dispatchInactive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchInactive();
    });

    it('should call the correct callback', function () {
      expect(config.inactive).toHaveBeenCalled();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-inactive');
    });
  });

  describe('#dispatchInactive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchLoading();
      eventDispatcher.dispatchInactive();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-inactive');
    });
  });

  describe('#dispatchInactive - with active class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchActive();
      eventDispatcher.dispatchInactive();
    });

    it('should not set the the inactive class', function () {
      expect(element.className).toEqual('wf-active');
    });

    it('should still call the inactive callback', function () {
      expect(config.inactive).toHaveBeenCalled();
    });
  });

  describe('#dispatchActive', function () {
    beforeEach(function () {
      eventDispatcher.dispatchActive();
    });

    it('should call the correct callback', function () {
      expect(config.active).toHaveBeenCalled();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-active');
    });
  });

  describe('#dispatchActive - with loading class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchLoading();
      eventDispatcher.dispatchActive();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-active');
    });
  });

  describe('#dispatchActive - with inactive class', function () {
    beforeEach(function () {
      eventDispatcher.dispatchInactive();
      eventDispatcher.dispatchActive();
    });

    it('should set the correct class name', function () {
      expect(element.className).toEqual('wf-active');
    });
  });

  describe('disable classes and events', function () {
    beforeEach(function () {
      config.classes = false;
      config.events = false;
      eventDispatcher = new EventDispatcher(domHelper, config);
      eventDispatcher.dispatchInactive();
      eventDispatcher.dispatchActive();
      eventDispatcher.dispatchLoading();
      eventDispatcher.dispatchFontInactive(font);
      eventDispatcher.dispatchFontActive(font);
      eventDispatcher.dispatchFontLoading(font);
    });

    afterEach(function () {
      config.classes = true;
      config.events = true;
    });

    it('should not fire any events', function () {
      expect(config.inactive).not.toHaveBeenCalled();
      expect(config.active).not.toHaveBeenCalled();
      expect(config.loading).not.toHaveBeenCalled();
      expect(config.fontinactive).not.toHaveBeenCalled();
      expect(config.fontactive).not.toHaveBeenCalled();
      expect(config.fontloading).not.toHaveBeenCalled();
    });
  });

  describe('disable classes', function () {
    beforeEach(function () {
      config.classes = false;
      eventDispatcher = new EventDispatcher(domHelper, config);
      eventDispatcher.dispatchInactive();
      eventDispatcher.dispatchActive();
      eventDispatcher.dispatchLoading();
      eventDispatcher.dispatchFontInactive(font);
      eventDispatcher.dispatchFontActive(font);
      eventDispatcher.dispatchFontLoading(font);
    });

    afterEach(function () {
      config.classes = true;
    });

    it('should not fire any events', function () {
      expect(element.className).toEqual('');
    });
  });
});
