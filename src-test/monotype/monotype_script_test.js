var MonotypeScriptTest = TestCase('MonotypeScriptTest');

MonotypeScriptTest.prototype.testIfScriptTagIsAdded = function () {
  var fakedom = { 'head': [], 'body': [] };
  var script = null;
  var global = {}; // should be window in actual situation.
  var families = null;
  var config = { projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7cc', api: "http://fast.fonts.com/jsapidev" };

  var fakeDomHelper = {
    createElement: function () {
      script = {
        addEventListener: function () {}
      };
      return script;
    },
    insertInto: function (tag, elem) {
      fakedom[tag].push(elem);
      global[webfont.MonotypeScript.HOOK + config.projectId] = function () {
        return ["aachen bold", "kid print regualr"];
      };
      if (script.onload) {
        script.onload();
      }
    },
    getLoadWindow: function () {
      return global;
    },
    getProtocol: function () {
      return "http:";
    }
  };

  function getElementById(Id) {
    var p;
    for (p in fakedom) {
      if (fakedom[p].length > 0) {
        for (i = 0; i < fakedom[p].length; i++) {
          if (fakedom[p][i].id === Id) {
            return fakedom[p][i];
          }
        }
      }
    }
    return null;
  }
  var isSupport = null;
  var userAgent = new webfont.UserAgent("Test", "1.0", "TestEngine", "2.0", "TestPlatform", "3.0", undefined, new webfont.BrowserInfo(false, false, false));
  var monotypeScript = new webfont.MonotypeScript(userAgent, fakeDomHelper, config);
  monotypeScript.supportUserAgent(userAgent, function (support) { isSupport = support; });
  monotypeScript.load(function (fontFamilies) {
    families = fontFamilies;
  });
  script = getElementById(webfont.MonotypeScript.SCRIPTID + config.projectId);

  assertEquals(null, isSupport);
  assertNotNull(script);
  assertEquals("http://fast.fonts.com/jsapidev/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js", script.src);
  assertEquals(2, families.length);
};

//If current page is browsed using https protocol, the added script should be requested with SSL.
MonotypeScriptTest.prototype.testIfScriptTagHasCorrectSSL = function () {
  var fakedom = { 'head': [], 'body': [] };
  var fakeProtocol = "https:";
  var script = null;
  var global = {}; // should be window in actual situation.
  var families = null;
  var config = { projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7cc', api: "http://fast.fonts.com/jsapidev" };

  var fakeDomHelper = {
    createElement: function () {
      script = {
        addEventListener: function () {}
      };
      return script;
    },
    insertInto: function (tag, elem) {
      fakedom[tag].push(elem);
      global[webfont.MonotypeScript.HOOK + config.projectId] = function () {
        return ["aachen bold", "kid print regualr"];
      };
      if (script.onload) {
        script.onload();
      }
    },
    getLoadWindow: function () {
      return global;
    },
    getProtocol: function () {
      return fakeProtocol;
    }
  };

  //trys to simulates exactly the getElementById behaviour, by returning the first found element.
  function getElementById(Id) {
    var p;
    for (p in fakedom) {
      if (fakedom[p].length > 0) {
        for (i = 0; i < fakedom[p].length; i++) {
          if (fakedom[p][i].id === Id) {
            return fakedom[p][i];
          }
        }
      }
    }
    return null;
  }
  var isSupport = null;
  var userAgent = new webfont.UserAgent("Test", "1.0", "TestEngine", "2.0", "TestPlatform", "3.0", undefined, new webfont.BrowserInfo(false, false, false));
  var monotypeScript = new webfont.MonotypeScript(userAgent, fakeDomHelper, config);
  monotypeScript.supportUserAgent(userAgent, function (support) { isSupport = support; });
  monotypeScript.load(function (fontFamilies) {
    families = fontFamilies;
  });
  script = getElementById(webfont.MonotypeScript.SCRIPTID + config.projectId);

  assertEquals(null, isSupport);
  assertNotNull(script);
  assertEquals("https://fast.fonts.com/jsapidev/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js", script.src);
  assertEquals(2, families.length);

  //one page can have multiple projects, but not 2 projects with same projectId.
  config = { projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7c1', api: "http://fast.fonts.com/jsapidev" };
  fakeProtocol = "http:";
  var monotypeScript2 = new webfont.MonotypeScript(userAgent, fakeDomHelper, config);
  monotypeScript2.supportUserAgent(userAgent, function (support) { isSupport = support; });
  monotypeScript2.load(function (fontFamilies) {
    families = fontFamilies;
  });
  script = getElementById(webfont.MonotypeScript.SCRIPTID + config.projectId);
  assertEquals(null, isSupport);
  assertNotNull(script);
  assertEquals("http://fast.fonts.com/jsapidev/01e2ff27-25bf-4801-a23e-73d328e6c7c1.js", script.src);
  assertEquals(2, families.length);
};

MonotypeScriptTest.prototype.testIfScriptTagIsAddedWithoutApiurl = function () {
  var fakedom = { 'head': [], 'body': [] };
  var global = {}; // should be window in actual situation.
  var script = null;
  var families = null;
  var config = { projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7cc' };

  var fakeDomHelper = {
    createElement: function () {
      script = {
        addEventListener: function () {}
      };
      return script;
    },
    insertInto: function (tag, elem) {
      fakedom[tag].push(elem);
      global[webfont.MonotypeScript.HOOK + config.projectId] = function () {
        return ["aachen bold", "kid print regualr"];
      };
      if (script.onload) {
        script.onload();
      }
    },
    getLoadWindow: function () {
      return global;
    },
    getProtocol: function () {
      return "http:";
    }
  };

  function getElementById(Id) {
    var p;
    for (p in fakedom) {
      if (fakedom[p].length > 0) {
        for (i = 0; i < fakedom[p].length; i++) {
          if (fakedom[p][i].id === Id) {
            return fakedom[p][i];
          }
        }
      }
    }
    return null;
  }

  var isSupport = null;
  var userAgent = new webfont.UserAgent("Test", "1.0", "TestEngine", "2.0", "TestPlatform", "3.0", undefined, new webfont.BrowserInfo(false, false, false));
  var monotypeScript = new webfont.MonotypeScript(userAgent, fakeDomHelper, config);
  monotypeScript.supportUserAgent(userAgent, function (support) { isSupport = support; });

  monotypeScript.load(function (fontFamilies) {
    families = fontFamilies;
  });
  //just for testing purpose
  script = getElementById(webfont.MonotypeScript.SCRIPTID + config.projectId);

  assertNotNull(script);
  assertEquals("http://fast.fonts.com/jsapi/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js", script.src);
  assertEquals(2, families.length);
};

//If current page is browsed using https protocol, the added script should be requested with SSL.
MonotypeScriptTest.prototype.testIfScriptTagIsAddedWithoutApiurlAndTheScriptUrlHasCorrectSSL = function () {
  var fakedom = { 'head': [], 'body': [] };
  var global = {}; // should be window in actual situation.
  var script = null;
  var families = null;
  var config = { projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7cc' };

  var fakeDomHelper = {
    createElement: function () {
      script = {
        addEventListener: function () {}
      };
      return script;
    },
    insertInto: function (tag, elem) {
      fakedom[tag].push(elem);
      global[webfont.MonotypeScript.HOOK + config.projectId] = function () {
        return ["aachen bold", "kid print regualr"];
      };
      if (script.onload) {
        script.onload();
      }
    },
    getLoadWindow: function () {
      return global;
    },
    getProtocol: function () {
      return "https:";
    }
  };

  function getElementById(Id) {
    var p;
    for (p in fakedom) {
      if (fakedom[p].length > 0) {
        for (i = 0; i < fakedom[p].length; i++) {
          if (fakedom[p][i].id === Id) {
            return fakedom[p][i];
          }
        }
      }
    }
    return null;
  }

  var isSupport = null;
  var userAgent = new webfont.UserAgent("Test", "1.0", "TestEngine", "2.0", "TestPlatform", "3.0", undefined, new webfont.BrowserInfo(false, false, false));
  var monotypeScript = new webfont.MonotypeScript(userAgent, fakeDomHelper, config);
  monotypeScript.supportUserAgent(userAgent, function (support) { isSupport = support; });

  monotypeScript.load(function (fontFamilies) {
    families = fontFamilies;
  });
  //just for testing purpose
  script = getElementById(webfont.MonotypeScript.SCRIPTID + config.projectId);

  assertNotNull(script);
  assertEquals("https://fast.fonts.com/jsapi/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js", script.src);
  assertEquals(2, families.length);
};

//if no projectId is provided in config, the script should not be added.
MonotypeScriptTest.prototype.testWithoutProjectId = function () {
  var fakedom = { 'head': [], 'body': [] };
  var global = {}; // should be window in actual situation.
  var script = null;
  var families = null;
  var config = {};

  var fakeDomHelper = {
    createElement: function () {
      script = {
        addEventListener: function () {}
      };
      return script;
    },
    insertInto: function (tag, elem) {
      fakedom[tag].push(elem);
      global[webfont.MonotypeScript.HOOK + config.projectId] = function () {
        return ["aachen bold", "kid print regualr"];
      };
      if (script.onload) {
        script.onload();
      }
    },
    getLoadWindow: function () {
      return global;
    },
    getProtocol: function () {
      return "http:";
    }
  };

  var isSupport = null;
  var userAgent = new webfont.UserAgent("Test", "1.0", "TestEngine", "2.0", "TestPlatform", "3.0", undefined, new webfont.BrowserInfo(false, false, false));
  var monotypeScript = new webfont.MonotypeScript(userAgent, fakeDomHelper, config);
  monotypeScript.supportUserAgent(userAgent, function (support) { isSupport = support; });

  monotypeScript.load(function (fontFamilies) {
    families = fontFamilies;
  });
  assertNull(script);
  assertEquals(0, families.length);

};
