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
        fontRulerB = new FontRuler(domHelper, 'abc HelloWorld,thisshouldwrap!!!!');

    fontRulerA.insert();
    fontRulerB.insert();

    fontRulerA.setFont('sans-serif');
    fontRulerB.setFont('sans-serif');

    var widthA = fontRulerA.getWidth(),
        widthB = fontRulerB.getWidth();

    expect(widthA).not.toEqual(widthB);
  });
});
