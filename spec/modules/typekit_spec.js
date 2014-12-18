describe('modules.Typekit', function () {
  var Typekit = webfont.modules.Typekit,
      Font = webfont.Font;

  var configuration = {
    id: 'abc'
  };

  var fakeDomHelper = null,
      global = {},
      load = null,
      support = null;

  beforeEach(function () {
    global = {};

    support = jasmine.createSpy('support');

    load = jasmine.createSpy('load');

    fakeDomHelper = {
      loadScript: jasmine.createSpy('loadScript'),
      getLoadWindow: jasmine.createSpy('getLoadWindow').andReturn(global),
      getProtocol: jasmine.createSpy('getProtocol').andReturn('http:')
    };
  });

  it('support load and life cycle', function () {
    var typekit = new Typekit(fakeDomHelper, configuration);

    typekit.supportUserAgent('useragent', support);

    expect(fakeDomHelper.loadScript).toHaveBeenCalled();
    expect(fakeDomHelper.loadScript.calls[0].args[0]).toEqual('http://use.typekit.net/abc.js');
    expect(support).not.toHaveBeenCalled();

    expect(global.__webfonttypekitmodule__).not.toBeNull();
    expect(global.__webfonttypekitmodule__['abc']).not.toBeNull();

    global.__webfonttypekitmodule__['abc'](function (ua, config, init) {
      expect(ua).toEqual('useragent');
      expect(config).toEqual(configuration);
      expect(init).not.toBeNull();
      init(true, ['Font1', 'Font2'], {});
    });

    expect(support).toHaveBeenCalled();

    typekit.load(load);

    expect(load).toHaveBeenCalledWith([new Font('Font1'), new Font('Font2')]);
  });

  it('should load with variations', function () {
    var typekit = new Typekit(fakeDomHelper, configuration);

    typekit.supportUserAgent('useragent', support);

    global.__webfonttypekitmodule__['abc'](function (ua, config, init) {
      init(true, ['Font1', 'Font2'], {
        'Font1': ['n7', 'i7']
      });
    });

    expect(support).toHaveBeenCalled();

    typekit.load(load);

    expect(load).toHaveBeenCalledWith([
      new Font('Font1', 'n7'),
      new Font('Font1', 'i7'),
      new Font('Font2', 'n4')
    ]);
  });

  it('should load through the alternative API', function () {
    var typekit = new Typekit(fakeDomHelper, { id: 'abc', api: '/test' });

    typekit.supportUserAgent('useragent', support);
    expect(fakeDomHelper.loadScript).toHaveBeenCalled();
    expect(fakeDomHelper.loadScript.calls[0].args[0]).toEqual('/test/abc.js');
  });

  it('should not load without a kit id', function () {
    var typekit = new Typekit(fakeDomHelper, { id: null });

    typekit.supportUserAgent('useragent', support);

    expect(fakeDomHelper.loadScript).not.toHaveBeenCalled();
    expect(support).toHaveBeenCalled();

    typekit.load(load);

    expect(load).toHaveBeenCalledWith([]);
  });
});
