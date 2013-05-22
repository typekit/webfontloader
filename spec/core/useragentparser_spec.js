describe('UserAgentParser', function () {
  var UserAgentParser = webfont.UserAgentParser,
      Version = webfont.Version;

  beforeEach(function () {
    this.addMatchers({
      toMatchUserAgent: function (expected) {
        var actual = this.actual,
            notText = this.isNot ? 'not' : '';

        function msg(description, actual, expected) {
          return function () {
            return 'Expected ' + description + ' ' + actual + notText + ' to match ' + expected;
          };
        }

        if (actual.getName() !== expected.name) {
          this.message = msg('name', actual.getName(), expected.name);
          return false;
        }

        if (actual.getParsedVersion().ne(expected.version)) {
          this.message = msg('version', actual.getParsedVersion(), expected.version);
          return false;
        }

        if (actual.getPlatform() !== expected.platform) {
          this.message = msg('platform', actual.getPlatform(), expected.platform);
          return false;
        }

        if (actual.getParsedPlatformVersion().ne(expected.platformVersion)) {
          this.message = msg('platform version', actual.getParsedPlatformVersion(), expected.platformVersion);
          return false;
        }

        if (actual.getEngine() !== expected.engine) {
          this.message = msg('engine', actual.getEngine(), expected.engine);
          return false;
        }

        if (actual.getParsedEngineVersion().ne(expected.engineVersion)) {
          this.message = msg('engine version', actual.getParsedEngineVersion(), expected.engineVersion);
          return false;
        }

        if (actual.getDocumentMode() !== expected.documentMode) {
          this.message = msg('document mode', actual.getDocumentMode(), expected.documentMode);
          return false;
        }

        if (actual.getBrowserInfo().hasWebFontSupport() !== expected.browserInfo.hasWebFontSupport) {
          this.message = msg('web font support', actual.getBrowserInfo().hasWebFontSupport(), expected.browserInfo.hasWebFontSupport);
          return false;
        }

        if (actual.getBrowserInfo().hasWebKitFallbackBug() !== expected.browserInfo.hasWebKitFallbackBug) {
          this.message = msg('web kit fallback bug', actual.getBrowserInfo().hasWebKitFallbackBug(), expected.browserInfo.hasWebKitFallbackBug);
          return false;
        }

        if (actual.getBrowserInfo().hasWebKitMetricsBug() !== expected.browserInfo.hasWebKitMetricsBug) {
          this.message = msg('web kit metrics bug', actual.getBrowserInfo().hasWebKitMetricsBug(), expected.browserInfo.hasWebKitFallbackBug);
          return false;
        }

        return true;
      }
    });
  });

  describe('#getPlatformVersionString_', function () {
    function parsePlatformVersion(str) {
      return new UserAgentParser(str, {}).getPlatformVersionString_();
    }

    it('should parse Linux versions correctly', function () {
      expect(parsePlatformVersion('(Linux; U; en-us; KFJWI Build/IML74K)')).toEqual('Unknown');
      expect(parsePlatformVersion('(Linux i686; U; en)')).toEqual('Unknown');
      expect(parsePlatformVersion('(X11; Linux i686; U; Linux Mint; nb)')).toEqual('Unknown');
      expect(parsePlatformVersion('(X11; Linux x86_64)')).toEqual('Unknown');
      expect(parsePlatformVersion('(X11; U; en-US; rv:2.0; Linux i686 10.1)')).toEqual('10.1');
      expect(parsePlatformVersion('(X11; Linux i868 10.1; U; en-US; rv:2.0)')).toEqual('10.1');
      expect(parsePlatformVersion('(X11; Linux 10.1; U; en-US)')).toEqual('10.1');
    });

    it('should parse ChromeOS versions correctly', function () {
      expect(parsePlatformVersion('(X11; CrOS i686 1660.57.0)')).toEqual('1660.57.0');
    });
  });

  describe('#parse', function () {
    function parse(userAgentString, doc) {
      return new UserAgentParser(userAgentString, doc || {}).parse();
    }

    describe('Adobe Air', function () {
      it('should detect Adobe Air', function () {
        expect(parse('Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/531.9 (KHTML, like Gecko) AdobeAIR/2.5'))
        .toMatchUserAgent({
          name: 'AdobeAIR',
          version: new Version(2, 5),
          platform: 'Macintosh',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(531, 9),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });

      it('should detect unsupported Adobe Air browsers', function () {
        expect(parse('Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/531.9 (KHTML, like Gecko) AdobeAIR/2.0'))
        .toMatchUserAgent({
          name: 'AdobeAIR',
          version: new Version(2, 0),
          platform: 'Macintosh',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(531, 9),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });
    });

    describe('Firefox', function () {
      it('should detect Firefox', function () {
        expect(parse('Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3 GTB7.1'))
        .toMatchUserAgent({
          name: 'Firefox',
          version: new Version(3, 6, 3),
          platform: 'Macintosh',
          platformVersion: new Version(10, 5),
          engine: 'Gecko',
          engineVersion: new Version(1, 9, 2, 3),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/5.0 (X11; U; Linux i686; ru-RU; rv:1.9.2a1pre) Gecko/20090405 Ubuntu/9.04 (jaunty) Firefox/3.6a1pre'))
        .toMatchUserAgent({
          name: 'Firefox',
          version: new Version(3, 6, null, 'a1pre'),
          platform: 'Linux',
          platformVersion: new Version(), //'i686'
          engine: 'Gecko',
          engineVersion: new Version(1, 9, 2, 'a1pre'),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Firefox 4 beta', function () {
        expect(parse('Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:2.0b1) Gecko/20100630 Firefox/4.0b1'))
        .toMatchUserAgent({
          name: 'Firefox',
          version: new Version(4, 0, null, 'b1'),
          platform: 'Macintosh',
          platformVersion: new Version(10, 6),
          engine: 'Gecko',
          engineVersion: new Version(2, 0, 'b1'),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Firefox on Android', function () {
        // This useragent has been slightly doctored with versions to ensure the right
        // info is coming from the right places.
        expect(parse('Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/15.0 Firefox/14.0'))
        .toMatchUserAgent({
          name: 'Firefox',
          version: new Version(14, 0),
          platform: 'Android',
          platformVersion: new Version(),
          engine: 'Gecko',
          engineVersion: new Version(13, 0),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Firefox without version', function () {
        expect(parse('Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.19) Gecko/20081202 Firefox (Debian-2.0.0.19-0etch1)'))
        .toMatchUserAgent({
          name: 'Firefox',
          version: new Version(),
          platform: 'Linux',
          platformVersion: new Version(), //'i686'
          engine: 'Gecko',
          engineVersion: new Version(1, 8, 1, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });
    });

    describe('Chrome', function () {
      it('should detect Chrome', function () {
        expect(parse('Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.9 Safari/533.2'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(5, 0, 342, 9),
          platform: 'Macintosh',
          platformVersion: new Version(10, 5, 8),
          engine: 'AppleWebKit',
          engineVersion: new Version(533, 2),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });

      it('should detect Chrome on ChromeOS', function () {
        expect(parse('Mozilla/5.0 (X11; CrOS i686 1660.57.0) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.46 Safari/535.19'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(18, 0, 1025, 46),
          platform: 'CrOS',
          platformVersion: new Version(1660, 57, 0),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Chrome on Android', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; Nexus S Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(16, 0, 912, 75),
          platform: 'Android',
          platformVersion: new Version(4, 0, 3),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 7),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Chrome on iPad', function () {
        expect(parse('Mozilla/5.0 (iPad; U; CPU OS 5_1_1 like Mac OS X; en-us) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(19, 0, 1084, 60),
          platform: 'iPad',
          platformVersion: new Version(5, 1, 1),
          engine: 'AppleWebKit',
          engineVersion: new Version(534, 46, 0),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });

      it('should detect Chrome on iPod', function () {
        expect(parse('Mozilla/5.0 (iPod; U; CPU iPhone OS 5_1_1 like Mac OS X; en-us) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(19, 0, 1084, 60),
          platform: 'iPod',
          platformVersion: new Version(5, 1, 1),
          engine: 'AppleWebKit',
          engineVersion: new Version(534, 46, 0),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });
    });

    describe('Safari', function () {
      it('should detect Safari', function () {
        expect(parse('Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10'))
        .toMatchUserAgent({
          name: 'Safari',
          version: new Version(4, 0, 4),
          platform: 'Macintosh',
          platformVersion: new Version(10, 5, 8),
          engine: 'AppleWebKit',
          engineVersion: new Version(531, 21, 8),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });

        expect(parse('Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_4_11; tr) AppleWebKit/528.4+ (KHTML, like Gecko) Version/4.0dp1 Safari/526.11.2'))
        .toMatchUserAgent({
          name: 'Safari',
          version: new Version(4, 0, null, 'dp1'),
          platform: 'Macintosh',
          platformVersion: new Version(10, 4, 11),
          engine: 'AppleWebKit',
          engineVersion: new Version(528, 4),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });

      it('should detect Safari on iPhone', function () {
        expect(parse('Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_1_2 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7D11 Safari/528.16'))
        .toMatchUserAgent({
          name: 'Safari',
          version: new Version(4, 0),
          platform: 'iPhone',
          platformVersion: new Version(3, 1, 2),
          engine: 'AppleWebKit',
          engineVersion: new Version(528, 18),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });

      it('should detect Safari on iPad', function () {
        expect(parse('Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10'))
        .toMatchUserAgent({
          name: 'Safari',
          version: new Version(4, 0, 4),
          platform: 'iPad',
          platformVersion: new Version(3, 2),
          engine: 'AppleWebKit',
          engineVersion: new Version(531, 21, 10),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });

        expect(parse('Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B360 Safari/531.21.10"'))
        .toMatchUserAgent({
          name: 'Safari',
          version: new Version(4, 0, 4),
          platform: 'iPad',
          platformVersion: new Version(3, 2),
          engine: 'AppleWebKit',
          engineVersion: new Version(531, 21, 10),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });

        expect(parse('Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10'))
        .toMatchUserAgent({
          name: 'Safari',
          version: new Version(4, 0, 4),
          platform: 'iPad',
          platformVersion: new Version(3, 2),
          engine: 'AppleWebKit',
          engineVersion: new Version(531, 21, 10),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });

      it('should detect Safari on iPod', function () {
        expect(parse('Mozilla/5.0 (iPod; U; CPU iPhone OS 2_2_1 like Mac OS X; en-us) AppleWebKit/525.18.1 (KHTML, like Gecko) Mobile/5H11a'))
        .toMatchUserAgent({
          name: 'Unknown',
          version: new Version(),
          platform: 'iPod',
          platformVersion: new Version(2, 2, 1),
          engine: 'AppleWebKit',
          engineVersion: new Version(525, 18, 1),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });

        expect(parse('Mozilla/5.0 (iPod; U; CPU iPhone OS 3_1 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7C144 Safari/528.16'))
        .toMatchUserAgent({
          name: 'Safari',
          version: new Version(4, 0),
          platform: 'iPod',
          platformVersion: new Version(3, 1),
          engine: 'AppleWebKit',
          engineVersion: new Version(528, 18),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });
    });

    describe('Internet Explorer', function () {
      it('should detect Internet Explorer', function () {
        expect(parse('Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'MSIE',
          version: new Version(7, 0),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'MSIE',
          engineVersion: new Version(7, 0),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.1; Media Center PC 3.0; .NET CLR 1.0.3705; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.1)'))
        .toMatchUserAgent({
          name: 'MSIE',
          version: new Version(7, 0, null, 'b'),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'MSIE',
          engineVersion: new Version(7, 0, null, 'b'),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect minimal Internet Explorer', function () {
        expect(parse('Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'))
        .toMatchUserAgent({
          name: 'MSIE',
          version: new Version(7, 0),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'MSIE',
          engineVersion: new Version(7, 0),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Internet Explorer on Windows Phone', function () {
        expect(parse('Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; ARM; Touch; IEMobile/10.0; <Manufacturer>; <Device>; <Operator>)'))
        .toMatchUserAgent({
          name: 'MSIE',
          version: new Version(10, 0),
          platform: 'Windows Phone',
          platformVersion: new Version(8, 0),
          engine: 'MSIE',
          engineVersion: new Version(10, 0),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect unsupported Internet Explorer on Windows Phone', function () {
        expect(parse('Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; SGH-i917)'))
        .toMatchUserAgent({
          name: 'MSIE',
          version: new Version(9, 0),
          platform: 'Windows Phone',
          platformVersion: new Version(7, 5),
          engine: 'MSIE',
          engineVersion: new Version(9, 0),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Internet Explorer on Mac', function () {
        expect(parse('Mozilla/4.0 (compatible; MSIE 5.23; Mac_PowerPC)'))
        .toMatchUserAgent({
          name: 'MSIE',
          version: new Version(5, 23),
          platform: 'Macintosh',
          platformVersion: new Version(),
          engine: 'MSIE',
          engineVersion: new Version(5, 23),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Internet Explorer with Trident version', function () {
        expect(parse('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; InfoPath.2)', { documentMode: 8 }))
        .toMatchUserAgent({
          name: 'MSIE',
          version: new Version(8, 0),
          platform: 'Windows',
          platformVersion: new Version(6, 1),
          engine: 'MSIE',
          engineVersion: new Version(8, 0),
          documentMode: 8,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });
    });

    describe('Builtin Browser', function () {
      it('should detect Android builtin browser', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 2.2.1; en-ca; LG-P505R Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'))
        .toMatchUserAgent({
          name: 'BuiltinBrowser',
          version: new Version(),
          platform: 'Android',
          platformVersion: new Version(2, 2, 1),
          engine: 'AppleWebKit',
          engineVersion: new Version(533, 1),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect unsupported Android builtin browser', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 2.1-update1; en-us; Nexus One Build/ERE27) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17'))
        .toMatchUserAgent({
          name: 'BuiltinBrowser',
          version: new Version(),
          platform: 'Android',
          platformVersion: new Version(2, 1, null, 'update1'),
          engine: 'AppleWebKit',
          engineVersion: new Version(530, 17),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Android builtin browser in Desktop mode (Nexus 7)', function () {
        expect(parse('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(11, 0, 696, 34),
          platform: 'Linux',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(534, 24),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Android builtin browser in Mobile mode (Nexus 7)', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 4.1.2; en-us; sdk Build/MASTER) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'))
        .toMatchUserAgent({
          name: 'BuiltinBrowser',
          version: new Version(),
          platform: 'Android',
          platformVersion: new Version(4, 1, 2),
          engine: 'AppleWebKit',
          engineVersion: new Version(534, 30),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Android builtin browser in Desktop mode (Nexus S)', function () {
        expect(parse('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(11, 0, 696, 34),
          platform: 'Linux',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(534, 24),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Android builtin browser in Mobile mode (Nexus S)', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 4.1.2; en-us; Nexus S Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'))
        .toMatchUserAgent({
          name: 'BuiltinBrowser',
          version: new Version(),
          platform: 'Android',
          platformVersion: new Version(4, 1, 2),
          engine: 'AppleWebKit',
          engineVersion: new Version(534, 30),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect BlackBerry 10 as supporting web fonts', function () {
        expect(parse('Mozilla/5.0 (BB10; Touch) AppleWebKit/537.3+ (KHTML, like Gecko) Version/10.0.9.388 Mobile Safari/537.3+'))
        .toMatchUserAgent({
          name: 'BuiltinBrowser',
          version: new Version(),
          platform: 'BlackBerry',
          platformVersion: new Version(10, 0, 9, 388),
          engine: 'AppleWebKit',
          engineVersion: new Version(537, 3),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect BlackBerry < 10 as not supporting web fonts', function () {
        expect(parse('Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+'))
        .toMatchUserAgent({
          name: 'BuiltinBrowser',
          version: new Version(),
          platform: 'BlackBerry',
          platformVersion: new Version(7, 1, 0, 346),
          engine: 'AppleWebKit',
          engineVersion: new Version(534, 11),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });
    });

    describe('Amazon Silk', function () {
      it('should detect 2nd generation', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; KFOT Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/2.6 Mobile Safari/535.19 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(2, 6),
          platform: 'Android',
          platformVersion: new Version(4, 0, 3),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect 2nd generation (Desktop mode)', function () {
        expect(parse('Mozilla/5.0 (Linux; U; en-us; KFOT Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/2.6 Safari/535.19 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(2, 6),
          platform: 'Linux',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        })
      });

      it('HD 7"', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; KFTT Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/2.6 Mobile Safari/535.19 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(2, 6),
          platform: 'Android',
          platformVersion: new Version(4, 0, 3),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('HD 7" (Desktop mode)', function () {
        expect(parse('Mozilla/5.0 (Linux; U; en-us; KFTT Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/2.6 Safari/535.19 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(2, 6),
          platform: 'Linux',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('HD 8.9" Wi-Fi', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; KFJWI Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/2.6 Mobile Safari/535.19 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(2, 6),
          platform: 'Android',
          platformVersion: new Version(4, 0, 3),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('HD 8.9" Wi-Fi (Desktop mode)', function () {
        expect(parse('Mozilla/5.0 (Linux; U; en-us; KFJWI Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/2.6 Safari/535.19 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(2, 6),
          platform: 'Linux',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('HD 8.9" WAN', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; KFJWA Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/2.6 Mobile Safari/535.19 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(2, 6),
          platform: 'Android',
          platformVersion: new Version(4, 0, 3),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('HD 8.9" WAN (Desktop mode)', function () {
        expect(parse('Mozilla/5.0 (Linux; U; en-us; KFJWA Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/2.6 Safari/535.19 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(2, 6),
          platform: 'Linux',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(535, 19),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('1st generation', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Silk/1.0.22.79_10013310) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(1, 0, 22, '79_10013310'),
          platform: 'Android',
          platformVersion: new Version(2, 3, 4),
          engine: 'AppleWebKit',
          engineVersion: new Version(533, 1),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('1st generation (Desktop mode)', function () {
        expect(parse('Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.0.22.79_10013310) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=false'))
        .toMatchUserAgent({
          name: 'Silk',
          version: new Version(1, 0, 22, '79_10013310'),
          platform: 'Macintosh',
          platformVersion: new Version(10, 6, 3),
          engine: 'AppleWebKit',
          engineVersion: new Version(533, 16),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });
    });

    describe('Opera', function () {
      it('should detect Opera', function () {
        expect(parse('Opera/9.80 (Linux i686; U; en) Presto/2.5.22 Version/10.51'))
        .toMatchUserAgent({
          name: 'Opera',
          version: new Version(10, 51),
          platform: 'Linux',
          platformVersion: new Version(), //'i686'
          engine: 'Presto',
          engineVersion: new Version(2, 5, 22),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Opera with Firefox in useragent', function () {
        expect(parse('Mozilla/5.0 (Linux i686 ; U; en; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 9.70'))
        .toMatchUserAgent({
          name: 'Opera',
          version: new Version(9, 70),
          platform: 'Linux',
          platformVersion: new Version(), //'i686'
          engine: 'Gecko',
          engineVersion: '1.8.1',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Opera before v10', function () {
        expect(parse('Opera/9.64 (X11; Linux i686; U; Linux Mint; nb) Presto/2.1.1'))
        .toMatchUserAgent({
          name: 'Opera',
          version: new Version(9, 64),
          platform: 'Linux',
          platformVersion: new Version(), //'i686'
          engine: 'Presto',
          engineVersion: new Version(2, 1, 1),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Opera Mobile on Android', function () {
        expect(parse('Opera/9.80 (Android 4.1.1; Linux; Opera Mobi/ADR-1207201819; U; en) Presto/2.10.254 Version/12.00'))
        .toMatchUserAgent({
          name: 'Opera',
          version: new Version(12, 0),
          platform: 'Android',
          platformVersion: new Version(4, 1, 1),
          engine: 'Presto',
          engineVersion: new Version(2, 10, 254),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Opera Mini on Android', function () {
        expect(parse('Opera/9.80 (Android; Opera Mini/7.0.29952/28.2144; U; en) Presto/2.8.119 Version/11.10'))
        .toMatchUserAgent({
          name: 'OperaMini',
          version: new Version(7, 0, 29952),
          platform: 'Android',
          platformVersion: 'Unknown',
          engine: 'Presto',
          engineVersion: new Version(2, 8, 119),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });
    });

    describe('WebKit fallback bug', function () {
      it('should detect the bug in older browsers', function () {
        expect(parse('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.9 Safari/536.5'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(19, 0, 1084, 9),
          platform: 'Linux',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(536, 5),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect the bug in older browsers', function () {
        expect(parse('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.814.2 Safari/536.11'))
        .toMatchUserAgent({
          name: 'Chrome',
          version: new Version(20, 0, 814, 2),
          platform: 'Linux',
          platformVersion: new Version(),
          engine: 'AppleWebKit',
          engineVersion: new Version(536, 11),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });
    });

    describe('Invented user agents', function () {
      it('should detect Gecko as supporting web fonts', function () {
        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.9.1.4) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          version: new Version(),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'Gecko',
          engineVersion: new Version(1, 9, 1, 4),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect unknown versions of Gecko as supporting web fonts', function () {
        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:2.5.8) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          version: new Version(),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'Gecko',
          engineVersion: new Version(2, 5, 8),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Gecko v1.10 as supporting web fonts', function () {
        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.10.1b) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          version: new Version(),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'Gecko',
          engineVersion: new Version(1, 10, 1, 'b'),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Gecko with an invalid version number as not supporting web fonts', function () {
        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.b) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          version: new Version(),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'Gecko',
          engineVersion: new Version(1, null, null, 'b'),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.b) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          version: new Version(),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'Gecko',
          engineVersion: new Version(1, null, null, 'b'),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.9) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          version: new Version(),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'Gecko',
          engineVersion: new Version(1, 9),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:0.10.1) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          version: new Version(),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'Gecko',
          engineVersion: new Version(0, 10, 1),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:0.3.42) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          version: new Version(),
          platform: 'Windows',
          platformVersion: new Version(5, 1),
          engine: 'Gecko',
          engineVersion: new Version(0, 3, 42),
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });
    });
  });
});
