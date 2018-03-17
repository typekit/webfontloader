describe('modules.Monotype', function () {
  var Monotype = webfont.modules.Monotype,
      Font = webfont.Font,
      BrowserInfo = webfont.BrowserInfo,
      UserAgent = webfont.UserAgent,
      Version = webfont.Version;

  var configuration = {
    projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7cc',
    api: 'https://fast.fonts.net/jsapidev'
  };

  var fakeDomHelper = null,
      global = null,
      script = {},
      monotype = null,
      load =  null,
      support = null;

  beforeEach(function () {
    global = {};

    fakeDomHelper = {
      loadScript: jasmine.createSpy('loadScript').andCallFake(function (src, callback) {
        script.onload = callback;
        return script;
      }),
      getLoadWindow: jasmine.createSpy('getLoadWindow').andReturn(global)
    };
    support = jasmine.createSpy('support');
    load = jasmine.createSpy('load');

    monotype = new Monotype(fakeDomHelper, configuration);
    monotype.load(load);

    global[Monotype.HOOK + configuration.projectId] = function () {
      return [{fontfamily: 'aachen bold'}, {fontfamily: 'kid print regular'}];
    };

    script.onload();
  });


  it('should create a script element', function () {
    expect(fakeDomHelper.loadScript).toHaveBeenCalled();
    expect(fakeDomHelper.loadScript.calls[0].args[0]).toEqual('https://fast.fonts.net/jsapidev/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js');
    expect(load).toHaveBeenCalledWith([new Font('aachen bold'), new Font('kid print regular')]);
  });
});
