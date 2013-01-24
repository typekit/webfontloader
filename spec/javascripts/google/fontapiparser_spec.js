describe('FontApiParser', function () {
  var FontApiParser = webfont.FontApiParser;

  describe('parsed values are coherent', function () {
    var parser = new FontApiParser(['Tangerine', 'Droid Serif:bi', 'Yanone Kaffeesatz:200,300,400,700', 'Cantarell:italic,b', 'Exo:100italic', 'Lobster:200n']);

    parser.parse();

    it('should parse families correctly', function () {
      var fontFamilies = parser.getFontFamilies();

      expect(fontFamilies.length).toEqual(6);
      expect(fontFamilies).toEqual([
        'Tangerine',
        'Droid Serif',
        'Yanone Kaffeesatz',
        'Cantarell',
        'Exo',
        'Lobster'
      ]);
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations();

      var tangerine = variations['Tangerine'];
      expect(tangerine).not.toBeNull();
      expect(tangerine.length).toEqual(1);
      expect(tangerine[0]).toEqual('n4');

      var droidSerif = variations['Droid Serif'];
      expect(droidSerif).not.toBeNull();
      expect(droidSerif.length).toEqual(1);
      expect(droidSerif[0]).toEqual('i7');

      var yanoneKaffeesatz = variations['Yanone Kaffeesatz'];
      expect(yanoneKaffeesatz).not.toBeNull();
      expect(yanoneKaffeesatz.length).toEqual(4);
      expect(yanoneKaffeesatz[0]).toEqual('n2');
      expect(yanoneKaffeesatz[1]).toEqual('n3');
      expect(yanoneKaffeesatz[2]).toEqual('n4');
      expect(yanoneKaffeesatz[3]).toEqual('n7');

      var cantarell = variations['Cantarell'];
      expect(cantarell).not.toBeNull();
      expect(cantarell.length).toEqual(2);
      expect(cantarell[0]).toEqual('i4');
      expect(cantarell[1]).toEqual('n7');

      var exo = variations['Exo'];
      expect(exo).not.toBeNull();
      expect(exo.length).toEqual(1);
      expect(exo[0]).toEqual('i1');

      var lobster = variations['Lobster'];
      expect(lobster).not.toBeNull();
      expect(lobster.length).toEqual(1);
      expect(lobster[0]).toEqual('n2');
    });
  });

  describe('mix of numeric weight and style', function () {
    var parser = new FontApiParser(['Nobile:700i,b,200i,r,i700']);

    parser.parse();

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual('Nobile');
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations(),
          nobile = variations['Nobile'];

      expect(nobile).not.toBeNull();
      expect(nobile.length).toEqual(4);
      expect(nobile[0]).toEqual('i7');
      expect(nobile[1]).toEqual('n7');
      expect(nobile[2]).toEqual('i2');
      expect(nobile[3]).toEqual('n4');
    });
  });

  describe('typo bild instead of bold', function () {
    var parser = new FontApiParser(['Nobile:bild']);

    parser.parse();

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual('Nobile');
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations(),
          nobile = variations['Nobile'];

      expect(nobile).not.toBeNull();
      expect(nobile.length).toEqual(1);
      expect(nobile[0]).toEqual('n4');
    });
  });

  describe('nonsense', function () {
    var parser = new FontApiParser(['Nobile:dwe,^%^%fewf,$9940@#!@#$%^&*()_+}POIBJ{}{']);

    parser.parse();

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual('Nobile');
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations(),
          nobile = variations['Nobile'];

      expect(nobile).not.toBeNull();
      expect(nobile.length).toEqual(1);
      expect(nobile[0]).toEqual('n4');
    });
  });

  describe('no weight and one subset defined', function () {
    var parser = new FontApiParser(['Cantarell::greek']);

    parser.parse();

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual('Cantarell');
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations(),
          cantarell = variations['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell.length).toEqual(1);
      expect(cantarell[0]).toEqual('n4');
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          cantarell = testStrings['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell).toEqual(FontApiParser.INT_FONTS['greek']);
    });
  });

  describe('no weight and multiple subsets defined', function () {
    var parser = new FontApiParser(['Cantarell::cyrillic,greek,latin']);

    parser.parse();

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual('Cantarell');
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations(),
          cantarell = variations['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell.length).toEqual(1);
      expect(cantarell[0]).toEqual('n4');
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          cantarell = testStrings['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell).toEqual(FontApiParser.INT_FONTS['cyrillic']);
    });
  });

  describe('weight and multiple subsets defined', function () {
    var parser = new FontApiParser(['Cantarell:regular,bold:cyrillic,greek,latin']);

    parser.parse();

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual('Cantarell');
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations(),
          cantarell = variations['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell.length).toEqual(2);
      expect(cantarell[0]).toEqual('n4');
      expect(cantarell[1]).toEqual('n7');
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          cantarell = testStrings['Cantarell'];

      expect(cantarell).not.toBeNull();
      expect(cantarell).toEqual(FontApiParser.INT_FONTS['cyrillic']);
    });
  });

  describe('Hanuman is backward compatible', function () {
    var parser = new FontApiParser(['Hanuman']);

    parser.parse();

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual('Hanuman');
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations(),
          hanuman = variations['Hanuman'];

      expect(hanuman).not.toBeNull();
      expect(hanuman.length).toEqual(1);
      expect(hanuman[0]).toEqual('n4');
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          hanuman = testStrings['Hanuman'];

      expect(hanuman).not.toBeNull();
      expect(hanuman).toEqual(FontApiParser.INT_FONTS['Hanuman']);
    });
  });

  describe('Hanuman is forward compatible', function () {
    var parser = new FontApiParser(['Hanuman::khmer']);

    parser.parse();

    it('should parse families correctly', function () {
      var families = parser.getFontFamilies();

      expect(families.length).toEqual(1);
      expect(families[0]).toEqual('Hanuman');
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations(),
          hanuman = variations['Hanuman'];

      expect(hanuman).not.toBeNull();
      expect(hanuman.length).toEqual(1);
      expect(hanuman[0]).toEqual('n4');
    });

    it('should parse pick test strings correctly', function () {
      var testStrings = parser.getFontTestStrings(),
          hanuman = testStrings['Hanuman'];

      expect(hanuman).not.toBeNull();
      expect(hanuman).toEqual(FontApiParser.INT_FONTS['khmer']);
    });
  });

  describe('plus replaced with space', function () {
    var parser = new FontApiParser(['Erica+One', 'Droid+Serif::latin', 'Yanone+Kaffeesatz:400,700:latin']);

    parser.parse();

    it('should parse families correctly', function () {
      var fontFamilies = parser.getFontFamilies();

      expect(fontFamilies.length).toEqual(3);
      expect(fontFamilies).toEqual([
        'Erica One',
        'Droid Serif',
        'Yanone Kaffeesatz'
      ]);
    });

    it('should parse variations correctly', function () {
      var variations = parser.getVariations();

      var ericaOne = variations['Erica One'];
      expect(ericaOne).not.toBeNull();
      expect(ericaOne.length).toEqual(1);
      expect(ericaOne[0]).toEqual('n4');

      var droidSerif = variations['Droid Serif'];
      expect(droidSerif).not.toBeNull();
      expect(droidSerif.length).toEqual(1);
      expect(droidSerif[0]).toEqual('n4');

      var yanoneKaffeesatz = variations['Yanone Kaffeesatz'];
      expect(yanoneKaffeesatz).not.toBeNull();
      expect(yanoneKaffeesatz.length).toEqual(2);
      expect(yanoneKaffeesatz[0]).toEqual('n4');
      expect(yanoneKaffeesatz[1]).toEqual('n7');
    });
  });
});
