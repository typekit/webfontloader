describe('GoogleFontApi', function () {
  var GoogleFontApi = webfont.GoogleFontApi,
      Font = webfont.Font,
      link = '',
      insert = '',
      fakeDomHelper =  {
        insertInto: function (tag, e) {
          insert = tag;
        },
        createCssLink: function (cssLink) {
          link = cssLink;
        },
        getProtocol: function () {
          return 'http:';
        }
      };


  beforeEach(function () {
    insert = '';
    link = '';
  });

  describe('call onReady with font family loading', function () {
    var googleFontApi = null,
        fonts = null;

    beforeEach(function () {
      googleFontApi = new GoogleFontApi(fakeDomHelper, { families: ['Font1', 'Font2'] });
      googleFontApi.load(function (f) {
        fonts = f;
      });
    });

    it('has inserted the link element correctly', function () {
      expect(insert).toEqual('head');
      expect(link).toEqual('http://fonts.googleapis.com/css?family=Font1%7CFont2');
    });

    it('has the correct families', function () {
      expect(fonts).not.toBeNull();
      expect(fonts.length).toEqual(2);
      expect(fonts[0]).toEqual(new Font('Font1'));
      expect(fonts[1]).toEqual(new Font('Font2'));
    });
  });

  describe('call onReady with font family loading and custom API url', function () {
    var googleFontApi = null;

    beforeEach(function () {
      googleFontApi = new GoogleFontApi(fakeDomHelper, {
        api: 'http://moo',
        families: ['Font1', 'Font2']
      });
      googleFontApi.load(function () {});
    });

    it('has inserted the link element correctly', function () {
      expect(insert).toEqual('head');
      expect(link).toEqual('http://moo?family=Font1%7CFont2');
    });
  });

  describe('spaces replaced by plus', function () {
    var googleFontApi = null;

    beforeEach(function () {
      googleFontApi = new GoogleFontApi(fakeDomHelper, { families: ['Font1 WithSpace', 'Font2 WithSpaceToo'] });
      googleFontApi.load(function () {});
    });

    it('has inserted the link element correctly', function () {
      expect(insert).toEqual('head');
      expect(link).toEqual('http://fonts.googleapis.com/css?family=Font1+WithSpace%7CFont2+WithSpaceToo');
    });
 });

  describe('load with variations', function () {
    var googleFontApi = null;

    beforeEach(function () {
      googleFontApi = new GoogleFontApi(fakeDomHelper, { families: ['Font1 WithSpace:bi', 'Font2 WithSpaceToo:b,r'] });
      googleFontApi.load(function () {});
    });

    it('has inserted the link element correctly', function () {
      expect(insert).toEqual('head');
      expect(link).toEqual('http://fonts.googleapis.com/css?family=Font1+WithSpace:bi%7CFont2+WithSpaceToo:b,r');
    });
 });
});
