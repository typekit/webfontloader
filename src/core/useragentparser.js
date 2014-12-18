goog.provide('webfont.UserAgentParser');

goog.require('webfont.BrowserInfo');
goog.require('webfont.UserAgent');
goog.require('webfont.Version');

/**
 * @param {string} userAgent The browser userAgent string to parse.
 * @constructor
 */
webfont.UserAgentParser = function(userAgent, doc) {
  this.userAgent_ = userAgent;
  this.doc_ = doc;
};

/**
 * @const
 * @type {string}
 */
webfont.UserAgentParser.UNKNOWN = "Unknown";

/**
 * A constant for identifying a generic browser on a mobile platform that
 * doesn't really have a name, but just came with the platform. Usually these
 * are WebKit based, and examples are the default browser app on Android and
 * the default browser app on BlackBerry 10.
 * @const
 * @type {string}
 */
webfont.UserAgentParser.BUILTIN_BROWSER = "BuiltinBrowser";

/**
 * @const
 * @type {webfont.UserAgent}
 */
webfont.UserAgentParser.UNKNOWN_USER_AGENT = new webfont.UserAgent(
    webfont.UserAgentParser.UNKNOWN,
    new webfont.Version(),
    webfont.UserAgentParser.UNKNOWN,
    new webfont.Version(),
    webfont.UserAgentParser.UNKNOWN,
    new webfont.Version(),
    undefined,
    new webfont.BrowserInfo(false, false, false, false));


goog.scope(function () {
  var UserAgentParser = webfont.UserAgentParser,
      BrowserInfo = webfont.BrowserInfo,
      UserAgent = webfont.UserAgent,
      Version = webfont.Version;

  /**
   * Parses the user agent string and returns an object.
   * @return {webfont.UserAgent}
   */
  UserAgentParser.prototype.parse = function() {
    if (this.isIe_()) {
      return this.parseIeUserAgentString_();
    } else if (this.isOldOpera_()) {
      return this.parseOldOperaUserAgentString_();
    } else if (this.isOpera_()) {
      return this.parseWebKitUserAgentString_();
    } else if (this.isWebKit_()) {
      return this.parseWebKitUserAgentString_();
    } else if (this.isGecko_()) {
      return this.parseGeckoUserAgentString_();
    } else {
      return webfont.UserAgentParser.UNKNOWN_USER_AGENT;
    }
  };

  /**
   * @private
   */
  UserAgentParser.prototype.getPlatform_ = function() {
    var mobileOs = this.getMatchingGroup_(this.userAgent_,
        /(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/, 1);

    if (mobileOs != "") {
      if (/BB\d{2}/.test(mobileOs)) {
        mobileOs = "BlackBerry";
      }
      return mobileOs;
    }
    var os = this.getMatchingGroup_(this.userAgent_,
        /(Linux|Mac_PowerPC|Macintosh|Windows|CrOS|PlayStation|CrKey)/, 1);

    if (os != "") {
      if (os == "Mac_PowerPC") {
        os = "Macintosh";
      } else if (os == "PlayStation") {
        os = "Linux";
      }
      return os;
    }
    return webfont.UserAgentParser.UNKNOWN;
  };

  /**
   * @private
   * @return {string}
   */
  UserAgentParser.prototype.getPlatformVersionString_ = function() {
    var genericVersion = this.getMatchingGroup_(this.userAgent_,
        /(OS X|Windows NT|Android) ([^;)]+)/, 2);
    if (genericVersion) {
      return genericVersion;
    }
    var winPhoneVersion = this.getMatchingGroup_(this.userAgent_,
        /Windows Phone( OS)? ([^;)]+)/, 2);
    if (winPhoneVersion) {
      return winPhoneVersion;
    }
    var iVersion = this.getMatchingGroup_(this.userAgent_,
        /(iPhone )?OS ([\d_]+)/, 2);
    if (iVersion) {
      return iVersion;
    }
    var linuxOrCrOsVersion = this.getMatchingGroup_(this.userAgent_,
        /(?:Linux|CrOS|CrKey) ([^;)]+)/, 1);
    if (linuxOrCrOsVersion) {
      var parts = linuxOrCrOsVersion.split(/\s/);
      for (var i = 0; i < parts.length; i += 1) {
        if (/^[\d\._]+$/.test(parts[i])) {
          return parts[i];
        }
      }
    }
    var blackBerryVersion = this.getMatchingGroup_(this.userAgent_,
        /(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/, 2);
    if (blackBerryVersion) {
      return blackBerryVersion;
    }

    return UserAgentParser.UNKNOWN;
  };

  /**
   * @private
   */
  UserAgentParser.prototype.isIe_ = function() {
    return this.userAgent_.indexOf("MSIE") != -1 || this.userAgent_.indexOf("Trident/") != -1;
  };

  /**
   * @private
   */
  UserAgentParser.prototype.parseIeUserAgentString_ = function() {
    var platform = this.getPlatform_(),
        platformVersion = Version.parse(this.getPlatformVersionString_()),
        browserVersion = null,
        engine = null,
        engineVersion = null,
        engineVersionString = this.getMatchingGroup_(this.userAgent_, /Trident\/([\d\w\.]+)/, 1),
        documentMode = this.getDocumentMode_(this.doc_);

    if (this.userAgent_.indexOf("MSIE") != -1) {
      browserVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /MSIE ([\d\w\.]+)/, 1));
    } else {
      browserVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /rv:([\d\w\.]+)/, 1));
    }

    if (engineVersionString != '') {
      engine = 'Trident';
      engineVersion = Version.parse(engineVersionString);
    } else {
      engine = UserAgentParser.UNKNOWN;
      engineVersion = new Version();
    }

    var supportWebFont = (platform == "Windows" && browserVersion.major >= 6) ||
                         (platform == "Windows Phone" && platformVersion.major >= 8);

    return new UserAgent(
      "MSIE",
      browserVersion,
      engine,
      engineVersion,
      platform,
      platformVersion,
      documentMode,
      new BrowserInfo(supportWebFont, false, false, !!this.doc_['fonts'])
    );
  };

  /**
   * @private
   */
  UserAgentParser.prototype.isOldOpera_ = function() {
    return this.userAgent_.indexOf("Opera") != -1;
  };

  /**
   * @private
   */
  UserAgentParser.prototype.isOpera_ = function () {
    return /OPR\/[\d.]+/.test(this.userAgent_);
  };

  /**
   * @private
   */
  UserAgentParser.prototype.parseOldOperaUserAgentString_ = function() {
    var engineName = UserAgentParser.UNKNOWN,
        engineVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /Presto\/([\d\w\.]+)/, 1)),
        platformVersion = Version.parse(this.getPlatformVersionString_()),
        documentMode = this.getDocumentMode_(this.doc_);

    if (engineVersion.isValid()) {
      engineName = "Presto";
    } else {
      if (this.userAgent_.indexOf("Gecko") != -1) {
        engineName = "Gecko";
      }
      engineVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /rv:([^\)]+)/, 1));
    }

    // Check for Opera Mini first, since it looks like normal Opera
    if (this.userAgent_.indexOf("Opera Mini/") != -1) {
      var browserVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /Opera Mini\/([\d\.]+)/, 1));

      return new UserAgent(
        "OperaMini",
        browserVersion,
        engineName,
        engineVersion,
        this.getPlatform_(),
        platformVersion,
        documentMode,
        new BrowserInfo(false, false, false, !!this.doc_['fonts'])
      );
    }

    // Otherwise, find version information for normal Opera or Opera Mobile
    if (this.userAgent_.indexOf("Version/") != -1) {
      var browserVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /Version\/([\d\.]+)/, 1));

      if (browserVersion.isValid()) {
        return new UserAgent(
          "Opera",
          browserVersion,
          engineName,
          engineVersion,
          this.getPlatform_(),
          platformVersion,
          documentMode,
          new BrowserInfo(browserVersion.major >= 10, false, false, !!this.doc_['fonts'])
        );
      }
    }
    var browserVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /Opera[\/ ]([\d\.]+)/, 1));

    if (browserVersion.isValid()) {
      return new UserAgent(
        "Opera",
        browserVersion,
        engineName,
        engineVersion,
        this.getPlatform_(),
        platformVersion,
        documentMode,
        new BrowserInfo(browserVersion.major >= 10, false, false, !!this.doc_['fonts'])
      );
    }
    return new UserAgent(
      "Opera",
      new Version(),
      engineName,
      engineVersion,
      this.getPlatform_(),
      platformVersion,
      documentMode,
      new BrowserInfo(false, false, false, !!this.doc_['fonts'])
    );
  };

  /**
   * @private
   */
  UserAgentParser.prototype.isWebKit_ = function() {
    return /AppleWeb(K|k)it/.test(this.userAgent_);
  };

  /**
   * @private
   */
  UserAgentParser.prototype.parseWebKitUserAgentString_ = function() {
    var platform = this.getPlatform_(),
        platformVersion = Version.parse(this.getPlatformVersionString_()),
        webKitVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /AppleWeb(?:K|k)it\/([\d\.\+]+)/, 1)),
        browserName = UserAgentParser.UNKNOWN,
        browserVersion = new Version(),
        browserVersionString = UserAgentParser.UNKNOWN,
        supportWebFont = false;

    if (/OPR\/[\d.]+/.test(this.userAgent_)) {
      browserName = "Opera";
    } else if (this.userAgent_.indexOf("Chrome") != -1 ||
        this.userAgent_.indexOf("CrMo") != -1 ||
        this.userAgent_.indexOf("CriOS") != -1) {
      browserName = "Chrome";
    } else if (/Silk\/\d/.test(this.userAgent_)) {
      browserName = "Silk";
    } else if (platform == "BlackBerry" || platform == "Android") {
      browserName = UserAgentParser.BUILTIN_BROWSER;
    } else if (this.userAgent_.indexOf("PhantomJS") != -1) {
      browserName = "PhantomJS";
    } else if (this.userAgent_.indexOf("Safari") != -1) {
      browserName = "Safari";
    } else if (this.userAgent_.indexOf("AdobeAIR") != -1) {
      browserName = "AdobeAIR";
    } else if (this.userAgent_.indexOf("PlayStation") != -1) {
      browserName = "BuiltinBrowser";
    }

    if (browserName == UserAgentParser.BUILTIN_BROWSER) {
      browserVersionString = UserAgentParser.UNKNOWN;
    } else if (browserName == "Silk") {
      browserVersionString = this.getMatchingGroup_(this.userAgent_, /Silk\/([\d\._]+)/, 1);
    } else if (browserName == "Chrome") {
      browserVersionString = this.getMatchingGroup_(this.userAgent_, /(Chrome|CrMo|CriOS)\/([\d\.]+)/, 2);
    } else if (this.userAgent_.indexOf("Version/") != -1) {
      browserVersionString = this.getMatchingGroup_(this.userAgent_, /Version\/([\d\.\w]+)/, 1);
    } else if (browserName == "AdobeAIR") {
      browserVersionString = this.getMatchingGroup_(this.userAgent_, /AdobeAIR\/([\d\.]+)/, 1);
    } else if (browserName == "Opera") {
      browserVersionString = this.getMatchingGroup_(this.userAgent_, /OPR\/([\d.]+)/, 1);
    } else if (browserName == "PhantomJS") {
      browserVersionString = this.getMatchingGroup_(this.userAgent_, /PhantomJS\/([\d.]+)/, 1);
    }
    browserVersion = Version.parse(browserVersionString);

    if (browserName == "AdobeAIR") {
      supportWebFont = browserVersion.major > 2 || browserVersion.major == 2 && browserVersion.minor >= 5;
    } else if (platform == "BlackBerry") {
      supportWebFont = platformVersion.major >= 10;
    } else if (platform == "Android") {
      supportWebFont = platformVersion.major > 2 || (platformVersion.major == 2 && platformVersion.minor > 1);
    } else {
      supportWebFont = webKitVersion.major >= 526 || webKitVersion.major >= 525 && webKitVersion.minor >= 13;
    }

    var hasWebKitFallbackBug = webKitVersion.major < 536 || (webKitVersion.major == 536 && webKitVersion.minor < 11),
        hasWebKitMetricsBug = platform == 'iPhone' || platform == 'iPad' || platform == 'iPod' || platform == 'Macintosh';

    return new UserAgent(
      browserName,
      browserVersion,
      "AppleWebKit",
      webKitVersion,
      platform,
      platformVersion,
      this.getDocumentMode_(this.doc_),
      new BrowserInfo(supportWebFont, hasWebKitFallbackBug, hasWebKitMetricsBug, !!this.doc_['fonts'])
    );
  };

  /**
   * @private
   */
  UserAgentParser.prototype.isGecko_ = function() {
    return this.userAgent_.indexOf("Gecko") != -1;
  };

  /**
   * @private
   */
  UserAgentParser.prototype.parseGeckoUserAgentString_ = function() {
    var name = UserAgentParser.UNKNOWN,
        version = new Version(),
        platformVersion = Version.parse(this.getPlatformVersionString_()),
        supportWebFont = false;

    if (this.userAgent_.indexOf("Firefox") != -1) {
      name = "Firefox";
      version = Version.parse(this.getMatchingGroup_(this.userAgent_, /Firefox\/([\d\w\.]+)/, 1));
      supportWebFont = version.major >= 3 && version.minor >= 5;
    } else if (this.userAgent_.indexOf("Mozilla") != -1) {
      name = "Mozilla";
    }

    var engineVersion = Version.parse(this.getMatchingGroup_(this.userAgent_, /rv:([^\)]+)/, 1));

    if (!supportWebFont) {
      supportWebFont = engineVersion.major > 1 ||
                       engineVersion.major == 1 && engineVersion.minor > 9 ||
                       engineVersion.major == 1 && engineVersion.minor == 9 && engineVersion.patch >= 2;
    }
    return new UserAgent(
      name,
      version,
      "Gecko",
      engineVersion,
      this.getPlatform_(),
      platformVersion,
      this.getDocumentMode_(this.doc_),
      new BrowserInfo(supportWebFont, false, false, !!this.doc_['fonts'])
    );
  };

  /**
   * @private
   */
  UserAgentParser.prototype.getMatchingGroup_ = function(str,
      regexp, index) {
    var groups = str.match(regexp);

    if (groups && groups[index]) {
      return groups[index];
    }
    return "";
  };

  /**
   * @private
   */
  UserAgentParser.prototype.getDocumentMode_ = function(doc) {
    if (doc.documentMode) return doc.documentMode;
    return undefined;
  };
});
