describe('MonotypeScript', function () {
  var MonotypeScript = webfont.MonotypeScript,
      Font = webfont.Font,
      BrowserInfo = webfont.BrowserInfo,
      UserAgent = webfont.UserAgent;

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
      getProtocol: jasmine.createSpy('getProtocol').andReturn('http:')
    };
    support = jasmine.createSpy('support');
    load = jasmine.createSpy('load');
    useragent = new UserAgent('Firefox', '3.6', 'Gecko', '1.9.3', 'Macintosh', '10.6', undefined, new BrowserInfo(true, false, false));

    monotype = new MonotypeScript(useragent, fakeDomHelper, configuration);
    monotype.supportUserAgent(useragent, support);
    monotype.load(load);

    global[MonotypeScript.HOOK + configuration.projectId] = function () {
      return [{fontfamily: 'aachen bold'}, {fontfamily: 'kid print regular'}];
    };

    script.onload();
  });

  it('should create a script element', function () {
    expect(support).toHaveBeenCalled();
    expect(fakeDomHelper.createElement).toHaveBeenCalledWith('script');
    expect(script.src).toEqual('http://fast.fonts.com/jsapidev/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js');
    expect(load).toHaveBeenCalledWith([new Font('aachen bold'), new Font('kid print regular')]);
  });
});
