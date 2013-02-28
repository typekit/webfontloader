goog.provide('webfont.UserAgentParser');

goog.require('webfont.BrowserInfo');
goog.require('webfont.UserAgent');

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
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    undefined,
    new webfont.BrowserInfo(false, false, false));


goog.scope(function () {
  var UserAgentParser = webfont.UserAgentParser,
      BrowserInfo = webfont.BrowserInfo,
      UserAgent = webfont.UserAgent;

  /**
   * Parses the user agent string and returns an object.
   * @return {webfont.UserAgent}
   */
  UserAgentParser.prototype.parse = function() {
    if (this.isIe_()) {
      return this.parseIeUserAgentString_();
    } else if (this.isOpera_()) {
      return this.parseOperaUserAgentString_();
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
        /(Linux|Mac_PowerPC|Macintosh|Windows|CrOS)/, 1);

    if (os != "") {
      if (os == "Mac_PowerPC") {
        os = "Macintosh";
      }
      return os;
    }
    return webfont.UserAgentParser.UNKNOWN;
  };

  /**
   * @private
   */
  UserAgentParser.prototype.getPlatformVersion_ = function() {
    var genericVersion = this.getMatchingGroup_(this.userAgent_,
        /(OS X|Windows NT|Android|CrOS) ([^;)]+)/, 2);
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
    var linuxVersion = this.getMatchingGroup_(this.userAgent_,
        /Linux ([i\d]+)/, 1);
    if (linuxVersion) {
      return linuxVersion;
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
    return this.userAgent_.indexOf("MSIE") != -1;
  };

  /**
   * @private
   */
  UserAgentParser.prototype.parseIeUserAgentString_ = function() {
    // For IE we give MSIE as the engine name and the version of IE
    // instead of the specific Trident engine name and version

    var platform = this.getPlatform_();
    var platformVersionString = this.getPlatformVersion_();

    var browser = this.getMatchingGroup_(this.userAgent_, /(MSIE [\d\w\.]+)/, 1);

    if (browser != "") {
      var pair = browser.split(' ');
      var name = pair[0];
      var version = pair[1];
      var browserVersion = this.parseVersion_(version);
      var platformVersion = this.parseVersion_(platformVersionString);
      var supportWebFont = (platform == "Windows" && browserVersion.major >= 6) ||
          (platform == "Windows Phone" && platformVersion.major >= 8);

      return new UserAgent(name, version, name, version,
          platform, platformVersionString, this.getDocumentMode_(this.doc_), new BrowserInfo(supportWebFont, false, false));

    }

    return new UserAgent("MSIE", webfont.UserAgentParser.UNKNOWN,
        "MSIE", webfont.UserAgentParser.UNKNOWN,
        platform, platformVersionString, this.getDocumentMode_(this.doc_), new BrowserInfo(false, false, false));
  };

  /**
   * @private
   */
  UserAgentParser.prototype.isOpera_ = function() {
    return this.userAgent_.indexOf("Opera") != -1;
  };

  /**
   * @private
   */
  UserAgentParser.prototype.parseOperaUserAgentString_ = function() {
    var engineName = UserAgentParser.UNKNOWN;
    var engineVersion = UserAgentParser.UNKNOWN;
    var enginePair = this.getMatchingGroup_(this.userAgent_,
        /(Presto\/[\d\w\.]+)/, 1);

    if (enginePair != "") {
      var splittedEnginePair = enginePair.split('/');

      engineName = splittedEnginePair[0];
      engineVersion = splittedEnginePair[1];
    } else {
      if (this.userAgent_.indexOf("Gecko") != -1) {
        engineName = "Gecko";
      }
      var geckoVersion = this.getMatchingGroup_(this.userAgent_, /rv:([^\)]+)/, 1);

      if (geckoVersion != "") {
        engineVersion = geckoVersion;
      }
    }

    // Check for Opera Mini first, since it looks like normal Opera
    if (this.userAgent_.indexOf("Opera Mini/") != -1) {
      var version = this.getMatchingGroup_(this.userAgent_, /Opera Mini\/([\d\.]+)/, 1);

      if (version == "") {
        version = UserAgentParser.UNKNOWN;
      }

      return new UserAgent("OperaMini", version, engineName,
          engineVersion, this.getPlatform_(), this.getPlatformVersion_(),
          this.getDocumentMode_(this.doc_), new BrowserInfo(false, false, false));
    }

    // Otherwise, find version information for normal Opera or Opera Mobile
    if (this.userAgent_.indexOf("Version/") != -1) {
      var versionString = this.getMatchingGroup_(this.userAgent_, /Version\/([\d\.]+)/, 1);

      if (versionString != "") {
        var version = this.parseVersion_(versionString);
        return new UserAgent("Opera", versionString, engineName, engineVersion,
            this.getPlatform_(), this.getPlatformVersion_(),
            this.getDocumentMode_(this.doc_), new BrowserInfo(version.major >= 10, false, false));
      }
    }
    var versionString = this.getMatchingGroup_(this.userAgent_, /Opera[\/ ]([\d\.]+)/, 1);

    if (versionString != "") {
      var version = this.parseVersion_(versionString);
      return new UserAgent("Opera", versionString, engineName, engineVersion,
          this.getPlatform_(), this.getPlatformVersion_(),
          this.getDocumentMode_(this.doc_), new BrowserInfo(version.major >= 10, false, false));
    }
    return new UserAgent("Opera", UserAgentParser.UNKNOWN,
        engineName, engineVersion, this.getPlatform_(),
        this.getPlatformVersion_(), this.getDocumentMode_(this.doc_), new BrowserInfo(false, false, false));
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
    var platform = this.getPlatform_();
    var platformVersionString = this.getPlatformVersion_();
    var webKitVersionString = this.getMatchingGroup_(this.userAgent_,
        /AppleWeb(?:K|k)it\/([\d\.\+]+)/, 1);
    var supportWebFont = false;

    if (webKitVersionString == "") {
      webKitVersionString = UserAgentParser.UNKNOWN;
    }

    var webKitVersion = this.parseVersion_(webKitVersionString);
    var platformVersion = this.parseVersion_(platformVersionString);
    var name = UserAgentParser.UNKNOWN;

    if (this.userAgent_.indexOf("Chrome") != -1 || this.userAgent_.indexOf("CrMo") != -1 || this.userAgent_.indexOf("CriOS") != -1) {
      name = "Chrome";
    } else if (platform == "BlackBerry" || platform == "Android") {
      name = UserAgentParser.BUILTIN_BROWSER;
    } else if (this.userAgent_.indexOf("Safari") != -1) {
      name = "Safari";
    } else if (this.userAgent_.indexOf("AdobeAIR") != -1) {
      name = "AdobeAIR";
    }
    var version = UserAgentParser.UNKNOWN;

    if (name == UserAgentParser.BUILTIN_BROWSER) {
      version = UserAgentParser.UNKNOWN;
    } else if (this.userAgent_.indexOf("Version/") != -1) {
      version = this.getMatchingGroup_(this.userAgent_,
          /Version\/([\d\.\w]+)/, 1);
    } else if (name == "Chrome") {
      version = this.getMatchingGroup_(this.userAgent_,
          /(Chrome|CrMo|CriOS)\/([\d\.]+)/, 2);
    } else if (name == "AdobeAIR") {
      version = this.getMatchingGroup_(this.userAgent_,
          /AdobeAIR\/([\d\.]+)/, 1);
    }
    if (name == "AdobeAIR") {
      var browserVersion = this.parseVersion_(version);
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

    return new UserAgent(name, version, "AppleWebKit", webKitVersionString,
        platform, platformVersionString, this.getDocumentMode_(this.doc_), new BrowserInfo(supportWebFont, hasWebKitFallbackBug, hasWebKitMetricsBug));
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
    var name = UserAgentParser.UNKNOWN;
    var version = UserAgentParser.UNKNOWN;
    var supportWebFont = false;

    if (this.userAgent_.indexOf("Firefox") != -1) {
      name = "Firefox";
      var versionNum = this.getMatchingGroup_(this.userAgent_,
          /Firefox\/([\d\w\.]+)/, 1);

      if (versionNum != "") {
        var firefoxVersion = this.parseVersion_(versionNum);

        version = versionNum;
        supportWebFont = firefoxVersion.major >= 3 &&
                         firefoxVersion.minor >= 5;
      }
    } else if (this.userAgent_.indexOf("Mozilla") != -1) {
      name = "Mozilla";
    }
    var geckoVersionString = this.getMatchingGroup_(this.userAgent_, /rv:([^\)]+)/, 1);

    if (geckoVersionString == "") {
      geckoVersionString = UserAgentParser.UNKNOWN;
    } else {
      if (!supportWebFont) {
        var geckoVersion = this.parseVersion_(geckoVersionString);

        supportWebFont = geckoVersion.major > 1 ||
                         geckoVersion.major == 1 && geckoVersion.minor > 9 ||
                         geckoVersion.major == 1 && geckoVersion.minor == 9 && geckoVersion.patch >= 2 ||
                         geckoVersionString.match(/1\.9\.1b[123]/) != null ||
                         geckoVersionString.match(/1\.9\.1\.[\d\.]+/) != null;
      }
    }
    return new UserAgent(name, version, "Gecko", geckoVersionString,
        this.getPlatform_(), this.getPlatformVersion_(), this.getDocumentMode_(this.doc_), new BrowserInfo(supportWebFont, false, false));
  };

  /**
   * @private
   */
  UserAgentParser.prototype.parseVersion_ = function(version) {
    var m = /([0-9]+)(?:\.([0-9]+)(?:\.([0-9]+)?)?)?/.exec(version),
        result = {};

    if (m) {
      result.major = parseInt(m[1] || -1, 10);
      result.minor = parseInt(m[2] || -1, 10);
      result.patch = parseInt(m[3] || -1, 10);
    }
    return result;
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
