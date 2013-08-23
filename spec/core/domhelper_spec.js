describe('DomHelper', function () {
  var DomHelper = webfont.DomHelper,
      domHelper = new DomHelper(window);

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

    it('should normalize spaces and tabs', function () {
      var div = domHelper.createElement('div');

      domHelper.appendClassName(div, 'meu');
      domHelper.appendClassName(div, '      foo ');
      expect(div.className).toEqual('meu foo');
    });
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
    var div = null;

    beforeEach(function () {
       div = domHelper.createElement('div');
       domHelper.appendClassName(div, 'moo moo-meu');
    });

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
    var div = null;

    beforeEach(function () {
      div = domHelper.createElement('div');
    });

    it('should set the style correctly', function () {
      domHelper.setStyle(div, 'left:3px;top:1px;');
      expect(div.style.left).toEqual('3px');
      expect(div.style.top).toEqual('1px');
    });
  });

  describe('#createStyle', function () {
    var style = null;

    beforeEach(function () {
      style = domHelper.createStyle('blockquote{font-size:300px}');
      domHelper.insertInto('head', style);
    });

    afterEach(function () {
      domHelper.removeElement(style);
    });

    it('should create a style element', function () {
      expect(style).not.toBeNull();
      expect(style.nodeName).toEqual('STYLE');
    });

    it('should set the css content correctly', function () {
      var text = style.styleSheet ? style.styleSheet.cssText : style.textContent;
      expect(text.replace(/[\s;]/g, '').toLowerCase()).toEqual('blockquote{font-size:300px}');
    });
  });

  describe('#loadStylesheet', function () {
    it('should load the stylesheet', function () {
      var el = null,
          width = null,
          link = null;

      runs(function () {
        el = domHelper.createElement('div', { id: 'TEST_ELEMENT' });
        domHelper.insertInto('body', el);
        width = el.offsetWidth;
        link = domHelper.loadStylesheet('fixtures/external_stylesheet.css');
      });

      waitsFor(function () {
        return width !== el.offsetWidth;
      });

      runs(function () {
        expect(link).not.toBeNull();
        expect(link.rel).toEqual('stylesheet');
        expect(el.offsetWidth).toEqual(300);
      });
    });
  });

  describe('#loadScript', function () {
    it('should load the script', function () {
      runs(function () {
        domHelper.loadScript('fixtures/external_script.js');
      });

      waitsFor(function () {
        return window.EXTERNAL_SCRIPT_LOADED;
      }, 'script was never inserted', 1000);

      runs(function () {
        expect(window.EXTERNAL_SCRIPT_LOADED).toBe(true);
      });
    });

    it('should call the callback', function () {
      var called = false,
          error = null;

      runs(function () {
        domHelper.loadScript('fixtures/external_script.js', function (err) {
          called = true;
          error = err;
        });
      });

      waitsFor(function () {
        return called;
      }, 'callback was never called', 1000);

      runs(function () {
        expect(called).toBe(true);
        expect(error).toBeFalsy();
      });
    });

    it('should return a script element', function () {
      var script = domHelper.loadScript('fixtures/external_script.js');

      expect(script).not.toBeNull();
      expect(script.nodeName).toEqual('SCRIPT');
    });

    it('should timeout if the script does not load or is very slow', function () {
      var called = false,
          error = false;

      // Spy on createElement so the all loadScript code is executed but
      // the "script" won't actually load.
      spyOn(domHelper, 'createElement').andCallFake(function (name) {
        return document.createElement('div');
      });

      runs(function () {
        domHelper.loadScript('fixtures/external_script.js', function (err) {
          called = true;
          error = err;
        }, 100);
      });

      waitsFor(function () {
        return called;
      });

      runs(function () {
        expect(called).toBe(true);
        expect(error).toBeTruthy();
      });
    });
  });

  describe('#getProtocol', function () {
    it('should return http', function () {
      var domHelper = new DomHelper({
        location: {
          protocol: 'http:'
        }
      });

      expect(domHelper.getProtocol()).toEqual('http:');
    });

    it('should return https', function () {
      var domHelper = new DomHelper({
        location: {
          protocol: 'https:'
        }
      });

      expect(domHelper.getProtocol()).toEqual('https:');
    });

    it('should return the protocol from an iframe', function () {
      var domHelper = new DomHelper({
        location: {
          protocol: 'https:'
        }
      }, {
        location: {
          protocol: 'http:'
        }
      });

      expect(domHelper.getProtocol()).toEqual('http:');
    });

    it('should return the protocol from the main window if the iframe has no protocol', function () {
      var domHelper = new DomHelper({
        location: {
          protocol: 'http:'
        }
      }, {
        location: {
          protocol: 'about:'
        }
      });

      expect(domHelper.getProtocol()).toEqual('http:');
    });
  });

  describe('#isHttps', function () {
    it('should return true if the protocol is https', function () {
      var domHelper = new DomHelper({
        location: {
          protocol: 'https:'
        }
      });

      expect(domHelper.isHttps()).toBe(true);
    });

    it('should return false if the protocol is not https', function () {
      var domHelper = new DomHelper({
        location: {
          protocol: 'http:'
        }
      });

      expect(domHelper.isHttps()).toBe(false);
    });
  });

  describe('#getHostname', function () {
    it('should return the hostname', function () {
      var domHelper = new DomHelper({
        location: {
          hostname: 'example.com'
        }
      });

      expect(domHelper.getHostName()).toEqual('example.com');
    });

    it('should return the hostname from the iframe if present', function () {
      var domHelper = new DomHelper({
        location: {
          hostname: 'example.com'
        }
      }, {
        location: {
          hostname: 'example.org'
        }
      });

      expect(domHelper.getHostName()).toEqual('example.org');
    });
  });

  describe('#insertInto', function () {
    it('should insert an element', function () {
      var a = domHelper.createElement('div');

      var result = domHelper.insertInto('body', a);

      expect(result).toBe(true);
      expect(a.parentNode.nodeName).toEqual('BODY');
    });
  });

  describe('#whenBodyExists', function () {
    var domHelper = null,
        callback = null;

    beforeEach(function () {
      domHelper = new DomHelper({
        document: {}
      });

      callback = jasmine.createSpy('callback');
    });

    it('should wait until the body exists before calling the callback', function () {
      runs(function () {
        domHelper.whenBodyExists(callback);
      });

      waits(200);

      runs(function () {
        domHelper.document_.body = true;
      });

      waitsFor(function () {
        return callback.wasCalled;
      }, 'callback was never called', 100);

      runs(function () {
        expect(callback).toHaveBeenCalled();
      });
    });

    it('should not call the callback if the body is not available', function () {
      runs(function () {
        domHelper.whenBodyExists(callback);
      });

      waits(100);

      runs(function () {
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('#removeElement', function () {
    it('should remove an element', function () {
      var a = domHelper.createElement('div'),
          b = domHelper.createElement('div');

      a.appendChild(b);

      var result = domHelper.removeElement(b);
      expect(result).toBe(true);
      expect(b.parentNode).not.toEqual(a);
    });

    it('should return false when failing to remove an element', function () {
      var a = domHelper.createElement('div');

      var result = domHelper.removeElement(a);

      expect(result).toBe(false);
    });
  });

  describe('#getMainWindow', function () {
    it('should return the main window', function () {
      var domHelper = new DomHelper(1, 2);
      expect(domHelper.getMainWindow()).toEqual(1);
    });
  });

  describe('#getLoadWindow', function () {
    it('should return the load window', function () {
      var domHelper = new DomHelper(1, 2);
      expect(domHelper.getLoadWindow()).toEqual(2);
    });
  });
});
