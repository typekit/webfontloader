var monotypeFontApiTest = TestCase('monotypeFontApiTest');

monotypeFontApiTest.prototype.test_document_helper_write = function () {
    var output = null;
    var fakeDocument = {
        write: function (str) {
            output = str;
        }
    }

    var docHelper = new webfont.monotype.DocumentHelper(fakeDocument);
    var input = "Test123 Test123";
    docHelper.write(input);
    assertEquals(input, output);
}

monotypeFontApiTest.prototype.test_document_helper_protocol = function () {
    var fakeDocument = {
        location: { protocol: "https:" }
    }
    var docHelper = new webfont.monotype.DocumentHelper(fakeDocument);
    assertEquals("https:", docHelper.protocol());
}

monotypeFontApiTest.prototype.test_if_script_tag_is_added = function () {
    var fakeDocumentWriter = {
        write: function (str) {
            script = str;
        },
        protocol: function () {
            return "http:";
        }
    };

    var userAgent = new webfont.UserAgent("Test", "1.0", true);
    var monotypeFontApi = new webfont.monotype.FontApi(userAgent, fakeDocumentWriter, { projectId: '1234', api: "http://fonts.com" });

    var families = null;
    var descriptions = null;

    monotypeFontApi.load(function (fontFamilies, fontDescriptions) {
        families = fontFamilies;
        descriptions = fontDescriptions;
    });

    assertNotNull(families);
    assertEquals(0, families.length);

    assertNotNull(script);
    assertEquals('<script src="http://fonts.com/1234.js" type="text/javascript"></script>', script);
};

monotypeFontApiTest.prototype.test_if_script_tag_is_added_without_apiurl = function () {
    var script = null;
    var fakeDocumentWriter = {
        write: function (str) {
            script = str;
        },
        protocol: function () {
            return "http:";
        }
    };

    var userAgent = new webfont.UserAgent("Test", "1.0", true);
    var monotypeFontApi = new webfont.monotype.FontApi(userAgent, fakeDocumentWriter, { projectId: '1234'});

    var families = null;
    var descriptions = null;

    monotypeFontApi.load(function (fontFamilies, fontDescriptions) {
        families = fontFamilies;
        descriptions = fontDescriptions;
    });

    assertNotNull(families);
    assertEquals(0, families.length);

    assertNotNull(script);
    assertEquals('<script src="http://fast.fonts.com/jsapi/1234.js" type="text/javascript"></script>', script);
};


monotypeFontApiTest.prototype.test_without_projectId = function () {
    var script = null;
    var fakeDocumentWriter = {
        write: function (str) {
            script = str;
        },
        protocol: function () {
            return "http:";
        }
    };

    var userAgent = new webfont.UserAgent("Test", "1.0", true);
    var monotypeFontApi = new webfont.monotype.FontApi(userAgent, fakeDocumentWriter, {});

    var families = null;
    var descriptions = null;

    monotypeFontApi.load(function (fontFamilies, fontDescriptions) {
        families = fontFamilies;
        descriptions = fontDescriptions;
    });

    assertEquals(null, families);
    assertEquals(null, script);
};