var monotypeFontApiTest = TestCase('monotypeFontApiTest');

monotypeFontApiTest.prototype.testDocumentHelperProtocol = function () {
  var fakeDocument = {
    location: { protocol: "https:" }
  }
  var docHelper = new webfont.MonotypeDocumentHelper(fakeDocument);
  assertEquals("https:", docHelper.protocol());
}

monotypeFontApiTest.prototype.testIfScriptTagIsAdded = function () {
  var fakedom = { 'head': [], 'body': [] };
  var script = null;
  var global = {}; // should be window in actual situation.
  var script = null;
  var families = null;
  var config = { projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7cc', api: "http://fast.fonts.com/jsapidev" };

  var fakeDomHelper = {
    createScriptSrc: function (s) {
      script = { src: s };
      return script;
    },
    insertInto: function (tag, elem) {
      fakedom[tag].push(elem);
      global[webfont.MonotypeFontApi.HOOK + config.projectId] = function () {
        return ["aachen bold", "kid print regualr"];
      }
      if (script.onload) {
        script.onload();
      }
    }
  };

  var fakeDocHelper = {
    protocol: function () {
      return "http:";
    }
  };

  function getElementById(Id) {
    for (p in fakedom) {
      if (fakedom[p].length > 0) {
        for (i = 0; i < fakedom[p].length; i++) {
          if (fakedom[p][i].id == Id) {
            return fakedom[p][i];
          }
        }
      }
    }
    return null;
  }
  var isSupport = null;
  var userAgent = new webfont.UserAgent("Test", "1.0", true);
  var monotypeFontApi = new webfont.MonotypeFontApi(global, userAgent, fakeDomHelper, fakeDocHelper, config);
  monotypeFontApi.supportUserAgent(userAgent, function (support) { isSupport = support; });
  monotypeFontApi.load(function (fontFamilies) {
    families = fontFamilies;
  });
  script = getElementById(webfont.MonotypeFontApi.SCRIPTID + config.projectId);

  assertEquals(null, isSupport);
  assertNotNull(script);
  assertEquals(script.src, "http://fast.fonts.com/jsapidev/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js");
  assertEquals(2, families.length);
};

monotypeFontApiTest.prototype.testIfScriptTagIsAddedWithoutApiurl = function () {
  var fakedom = { 'head': [], 'body': [] };
  var global = { }; // should be window in actual situation.
  var script = null;
  var families = null;
  var config = { projectId: '01e2ff27-25bf-4801-a23e-73d328e6c7cc' };

  var fakeDomHelper = {
    createScriptSrc: function (s) {
      script = { src: s };
      return script;
    },
    insertInto: function (tag, elem) {
      fakedom[tag].push(elem);
      global[webfont.MonotypeFontApi.HOOK + config.projectId] = function () {
        return ["aachen bold", "kid print regualr"];
      }
      if (script.onload) {
        script.onload();
      }
    }
  };

  var fakeDocHelper = {
    protocol: function () {
      return "http:";
    }
  }

  function  getElementById(Id) {
    for (p in fakedom) {
      if (fakedom[p].length > 0) {
        for (i = 0; i < fakedom[p].length; i++) {
          if (fakedom[p][i].id == Id) {
            return fakedom[p][i];
          }
        }
      }
    }
    return null;
  }

  var userAgent = new webfont.UserAgent("Test", "1.0", true);
  var monotypeFontApi = new webfont.MonotypeFontApi(global, userAgent, fakeDomHelper, fakeDocHelper, config);
  monotypeFontApi.supportUserAgent(userAgent, function (support) { isSupport = support; });
  var families = null;

  monotypeFontApi.load(function (fontFamilies) {
    families = fontFamilies;
  });
  //just for testing purpose
  script = getElementById(webfont.MonotypeFontApi.SCRIPTID + config.projectId);

  assertNotNull(script);
  assertEquals("http://fast.fonts.com/jsapi/01e2ff27-25bf-4801-a23e-73d328e6c7cc.js", script.src);
  assertEquals(2, families.length);
};

//if no projectId is provided in config, the script should not be added.
monotypeFontApiTest.prototype.testWithoutProjectId = function () {
  var fakedom = { 'head': [], 'body': [] };
  var global = {}; // should be window in actual situation.
  var script = null;
  var families = null;
  var config = {};

  var fakeDomHelper = {
    createScriptSrc: function (s) {
      script = { src: s };
      return script;
    },
    insertInto: function (tag, elem) {
      fakedom[tag].push(elem);
      global[webfont.MonotypeFontApi.HOOK + config.projectId] = function () {
        return ["aachen bold", "kid print regualr"];
      }
      if (script.onload) {
        script.onload();
      }
    }
  };

  var fakeDocHelper = {
    protocol: function () {
      return "http:";
    }
  }

  var userAgent = new webfont.UserAgent("Test", "1.0", true);
  var monotypeFontApi = new webfont.MonotypeFontApi(global, userAgent, fakeDomHelper, fakeDocHelper, config);
  monotypeFontApi.supportUserAgent(userAgent, function (support) { isSupport = support; });
  var families = null;

  monotypeFontApi.load(function (fontFamilies) {
    families = fontFamilies;
  });
  assertNull(script);
  assertEquals(0, families.length);
};