describe('DomHelper', function () {
  var domHelper = new webfont.DomHelper(window);

  describe('#createElement', function () {
    it('should create an element', function () {
      var div = domHelper.createElement('div');

      expect(div).not.toBeNull();
    });

    it('should create an element with inline content', function () {
      var div = domHelper.createElement('div', {}, 'moo');

      expect(div).not.toBeNull();
      expect(div.innerHTML).toEqual('moo');
    });

    it('should create an element with attributes and inline content', function () {
      var div = domHelper.createElement('div', {
            style: 'font-size: 42px',
            id: 'mySpan'
          }, 'hello');

      expect(div).not.toBeNull();
      expect(div.innerHTML).toEqual('hello');
      expect(div.style.fontSize).toEqual('42px');
      expect(div.id).toEqual('mySpan');
    });

    it('should work with augmented Object.prototype', function () {
      Object.prototype.evil = function () {};

      var div = domHelper.createElement('div', { id: 'augmented' });
      var parentDiv = domHelper.createElement('div', { id: 'parentaugmented' });

      parentDiv.appendChild(div);

      expect(div).not.toBeNull();
      expect(!!div.getAttribute('evil')).toBe(false);
      expect(-1, parentDiv.innerHTML.indexOf('evil'));

      delete Object.prototype.evil;
    });
  });

  describe('#createCssLink', function () {
    var link = domHelper.createCssLink('http://moo/somecss.css');

    it('should create a link', function () {
      expect(link).not.toBeNull();
    });

    it('should create a link with correct rel and href properties', function () {
      expect(link.rel).toEqual('stylesheet');
      expect(link.href).toEqual('http://moo/somecss.css');
    });
  });

  describe('#createScriptSrc', function () {
    var script = domHelper.createScriptSrc('http://moo/somescript.js');

    it('should create a script element', function () {
      expect(script).not.toBeNull();
    });

    it('should have a src property', function () {
      expect(script.src).toEqual('http://moo/somescript.js');
    });
  });

  describe('#appendClassName', function () {
    it('should have added a class name', function () {
      var div = domHelper.createElement('div');
      domHelper.appendClassName(div, 'moo');

      expect(div.className).toEqual('moo');
    });

    it('should not add duplicate class names', function () {
      var div = domHelper.createElement('div');

      domHelper.appendClassName(div, 'moo');
      domHelper.appendClassName(div, 'meu');
      domHelper.appendClassName(div, 'moo');

      expect(div.className).toEqual('moo meu');
    });

    it('should add multiple class names', function () {
      var div = domHelper.createElement('div');

      domHelper.appendClassName(div, 'moo meu moo');
      expect(div.className).toEqual('moo meu moo');
    });

    /*
    it('should normalize spaces and tabs', function () {
      var div = domHelper.createElement('div');

      domHelper.appendClassName(div, 'meu');
      domHelper.appendClassName(div, '      foo ');
      expect(div.className).toEqual('meu foo');
    });
    */
  });

  describe('#removeClassName', function () {
    it('should remove class names', function () {
      var div = domHelper.createElement('div');

      domHelper.appendClassName(div, 'meu moo');
      expect(div.className).toEqual('meu moo');

      domHelper.removeClassName(div, 'meu');
      expect(div.className).toEqual('moo');
    });

    it('should not remove non-existing classes', function () {
      var div = domHelper.createElement('div');

      domHelper.appendClassName(div, 'moo');
      expect(div.className).toEqual('moo');
      domHelper.removeClassName(div, 'boo');
      expect(div.className).toEqual('moo');
    });
  });

  describe('#hasClassName', function () {
    var div = domHelper.createElement('div');
    domHelper.appendClassName(div, 'moo moo-meu');

    it('should return true', function () {
      expect(domHelper.hasClassName(div, 'moo')).toBe(true);
      expect(domHelper.hasClassName(div, 'moo-meu')).toBe(true);
    });

    it('should return false', function () {
      expect(domHelper.hasClassName(div, 'boo')).toBe(false);
      expect(domHelper.hasClassName(div, 'meu')).toBe(false);
    });
  });

  describe('#setStyle', function () {
    var div = domHelper.createElement('div');

    domHelper.setStyle(div, 'left:3px;top:1px;');
    it('should set the style correctly', function () {
      expect(div.style.left).toEqual('3px');
      expect(div.style.top).toEqual('1px');
    });
  });
});
