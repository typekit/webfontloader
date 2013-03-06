describe('FontRuler', function () {
  var FontRuler = webfont.FontRuler,
      DomHelper = webfont.DomHelper,
      Size = webfont.Size,
      domHelper = null;

  beforeEach(function () {
    domHelper = new DomHelper(window);
  });

  it('should prevent a long test string from word wrapping', function () {
    var fontRulerA = new FontRuler(domHelper, 'abc'),
        fontRulerB = new FontRuler(domHelper, 'Hello World, this should wrap!');

    fontRulerA.insert();
    fontRulerB.insert();

    fontRulerA.setFont('sans-serif');
    fontRulerB.setFont('sans-serif');

    var sizeA = fontRulerA.getSize(),
        sizeB = fontRulerB.getSize();

    expect(sizeA.height).toEqual(sizeB.height);
  });
});
