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
    global = {
      Typekit: {
        config: {
          fn: ['Font1', ['n4'], 'Font2', ['n4', 'n7']]
        },
        load: jasmine.createSpy('load')
      }
    };

    support = jasmine.createSpy('support');

    load = jasmine.createSpy('load');

    fakeDomHelper = {
      loadScript: jasmine.createSpy('loadScript').andCallFake(function (url, cb) {
        cb(null);
      }),
      getLoadWindow: jasmine.createSpy('getLoadWindow').andReturn(global),
      getProtocol: jasmine.createSpy('getProtocol').andReturn('http:')
    };
  });

  it('should load with variations', function () {
    var typekit = new Typekit(fakeDomHelper, configuration);

    typekit.supportUserAgent('useragent', support);

    expect(fakeDomHelper.loadScript).toHaveBeenCalled();
    expect(fakeDomHelper.loadScript.calls[0].args[0]).toEqual('http://use.typekit.net/abc.js');
    expect(support).toHaveBeenCalled();

    expect(global.Typekit.load).toHaveBeenCalled();
    typekit.load(load);

    expect(load).toHaveBeenCalledWith([new Font('Font1', 'n4'), new Font('Font2', 'n4'), new Font('Font2', 'n7')]);
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
