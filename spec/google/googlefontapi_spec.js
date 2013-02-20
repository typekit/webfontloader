describe('GoogleFontApi', function () {
  var GoogleFontApi = webfont.GoogleFontApi,
      UserAgent = webfont.UserAgent,
      userAgent = null,
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
    userAgent = new UserAgent('Test', '1.0', true);
  });

  describe('call onReady with font family loading', function () {
    var googleFontApi = null,
        families = null,
        descriptions = null;

    beforeEach(function () {
      googleFontApi = new GoogleFontApi(userAgent, fakeDomHelper, { families: ['Font1', 'Font2'] });
      googleFontApi.load(function (fontFamilies, fontDescriptions) {
        families = fontFamilies;
        descriptions = fontDescriptions;
      });
    });

    it('has inserted the link element correctly', function () {
      expect(insert).toEqual('head');
      expect(link).toEqual('http://fonts.googleapis.com/css?family=Font1%7CFont2');
    });

    it('has the correct families', function () {
      expect(families).not.toBeNull();
      expect(families.length).toEqual(2);
      expect(families[0]).toEqual('Font1');
      expect(families[1]).toEqual('Font2');
    });

    it('has the correct font descriptions', function () {
      var font1 = descriptions['Font1'];
      expect(font1).not.toBeNull();
      expect(font1.length).toEqual(1);
      expect(font1[0]).toEqual('n4');

      var font2 = descriptions['Font2'];
      expect(font2).not.toBeNull();
      expect(font2.length).toEqual(1);
      expect(font1[0]).toEqual('n4');
    });
  });

  describe('call onReady with font family loading and custom API url', function () {
    var googleFontApi = null,
        families = null,
        descriptions = null;

    beforeEach(function () {
      googleFontApi = new GoogleFontApi(userAgent, fakeDomHelper, {
        api: 'http://moo',
        families: ['Font1', 'Font2']
      });
      googleFontApi.load(function (fontFamilies, fontDescriptions) {
        families = fontFamilies;
        descriptions = fontDescriptions;
      });
    });

    it('has inserted the link element correctly', function () {
      expect(insert).toEqual('head');
      expect(link).toEqual('http://moo?family=Font1%7CFont2');
    });
  });

  describe('spaces replaced by plus', function () {
    var googleFontApi = null,
        families = null,
        descriptions = null;

    beforeEach(function () {
      googleFontApi = new GoogleFontApi(userAgent, fakeDomHelper, { families: ['Font1 WithSpace', 'Font2 WithSpaceToo'] });
      googleFontApi.load(function (fontFamilies, fontDescriptions) {
        families = fontFamilies;
        descriptions = fontDescriptions;
      });
    });

    it('has inserted the link element correctly', function () {
      expect(insert).toEqual('head');
      expect(link).toEqual('http://fonts.googleapis.com/css?family=Font1+WithSpace%7CFont2+WithSpaceToo');
    });
 });

  describe('load with variations', function () {
    var googleFontApi = null,
        families = null,
        descriptions = null;

    beforeEach(function () {
      googleFontApi = new GoogleFontApi(userAgent, fakeDomHelper, { families: ['Font1 WithSpace:bi', 'Font2 WithSpaceToo:b,r'] });
      googleFontApi.load(function (fontFamilies, fontDescriptions) {
        families = fontFamilies;
        descriptions = fontDescriptions;
      });
    });

    it('has inserted the link element correctly', function () {
      expect(insert).toEqual('head');
      expect(link).toEqual('http://fonts.googleapis.com/css?family=Font1+WithSpace:bi%7CFont2+WithSpaceToo:b,r');
    });
 });
});
