var UserAgentTest = TestCase('UserAgentTest');
UserAgentTest.prototype.setUp = function() {
  this.defaultDocument_ = { };
  this.ie8Document_ = { documentMode: 8 };
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertEquals("2.0b1", userAgent.getEngineVersion
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
};


UserAgentTest.prototype.testBrowserIsAndroid = function() {
  var userAgentParser = new webfont.UserAgentParser(
      "Mozilla/5.0 (Linux; U; Android 2.1-update1; en-us; Nexus One Build/ERE27) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17",
      this.defaultDocument_);
  var userAgent = userAgentParser.parse();

  assertEquals("Safari", userAgent.getName());
  assertEquals("4.0", userAgent.getVersion());
  assertEquals("Android", userAgent.getPlatform());
  assertEquals("2.1-update1", userAgent.getPlatformVersion());
  assertEquals("AppleWebKit", userAgent.getEngine());
  assertEquals("530.17", userAgent.getEngineVersion());
  assertEquals(undefined, userAgent.getDocumentMode());
  assertTrue(userAgent.isSupportingWebFont());
};

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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertFalse(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertFalse(userAgent.isSupportingWebFont());
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
  assertFalse(userAgent.isSupportingWebFont());
};

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
  assertFalse(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
};

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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
};

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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertTrue(userAgent.isSupportingWebFont());
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
  assertFalse(userAgent.isSupportingWebFont());
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
  assertFalse(userAgent.isSupportingWebFont());
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
  assertFalse(userAgent.isSupportingWebFont());
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
  assertFalse(userAgent.isSupportingWebFont());
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
  assertFalse(userAgent.isSupportingWebFont());
};
