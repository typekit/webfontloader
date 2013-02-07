describe('TypekitScript', function () {
  var TypekitScript = webfont.TypekitScript;

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
      insertInto: jasmine.createSpy('insertInto'),
      createScriptSrc: jasmine.createSpy('createScriptSrc'),
      getLoadWindow: jasmine.createSpy('getLoadWindow').andReturn(global),
      getProtocol: jasmine.createSpy('getProtocol').andReturn('http:')
    };
  });

  it('support load and life cycle', function () {
    var typekit = new TypekitScript(fakeDomHelper, configuration);

    typekit.supportUserAgent('useragent', support);

    expect(fakeDomHelper.insertInto.calls[0].args[0]).toEqual('head');
    expect(fakeDomHelper.createScriptSrc).toHaveBeenCalledWith('http://use.typekit.com/abc.js');
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

    expect(load).toHaveBeenCalledWith(['Font1', 'Font2'], { 'Font1': undefined, 'Font2': undefined });
  });

  it('should load with variations', function () {
    var typekit = new TypekitScript(fakeDomHelper, configuration);

    typekit.supportUserAgent('useragent', support);

    global.__webfonttypekitmodule__['abc'](function (ua, config, init) {
      init(true, ['Font1', 'Font2'], {
        'Font1': ['n7', 'i7']
      });
    });

    expect(support).toHaveBeenCalled();

    typekit.load(load);

    expect(load).toHaveBeenCalledWith(['Font1', 'Font2'], { 'Font1': ['n7', 'i7'], 'Font2': undefined });
  });

  it('should load through the alternative API', function () {
    var typekit = new TypekitScript(fakeDomHelper, { id: 'abc', api: '/test' });

    typekit.supportUserAgent('useragent', support);
    expect(fakeDomHelper.insertInto.calls[0].args[0]).toEqual('head');
    expect(fakeDomHelper.createScriptSrc).toHaveBeenCalledWith('/test/abc.js');
  });

  it('should not load without a kit id', function () {
    var typekit = new TypekitScript(fakeDomHelper, { id: null });

    typekit.supportUserAgent('useragent', support);

    expect(fakeDomHelper.insertInto).not.toHaveBeenCalled();
    expect(fakeDomHelper.createScriptSrc).not.toHaveBeenCalled();
    expect(support).toHaveBeenCalled();

    typekit.load(load);

    expect(load).toHaveBeenCalledWith([], {});
  });
});
