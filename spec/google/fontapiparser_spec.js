describe('FontApiParser', function () {
  var FontApiParser = webfont.FontApiParser,
      Font = webfont.Font;

  describe('parsed values are coherent', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Tangerine', 'Droid Serif:bi', 'Yanone Kaffeesatz:200,300,400,700', 'Cantarell:italic,b', 'Exo:100italic', 'Lobster:200n']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var fontFamilies = parser.getFontFamilies();

      expect(fontFamilies.length).toEqual(10);
      expect(fontFamilies).toEqual([
        new Font('Tangerine', 'n4'),
        new Font('Droid Serif', 'i7'),
        new Font('Yanone Kaffeesatz', 'n2'),
        new Font('Yanone Kaffeesatz', 'n3'),
        new Font('Yanone Kaffeesatz', 'n4'),
        new Font('Yanone Kaffeesatz', 'n7'),
        new Font('Cantarell', 'i4'),
        new Font('Cantarell', 'n7'),
        new Font('Exo', 'i1'),
        new Font('Lobster', 'n2')
      ]);
    });
  });

  describe('mix of numeric weight and style', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Nobile:700i,b,200i,r,i700']);
      parser.parse();
    });

    it('should parse fonts correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(4);
      expect(families).toEqual([
        new Font('Nobile', 'i7'),
        new Font('Nobile', 'n7'),
        new Font('Nobile', 'i2'),
        new Font('Nobile', 'n4')
      ]);
    });
  });

  describe('typo bild instead of bold', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Nobile:bild']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual(new Font('Nobile', 'n4'));
    });
  });

  describe('nonsense', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Nobile:dwe,^%^%fewf,$9940@#!@#$%^&*()_+}POIBJ{}{']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual(new Font('Nobile', 'n4'));
    });
  });

  describe('no weight and one subset defined', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Cantarell::greek']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual(new Font('Cantarell', 'n4'));
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          cantarell = testStrings['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell).toEqual(FontApiParser.INT_FONTS['greek']);
    });
  });

  describe('no weight and multiple subsets defined', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Cantarell::cyrillic,greek,latin']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual(new Font('Cantarell', 'n4'));
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          cantarell = testStrings['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell).toEqual(FontApiParser.INT_FONTS['cyrillic']);
    });
  });

  describe('weight and multiple subsets defined', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Cantarell:regular,bold:cyrillic,greek,latin']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(2);
      expect(families).toEqual([
        new Font('Cantarell', 'n4'),
        new Font('Cantarell', 'n7')
      ]);
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          cantarell = testStrings['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell).toEqual(FontApiParser.INT_FONTS['cyrillic']);
    });
  });

  describe('Hanuman is backward compatible', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Hanuman']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual(new Font('Hanuman', 'n4'));
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          hanuman = testStrings['Hanuman'];

      expect(hanuman).not.toBeNull();
      expect(hanuman).toEqual(FontApiParser.INT_FONTS['Hanuman']);
    });
  });

  describe('Hanuman is forward compatible', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Hanuman::khmer']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual(new Font('Hanuman', 'n4'));
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          hanuman = testStrings['Hanuman'];

      expect(hanuman).not.toBeNull();
      expect(hanuman).toEqual(FontApiParser.INT_FONTS['khmer']);
    });
  });

  describe('plus replaced with space', function () {
    var parser = null;

    beforeEach(function () {
      parser = new FontApiParser(['Erica+One', 'Droid+Serif::latin', 'Yanone+Kaffeesatz:400,700:latin']);
      parser.parse();
    });

    it('should parse families correctly', function () {
      var fontFamilies = parser.getFontFamilies();

      expect(fontFamilies.length).toEqual(4);
      expect(fontFamilies).toEqual([
        new Font('Erica One', 'n4'),
        new Font('Droid Serif', 'n4'),
        new Font('Yanone Kaffeesatz', 'n4'),
        new Font('Yanone Kaffeesatz', 'n7')
      ]);
    });
  });
});
