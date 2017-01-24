describe('modules.Typekit', function () {
  var Typekit = webfont.modules.Typekit,
      Font = webfont.Font;

  var configuration = {
    id: 'abc'
  };

  var fakeDomHelper = null,
      global = {},
      load = null,
      onReady = null;

  beforeEach(function () {
    global = {
      Typekit: {
        config: {
          fc: [{
            family: 'Font1',
            weight: '400',
            style: 'normal'
          },  {
            family: 'Font2',
            weight: '400',
            style: 'normal'
          }, {
            family: 'Font2',
            weight: '700',
            style: 'normal'
          }]
        },
        load: jasmine.createSpy('load')
      }
    };

    onReady = jasmine.createSpy('onReady');

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

    typekit.load(onReady);

    expect(fakeDomHelper.loadScript).toHaveBeenCalled();
    expect(fakeDomHelper.loadScript.calls[0].args[0]).toEqual('https://use.typekit.net/abc.js');

    expect(global.Typekit.load).toHaveBeenCalled();
    typekit.load(load);

    expect(load).toHaveBeenCalledWith([new Font('Font1', 'n4'), new Font('Font2', 'n4'), new Font('Font2', 'n7')]);
  });

  it('should load through the alternative API', function () {
    var typekit = new Typekit(fakeDomHelper, { id: 'abc', api: '/test' });

    typekit.load(onReady);

    expect(fakeDomHelper.loadScript).toHaveBeenCalled();
    expect(fakeDomHelper.loadScript.calls[0].args[0]).toEqual('/test/abc.js');
  });

  it('should not load without a kit id', function () {
    var typekit = new Typekit(fakeDomHelper, { id: null });

    typekit.load(onReady);

    expect(fakeDomHelper.loadScript).not.toHaveBeenCalled();

    typekit.load(load);

    expect(load).toHaveBeenCalledWith([]);
  });
});
