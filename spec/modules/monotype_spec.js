describe('modules.Monotype', function () {
  var Monotype = webfont.modules.Monotype,
      Font = webfont.Font,
      BrowserInfo = webfont.BrowserInfo,
      UserAgent = webfont.UserAgent,
      Version = webfont.Version;

  var configuration = {
    projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7cc',
    api: 'http://fast.fonts.com/jsapidev'
  };

  var fakeDomHelper = null,
      global = null,
      script = {},
      monotype = null,
      load =  null,
      useragent = null,
      support = null;

  beforeEach(function () {
    global = {};

    fakeDomHelper = {
      createElement: jasmine.createSpy('createElement').andReturn(script),
      insertInto: jasmine.createSpy('insertInto'),
      getLoadWindow: jasmine.createSpy('getLoadWindow').andReturn(global),
      getProtocol: jasmine.createSpy('getProtocol').andReturn('http:'),
      loadScript: jasmine.createSpy('loadScript').andCallFake(function (src, cb) {
        cb();
      })
    };
    support = jasmine.createSpy('support');
    load = jasmine.createSpy('load');
    useragent = new UserAgent(
      'Firefox',
      new Version(3, 6),
      '3.6',
      'Gecko',
      new Version(1, 9, 3),
      '1.9.3',
      'Macintosh',
      new Version(10, 6),
      '10.6',
      undefined,
      new BrowserInfo(true, false, false)
    );

    monotype = new Monotype(useragent, fakeDomHelper, configuration);
    monotype.supportUserAgent(useragent, support);
    monotype.load(load);

    global[Monotype.HOOK + configuration.projectId] = function () {
      return [{fontfamily: 'aachen bold'}, {fontfamily: 'kid print regular'}];
    };

    monotype = new Monotype(useragent, fakeDomHelper, configuration);
    monotype.supportUserAgent(useragent, support);
    monotype.load(load);
  });

  it('should create a script element', function () {
    expect(fakeDomHelper.loadScript).toHaveBeenCalled();
    expect(fakeDomHelper.loadScript.calls[0].args[0]).toEqual('http://fast.fonts.com/jsapidev/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js');
    expect(load).toHaveBeenCalledWith([new Font('aachen bold'), new Font('kid print regular')]);
  });
});
