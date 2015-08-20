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
        fontRulerB = new FontRuler(domHelper, 'abc HelloWorld,thisshouldwrap!!!!');

    fontRulerA.insert();
    fontRulerB.insert();

    fontRulerA.setFont(font);
    fontRulerB.setFont(font);

    var widthA = fontRulerA.getWidth(),
        widthB = fontRulerB.getWidth();

    expect(widthA).not.toEqual(widthB);
  });
});
