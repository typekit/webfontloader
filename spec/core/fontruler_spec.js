describe('FontRuler', function () {
  var Font = webfont.Font,
      FontRuler = webfont.FontRuler,
      DomHelper = webfont.DomHelper,
      Size = webfont.Size,
      domHelper = null,
      font = null;

  beforeEach(function () {
    font = new Font('sans-serif');
    domHelper = new DomHelper(window);
  });

  it('should prevent a long test string from word wrapping', function () {
    var fontRulerA = new FontRuler(domHelper, 'abc'),
        fontRulerB = new FontRuler(domHelper, 'Hello World, this should wrap!');

    fontRulerA.insert();
    fontRulerB.insert();

    fontRulerA.setFont(font);
    fontRulerB.setFont(font);

    var sizeA = fontRulerA.getSize(),
        sizeB = fontRulerB.getSize();

    expect(sizeA.height).toEqual(sizeB.height);
  });
});
