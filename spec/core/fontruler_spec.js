describe('FontRuler', function () {
  var FontRuler = webfont.FontRuler,
      DomHelper = webfont.DomHelper,
      Size = webfont.Size,
      domHelper = null,
      fontSizer = null;

  beforeEach(function () {
    domHelper = new DomHelper(window);

    fontSizer = {
      getSize: function (el) {
        return new Size(el.offsetWidth, el.offsetHeight);
      }
    };
  });

  it('should prevent a long test string from word wrapping', function () {
    var fontRulerA = new FontRuler(domHelper, fontSizer, 'abc'),
        fontRulerB = new FontRuler(domHelper, fontSizer, 'Hello World, this should wrap!');

    fontRulerA.insert();
    fontRulerB.insert();

    fontRulerA.setFont('sans-serif');
    fontRulerB.setFont('sans-serif');

    var sizeA = fontRulerA.getSize(),
        sizeB = fontRulerB.getSize();

    expect(sizeA.height).toEqual(sizeB.height);
  });
});
