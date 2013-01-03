var UserAgentTest = TestCase('UserAgentTest');
UserAgentTest.prototype.setUp = function() {
  this.defaultDocument_ = { };
  this.ie8Document_ = { documentMode: 8 };
};

UserAgentTest.prototype.testBrowserIsAir = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/531.9 (KHTML, like Gecko) AdobeAIR/2.5",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("AdobeAIR", userAgent.getName());
  assertEquals("2.5", userAgent.getVersion());
  assertEquals("Macintosh", userAgent.getPlatform());
  assertEquals("Unknown", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("531.9", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsUnsupportedAir = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/531.9 (KHTML, like Gecko) AdobeAIR/2.0",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("AdobeAIR", userAgent.getName());
  assertEquals("2.0", userAgent.getVersion());
  assertEquals("Macintosh", userAgent.getPlatform());
  assertEquals("Unknown", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("531.9", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsFirefox = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3 GTB7.1",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Firefox", userAgent.getName());
  assertEquals("3.6.3", userAgent.getVersion());
  assertEquals("Macintosh", userAgent.getPlatform());
  assertEquals("10.5", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.9.2.3", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsFirefox4beta = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:2.0b1) Gecko/20100630 Firefox/4.0b1",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Firefox", userAgent.getName());
  assertEquals("4.0b1", userAgent.getVersion());
  assertEquals("Macintosh", userAgent.getPlatform());
  assertEquals("10.6", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("2.0b1", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsChrome = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.9 Safari/533.2",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Chrome", userAgent.getName());
  assertEquals("5.0.342.9", userAgent.getVersion());
  assertEquals("Macintosh", userAgent.getPlatform());
  assertEquals("10_5_8", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("533.2", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsChromeOS = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (X11; CrOS i686 1660.57.0) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.46 Safari/535.19",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Chrome", userAgent.getName());
  assertEquals("18.0.1025.46", userAgent.getVersion());
  assertEquals("CrOS", userAgent.getPlatform());
  assertEquals("i686 1660.57.0", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("535.19", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsSafari = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Safari", userAgent.getName());
  assertEquals("4.0.4", userAgent.getVersion());
  assertEquals("Macintosh", userAgent.getPlatform());
  assertEquals("10_5_8", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("531.21.8", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIE = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("MSIE", userAgent.getName());
  assertEquals("7.0", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("MSIE", userAgent.getEngine());
  assertEquals("7.0", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIEMinimal = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("MSIE", userAgent.getName());
  assertEquals("7.0", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("MSIE", userAgent.getEngine());
  assertEquals("7.0", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIEOnWindowsPhone = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; ARM; Touch; IEMobile/10.0; <Manufacturer>; <Device>; <Operator>)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("MSIE", userAgent.getName());
  assertEquals("10.0", userAgent.getVersion());
  assertEquals("Windows Phone", userAgent.getPlatform());
  assertEquals("8.0", userAgent.getPlatformVersion());
  assertEquals("MSIE", userAgent.getEngine());
  assertEquals("10.0", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIEOnOldWindowsPhone = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; SGH-i917)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("MSIE", userAgent.getName());
  assertEquals("9.0", userAgent.getVersion());
  assertEquals("Windows Phone", userAgent.getPlatform());
  assertEquals("7.5", userAgent.getPlatformVersion());
  assertEquals("MSIE", userAgent.getEngine());
  assertEquals("9.0", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIPhone = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_1_2 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7D11 Safari/528.16",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Safari", userAgent.getName());
  assertEquals("4.0", userAgent.getVersion());
  assertEquals("iPhone", userAgent.getPlatform());
  assertEquals("3_1_2", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("528.18", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsAndroid = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Linux; U; Android 2.2.1; en-ca; LG-P505R Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("BuiltinBrowser", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Android", userAgent.getPlatform());
  assertEquals("2.2.1", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("533.1", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsOldUnsupportedAndroid = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Linux; U; Android 2.1-update1; en-us; Nexus One Build/ERE27) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("BuiltinBrowser", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Android", userAgent.getPlatform());
  assertEquals("2.1-update1", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("530.17", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsAndroidChromeMobile = function() {
  var userAgentParser = new webfont.UserAgentParser(
    "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; Nexus S Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7",
    this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Chrome", userAgent.getName());
  assertEquals("16.0.912.75", userAgent.getVersion());
  assertEquals("Android", userAgent.getPlatform());
  assertEquals("4.0.3", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("535.7", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsAndroidFirefox = function() {
  // This useragent has been slightly doctored with versions to ensure the right
  // info is coming from the right places.
  var userAgentParser = new webfont.UserAgentParser(
    "Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/15.0 Firefox/14.0",
    this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Firefox", userAgent.getName());
  assertEquals("14.0", userAgent.getVersion());
  assertEquals("Android", userAgent.getPlatform());
  assertEquals("Unknown", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("13.0", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
}

UserAgentTest.prototype.testBrowserIsFirefoxLettersVersion = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (X11; U; Linux i686; ru-RU; rv:1.9.2a1pre) Gecko/20090405 Ubuntu/9.04 (jaunty) Firefox/3.6a1pre",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Firefox", userAgent.getName());
  assertEquals("3.6a1pre", userAgent.getVersion());
  assertEquals("Linux", userAgent.getPlatform());
  assertEquals("i686", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.9.2a1pre", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsFirefoxNoVersion = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.19) Gecko/20081202 Firefox (Debian-2.0.0.19-0etch1)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Firefox", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Linux", userAgent.getPlatform());
  assertEquals("i686", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.8.1.19", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIELetterVersion = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.1; Media Center PC 3.0; .NET CLR 1.0.3705; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.1)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("MSIE", userAgent.getName());
  assertEquals("7.0b", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("MSIE", userAgent.getEngine());
  assertEquals("7.0b", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsOpera = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Opera/9.80 (Linux i686; U; en) Presto/2.5.22 Version/10.51",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Opera", userAgent.getName());
  assertEquals("10.51", userAgent.getVersion());
  assertEquals("Linux", userAgent.getPlatform());
  assertEquals("i686", userAgent.getPlatformVersion());
  assertEquals("Presto", userAgent.getEngine());
  assertEquals("2.5.22", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsOperaFirefoxInUAString = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Linux i686 ; U; en; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 9.70",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Opera", userAgent.getName());
  assertEquals("9.70", userAgent.getVersion());
  assertEquals("Linux", userAgent.getPlatform());
  assertEquals("i686", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.8.1", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsOperaBeforeVersion10 = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Opera/9.64 (X11; Linux i686; U; Linux Mint; nb) Presto/2.1.1",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Opera", userAgent.getName());
  assertEquals("9.64", userAgent.getVersion());
  assertEquals("Linux", userAgent.getPlatform());
  assertEquals("i686", userAgent.getPlatformVersion());
  assertEquals("Presto", userAgent.getEngine());
  assertEquals("2.1.1", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsOperaMobileAndroid = function() {
  // For the purposes of web font support, we consider Opera Mobile to be a
  // version of full Opera on mobile devices, since the support for web fonts
  // follows the same version numbers as the desktop versions.
  var userAgentParser = new webfont.UserAgentParser(
    "Opera/9.80 (Android 4.1.1; Linux; Opera Mobi/ADR-1207201819; U; en) Presto/2.10.254 Version/12.00",
    this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Opera", userAgent.getName());
  assertEquals("12.00", userAgent.getVersion());
  assertEquals("Android", userAgent.getPlatform());
  assertEquals("4.1.1", userAgent.getPlatformVersion());
  assertEquals("Presto", userAgent.getEngine());
  assertEquals("2.10.254", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsOperaMiniAndroid = function() {
  // For the purposes of web font support, we consider Opera Mini to be a
  // different browser from the full Opera, since it doesn't support web fonts
  // and follows two separate versioning systems. We use the Opera Mini version
  // instead of the more generic Opera version.
  var userAgentParser = new webfont.UserAgentParser(
    "Opera/9.80 (Android; Opera Mini/7.0.29952/28.2144; U; en) Presto/2.8.119 Version/11.10",
    this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("OperaMini", userAgent.getName());
  assertEquals("7.0.29952", userAgent.getVersion());
  assertEquals("Android", userAgent.getPlatform());
  assertEquals("Unknown", userAgent.getPlatformVersion());
  assertEquals("Presto", userAgent.getEngine());
  assertEquals("2.8.119", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
}

UserAgentTest.prototype.testBrowserIsIEOnMac = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/4.0 (compatible; MSIE 5.23; Mac_PowerPC)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("MSIE", userAgent.getName());
  assertEquals("5.23", userAgent.getVersion());
  assertEquals("Macintosh", userAgent.getPlatform());
  assertEquals("Unknown", userAgent.getPlatformVersion());
  assertEquals("MSIE", userAgent.getEngine());
  assertEquals("5.23", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIPad = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Safari", userAgent.getName());
  assertEquals("4.0.4", userAgent.getVersion());
  assertEquals("iPad", userAgent.getPlatform());
  assertEquals("3_2", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("531.21.10", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIPadAlt = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B360 Safari/531.21.10",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Safari", userAgent.getName());
  assertEquals("4.0.4", userAgent.getVersion());
  assertEquals("iPad", userAgent.getPlatform());
  assertEquals("3_2", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("531.21.10", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIPadWithoutIPhone = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Safari", userAgent.getName());
  assertEquals("4.0.4", userAgent.getVersion());
  assertEquals("iPad", userAgent.getPlatform());
  assertEquals("3_2", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("531.21.10", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIPadChrome = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (iPad; U; CPU OS 5_1_1 like Mac OS X; en-us) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Chrome", userAgent.getName());
  assertEquals("19.0.1084.60", userAgent.getVersion());
  assertEquals("iPad", userAgent.getPlatform());
  assertEquals("5_1_1", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("534.46.0", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
}

UserAgentTest.prototype.testBrowserIsIPod = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (iPod; U; CPU iPhone OS 2_2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Mobile/5H11a",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Unknown", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("iPod", userAgent.getPlatform());
  assertEquals("2_2_1", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("525.18.1", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIPodSafari = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_1 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7C144 Safari/528.16",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Safari", userAgent.getName());
  assertEquals("4.0", userAgent.getVersion());
  assertEquals("iPod", userAgent.getPlatform());
  assertEquals("3_1", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("528.18", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIPodChrome = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (iPod; U; CPU iPhone OS 5_1_1 like Mac OS X; en-us) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Chrome", userAgent.getName());
  assertEquals("19.0.1084.60", userAgent.getVersion());
  assertEquals("iPod", userAgent.getPlatform());
  assertEquals("5_1_1", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("534.46.0", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
}

UserAgentTest.prototype.testBrowserIsSafariWithPlusVersion = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_4_11; tr) AppleWebKit/528.4+ (KHTML, like Gecko) Version/4.0dp1 Safari/526.11.2",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Safari", userAgent.getName());
  assertEquals("4.0dp1", userAgent.getVersion());
  assertEquals("Macintosh", userAgent.getPlatform());
  assertEquals("10_4_11", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("528.4+", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserIsIEWithTridentVersion = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; InfoPath.2)",
      this.ie8Document_);
  var userAgent = userAgentParser.parse();

  assertEquals("MSIE", userAgent.getName());
  assertEquals("8.0", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("6.1", userAgent.getPlatformVersion());
  assertEquals("MSIE", userAgent.getEngine());
  assertEquals("8.0", userAgent.getEngineVersion());
  assertEquals(8, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

// Invented user agent strings

UserAgentTest.prototype.testBrowserGeckoShouldSupportWebFont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.9.1.4) Gecko/20091016 (.NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Mozilla", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.9.1.4", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserGeckoNotExistingVersionShouldSupportWebFont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:2.5.8) Gecko/20091016 (.NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Mozilla", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("2.5.8", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserGeckoVer110ShouldSupportWebFont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.10.1b) Gecko/20091016 (.NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Mozilla", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.10.1b", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserGeckoWeirdVerShouldNotSupportWebFont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.b) Gecko/20091016 (.NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Mozilla", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.b", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserGeckoYetAnotherWeirdVerShouldNotSupportWebFont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.b) Gecko/20091016 (.NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Mozilla", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.b", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserGeckoNoSubVerShouldNotSupportWebFont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.9) Gecko/20091016 (.NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Mozilla", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("1.9", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserGeckoHighMinorVerShouldNotSupportWebFont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:0.10.1) Gecko/20091016 (.NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Mozilla", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("0.10.1", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserGeckoHighSubVerShouldNotSupportWebFont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:0.3.42) Gecko/20091016 (.NET CLR 3.5.30729)",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Mozilla", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("Windows", userAgent.getPlatform());
  assertEquals("5.1", userAgent.getPlatformVersion());
  assertEquals("Gecko", userAgent.getEngine());
  assertEquals("0.3.42", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserBBSupportWebfont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.3+ (KHTML, like Gecko) Version/10.0.9.388 Mobile Safari/537.3+",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("BuiltinBrowser", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("BlackBerry", userAgent.getPlatform());
  assertEquals("10.0.9.388", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("537.3+", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserBBNotSupportWebfont = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("BuiltinBrowser", userAgent.getName());
  assertEquals("Unknown", userAgent.getVersion());
  assertEquals("BlackBerry", userAgent.getPlatform());
  assertEquals("7.1.0.346", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("534.11+", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertFalse(userAgent.getBrowserInfo().hasWebFontSupport());
};

UserAgentTest.prototype.testBrowserWebKitFallbackBug = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.9 Safari/536.5",
      this.defaultDocument_);

  var userAgent = userAgentParser.parse();

  assertTrue(userAgent.getBrowserInfo().hasWebKitFallbackBug());
};

UserAgentTest.prototype.testBrowserWebKitNoFallbackBug = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.814.2 Safari/536.11",
      this.defaultDocument_);

  var userAgent = userAgentParser.parse();

  assertFalse(userAgent.getBrowserInfo().hasWebKitFallbackBug());
};
