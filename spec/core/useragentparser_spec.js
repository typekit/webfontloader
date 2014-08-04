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

        if (actual.getParsedVersion().ne(expected.parsedVersion)) {
          this.message = msg('parsed version', actual.getParsedVersion(), expected.parsedVersion);
          return false;
        }

        if (actual.getVersion() !== expected.version) {
          this.message = msg('version', actual.getVersion(), expected.version);
          return false;
        }

        if (actual.getPlatform() !== expected.platform) {
          this.message = msg('platform', actual.getPlatform(), expected.platform);
          return false;
        }

        if (actual.getParsedPlatformVersion().ne(expected.parsedPlatformVersion)) {
          this.message = msg('platform parsed version', actual.getParsedPlatformVersion(), expected.parsedPlatformVersion);
          return false;
        }

        if (actual.getPlatformVersion() !== expected.platformVersion) {
          this.message = msg('platform version', actual.getPlatformVersion(), expected.platformVersion);
          return false;
        }

        if (actual.getEngine() !== expected.engine) {
          this.message = msg('engine', actual.getEngine(), expected.engine);
          return false;
        }

        if (actual.getParsedEngineVersion().ne(expected.parsedEngineVersion)) {
          this.message = msg('engine parsed version', actual.getParsedEngineVersion(), expected.parsedEngineVersion);
          return false;
        }

        if (actual.getEngineVersion() !== expected.engineVersion) {
          this.message = msg('engine version', actual.getEngineVersion(), expected.engineVersion);
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

    it('should parse Linux parsedVersions correctly', function () {
      expect(parsePlatformVersion('(Linux; U; en-us; KFJWI Build/IML74K)')).toEqual('Unknown');
      expect(parsePlatformVersion('(Linux i686; U; en)')).toEqual('Unknown');
      expect(parsePlatformVersion('(X11; Linux i686; U; Linux Mint; nb)')).toEqual('Unknown');
      expect(parsePlatformVersion('(X11; Linux x86_64)')).toEqual('Unknown');
      expect(parsePlatformVersion('(X11; U; en-US; rv:2.0; Linux i686 10.1)')).toEqual('10.1');
      expect(parsePlatformVersion('(X11; Linux i868 10.1; U; en-US; rv:2.0)')).toEqual('10.1');
      expect(parsePlatformVersion('(X11; Linux 10.1; U; en-US)')).toEqual('10.1');
    });

    it('should parse ChromeOS parsedVersions correctly', function () {
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
          parsedVersion: new Version(2, 5),
          version: '2.5',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(531, 9),
          engineVersion: '531.9',
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
          parsedVersion: new Version(2, 0),
          version: '2.0',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(531, 9),
          engineVersion: '531.9',
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
          parsedVersion: new Version(3, 6, 3),
          version: '3.6.3',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(10, 5),
          platformVersion: '10.5',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, 9, 2, 3),
          engineVersion: '1.9.2.3',
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
          parsedVersion: new Version(3, 6, null, 'a1pre'),
          version: '3.6a1pre',
          platform: 'Linux',
          parsedPlatformVersion: new Version(), //'i686'
          platformVersion: 'Unknown',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, 9, 2, 'a1pre'),
          engineVersion: '1.9.2a1pre',
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
          parsedVersion: new Version(4, 0, null, 'b1'),
          version: '4.0b1',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(10, 6),
          platformVersion: '10.6',
          engine: 'Gecko',
          parsedEngineVersion: new Version(2, 0, 'b1'),
          engineVersion: '2.0b1',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Firefox on Android', function () {
        // This useragent has been slightly doctored with parsedVersions to ensure the right
        // info is coming from the right places.
        expect(parse('Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/15.0 Firefox/14.0'))
        .toMatchUserAgent({
          name: 'Firefox',
          parsedVersion: new Version(14, 0),
          version: '14.0',
          platform: 'Android',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'Gecko',
          parsedEngineVersion: new Version(13, 0),
          engineVersion: '13.0',
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
          parsedVersion: new Version(),
          version: '',
          platform: 'Linux',
          parsedPlatformVersion: new Version(), //'i686'
          platformVersion: 'Unknown',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, 8, 1, 19),
          engineVersion: '1.8.1.19',
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
          parsedVersion: new Version(5, 0, 342, 9),
          version: '5.0.342.9',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(10, 5, 8),
          platformVersion: '10_5_8',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(533, 2),
          engineVersion: '533.2',
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
          parsedVersion: new Version(18, 0, 1025, 46),
          version: '18.0.1025.46',
          platform: 'CrOS',
          parsedPlatformVersion: new Version(1660, 57, 0),
          platformVersion: '1660.57.0',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Chrome on CromeCast', function () {
        expect(parse('Mozilla/5.0 (CrKey armv71 1.6.16664) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36'))
        .toMatchUserAgent({
          name: 'Chrome',
          parsedVersion: new Version(31, 0, 1650, 0),
          version: '31.0.1650.0',
          platform: 'CrKey',
          parsedPlatformVersion: new Version(1, 6, 16664),
          platformVersion: '1.6.16664',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(537, 36),
          engineVersion: '537.36',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Chrome on Android', function () {
        expect(parse('Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; Nexus S Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7'))
        .toMatchUserAgent({
          name: 'Chrome',
          parsedVersion: new Version(16, 0, 912, 75),
          version: '16.0.912.75',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 0, 3),
          platformVersion: '4.0.3',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 7),
          engineVersion: '535.7',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/5.0 (Linux; Android 4.2.2; SGH-M919 Build/JDQ39) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.169 Mobile Safari/537.22'))
        .toMatchUserAgent({
          name: 'Chrome',
          parsedVersion: new Version(25, 0, 1364, 169),
          version: '25.0.1364.169',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 2, 2),
          platformVersion: '4.2.2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(537, 22),
          engineVersion: '537.22',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Chrome on iPad', function () {
        expect(parse('Mozilla/5.0 (iPad; U; CPU OS 5_1_1 like Mac OS X; en-us) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3'))
        .toMatchUserAgent({
          name: 'Chrome',
          parsedVersion: new Version(19, 0, 1084, 60),
          version: '19.0.1084.60',
          platform: 'iPad',
          parsedPlatformVersion: new Version(5, 1, 1),
          platformVersion: '5_1_1',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(534, 46, 0),
          engineVersion: '534.46.0',
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
          parsedVersion: new Version(19, 0, 1084, 60),
          version: '19.0.1084.60',
          platform: 'iPod',
          parsedPlatformVersion: new Version(5, 1, 1),
          platformVersion: '5_1_1',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(534, 46, 0),
          engineVersion: '534.46.0',
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
          parsedVersion: new Version(4, 0, 4),
          version: '4.0.4',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(10, 5, 8),
          platformVersion: '10_5_8',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(531, 21, 8),
          engineVersion: '531.21.8',
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
          parsedVersion: new Version(4, 0, null, 'dp1'),
          version: '4.0dp1',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(10, 4, 11),
          platformVersion: '10_4_11',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(528, 4),
          engineVersion: '528.4+',
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
          parsedVersion: new Version(4, 0),
          version: '4.0',
          platform: 'iPhone',
          parsedPlatformVersion: new Version(3, 1, 2),
          platformVersion: '3_1_2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(528, 18),
          engineVersion: '528.18',
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
          parsedVersion: new Version(4, 0, 4),
          version: '4.0.4',
          platform: 'iPad',
          parsedPlatformVersion: new Version(3, 2),
          platformVersion: '3_2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(531, 21, 10),
          engineVersion: '531.21.10',
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
          parsedVersion: new Version(4, 0, 4),
          version: '4.0.4',
          platform: 'iPad',
          parsedPlatformVersion: new Version(3, 2),
          platformVersion: '3_2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(531, 21, 10),
          engineVersion: '531.21.10',
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
          parsedVersion: new Version(4, 0, 4),
          version: '4.0.4',
          platform: 'iPad',
          parsedPlatformVersion: new Version(3, 2),
          platformVersion: '3_2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(531, 21, 10),
          engineVersion: '531.21.10',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'iPod',
          parsedPlatformVersion: new Version(2, 2, 1),
          platformVersion: '2_2_1',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(525, 18, 1),
          engineVersion: '525.18.1',
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
          parsedVersion: new Version(4, 0),
          version: '4.0',
          platform: 'iPod',
          parsedPlatformVersion: new Version(3, 1),
          platformVersion: '3_1',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(528, 18),
          engineVersion: '528.18',
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
          parsedVersion: new Version(7, 0),
          version: '7.0',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Unknown',
          parsedEngineVersion: new Version(),
          engineVersion: 'Unknown',
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
          parsedVersion: new Version(7, 0, null, 'b'),
          version: '7.0b',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Unknown',
          parsedEngineVersion: new Version(),
          engineVersion: 'Unknown',
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
          parsedVersion: new Version(7, 0),
          version: '7.0',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Unknown',
          parsedEngineVersion: new Version(),
          engineVersion: 'Unknown',
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
          parsedVersion: new Version(10, 0),
          version: '10.0',
          platform: 'Windows Phone',
          parsedPlatformVersion: new Version(8, 0),
          platformVersion: '8.0',
          engine: 'Trident',
          parsedEngineVersion: new Version(6, 0),
          engineVersion: '6.0',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; id404) like Gecko'))
        .toMatchUserAgent({
          name: 'MSIE',
          parsedVersion: new Version(11, 0),
          version: '11.0',
          platform: 'Windows Phone',
          parsedPlatformVersion: new Version(8, 1),
          platformVersion: '8.1',
          engine: 'Trident',
          parsedEngineVersion: new Version(7, 0),
          engineVersion: '7.0',
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
          parsedVersion: new Version(9, 0),
          version: '9.0',
          platform: 'Windows Phone',
          parsedPlatformVersion: new Version(7, 5),
          platformVersion: '7.5',
          engine: 'Trident',
          parsedEngineVersion: new Version(5, 0),
          engineVersion: '5.0',
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
          parsedVersion: new Version(5, 23),
          version: '5.23',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'Unknown',
          parsedEngineVersion: new Version(),
          engineVersion: 'Unknown',
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
          parsedVersion: new Version(8, 0),
          version: '8.0',
          platform: 'Windows',
          parsedPlatformVersion: new Version(6, 1),
          platformVersion: '6.1',
          engine: 'Trident',
          parsedEngineVersion: new Version(4, 0),
          engineVersion: '4.0',
          documentMode: 8,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Internet Explorer 11', function () {
        expect(parse('Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko', { documentMode: 11 }))
        .toMatchUserAgent({
          name: 'MSIE',
          parsedVersion: new Version(11, 0),
          version: '11.0',
          platform: 'Windows',
          parsedPlatformVersion: new Version(6, 3),
          platformVersion: '6.3',
          engine: 'Trident',
          parsedEngineVersion: new Version(7, 0),
          engineVersion: '7.0',
          documentMode: 11,
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Android',
          parsedPlatformVersion: new Version(2, 2, 1),
          platformVersion: '2.2.1',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(533, 1),
          engineVersion: '533.1',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Android',
          parsedPlatformVersion: new Version(2, 1, null, 'update1'),
          platformVersion: '2.1-update1',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(530, 17),
          engineVersion: '530.17',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Samsung Galaxy S4 builtin browser', function () {
        expect(parse('Mozilla/5.0 (Linux; Android 4.2.2; sl-si; SAMSUNG GT-I9505 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19'))
        .toMatchUserAgent({
          name: 'Chrome',
          parsedVersion: new Version(18, 0, 1025, 308),
          version: '18.0.1025.308',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 2, 2),
          platformVersion: '4.2.2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });

        expect(parse('Mozilla/5.0 (Linux; Android 4.2.2; en-us; SAMSUNG SGH-M919 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19'))
        .toMatchUserAgent({
          name: 'Chrome',
          parsedVersion: new Version(18, 0, 1025, 308),
          version: '18.0.1025.308',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 2, 2),
          platformVersion: '4.2.2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Android builtin browser in Desktop mode (Nexus 7)', function () {
        expect(parse('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24'))
        .toMatchUserAgent({
          name: 'Chrome',
          parsedVersion: new Version(11, 0, 696, 34),
          version: '11.0.696.34',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(534, 24),
          engineVersion: '534.24',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 1, 2),
          platformVersion: '4.1.2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(534, 30),
          engineVersion: '534.30',
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
          parsedVersion: new Version(11, 0, 696, 34),
          version: '11.0.696.34',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(534, 24),
          engineVersion: '534.24',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 1, 2),
          platformVersion: '4.1.2',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(534, 30),
          engineVersion: '534.30',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'BlackBerry',
          parsedPlatformVersion: new Version(10, 0, 9, 388),
          platformVersion: '10.0.9.388',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(537, 3),
          engineVersion: '537.3+',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'BlackBerry',
          parsedPlatformVersion: new Version(7, 1, 0, 346),
          platformVersion: '7.1.0.346',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(534, 11),
          engineVersion: '534.11+',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect the PS4 browser', function () {
        expect(parse('Mozilla/5.0 (PlayStation 4 1.70) AppleWebKit/536.26 (KHTML, like Gecko)'))
        .toMatchUserAgent({
          name: 'BuiltinBrowser',
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(536, 26),
          engineVersion: '536.26',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
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
          parsedVersion: new Version(2, 6),
          version: '2.6',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 0, 3),
          platformVersion: '4.0.3',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
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
          parsedVersion: new Version(2, 6),
          version: '2.6',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
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
          parsedVersion: new Version(2, 6),
          version: '2.6',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 0, 3),
          platformVersion: '4.0.3',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
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
          parsedVersion: new Version(2, 6),
          version: '2.6',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
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
          parsedVersion: new Version(2, 6),
          version: '2.6',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 0, 3),
          platformVersion: '4.0.3',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
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
          parsedVersion: new Version(2, 6),
          version: '2.6',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
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
          parsedVersion: new Version(2, 6),
          version: '2.6',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 0, 3),
          platformVersion: '4.0.3',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
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
          parsedVersion: new Version(2, 6),
          version: '2.6',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(535, 19),
          engineVersion: '535.19',
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
          parsedVersion: new Version(1, 0, 22, '79_10013310'),
          version: '1.0.22.79_10013310',
          platform: 'Android',
          parsedPlatformVersion: new Version(2, 3, 4),
          platformVersion: '2.3.4',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(533, 1),
          engineVersion: '533.1',
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
          parsedVersion: new Version(1, 0, 22, '79_10013310'),
          version: '1.0.22.79_10013310',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(10, 6, 3),
          platformVersion: '10_6_3',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(533, 16),
          engineVersion: '533.16',
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
          parsedVersion: new Version(10, 51),
          version: '10.51',
          platform: 'Linux',
          parsedPlatformVersion: new Version(), //'i686'
          platformVersion: 'Unknown',
          engine: 'Presto',
          parsedEngineVersion: new Version(2, 5, 22),
          engineVersion: '2.5.22',
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
          parsedVersion: new Version(9, 70),
          version: '9.70',
          platform: 'Linux',
          parsedPlatformVersion: new Version(), //'i686'
          platformVersion: 'Unknown',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, 8, 1),
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
          parsedVersion: new Version(9, 64),
          version: '9.64',
          platform: 'Linux',
          parsedPlatformVersion: new Version(), //'i686'
          platformVersion: 'Unknown',
          engine: 'Presto',
          parsedEngineVersion: new Version(2, 1, 1),
          engineVersion: '2.1.1',
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
          parsedVersion: new Version(12, 0),
          version: '12.00',
          platform: 'Android',
          parsedPlatformVersion: new Version(4, 1, 1),
          platformVersion: '4.1.1',
          engine: 'Presto',
          parsedEngineVersion: new Version(2, 10, 254),
          engineVersion: '2.10.254',
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
          parsedVersion: new Version(7, 0, 29952),
          version: '7.0.29952',
          platform: 'Android',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'Presto',
          parsedEngineVersion: new Version(2, 8, 119),
          engineVersion: '2.8.119',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Opera Next (15)', function () {
        expect(parse('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.20 Safari/537.36  OPR/15.0.1147.18 (Edition Next)'))
        .toMatchUserAgent({
          name: 'Opera',
          parsedVersion: new Version(15, 0, 1147, 18),
          version: '15.0.1147.18',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(10, 8, 3),
          platformVersion: '10_8_3',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(537, 36),
          engineVersion: '537.36',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: true
          }
        });
      });
    });

    describe('WebKit fallback bug', function () {
      it('should detect the bug in older browsers', function () {
        expect(parse('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.9 Safari/536.5'))
        .toMatchUserAgent({
          name: 'Chrome',
          parsedVersion: new Version(19, 0, 1084, 9),
          version: '19.0.1084.9',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(536, 5),
          engineVersion: '536.5',
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
          parsedVersion: new Version(20, 0, 814, 2),
          version: '20.0.814.2',
          platform: 'Linux',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(536, 11),
          engineVersion: '536.11',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, 9, 1, 4),
          engineVersion: '1.9.1.4',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect unknown parsedVersions of Gecko as supporting web fonts', function () {
        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:2.5.8) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Gecko',
          parsedEngineVersion: new Version(2, 5, 8),
          engineVersion: '2.5.8',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, 10, 1, 'b'),
          engineVersion: '1.10.1b',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });

      it('should detect Gecko with an invalid parsedVersion number as not supporting web fonts', function () {
        expect(parse('Mozilla/5.0 (Windows; U; Windows NT 5.1; ru-RU; rv:1.b) Gecko/20091016 (.NET CLR 3.5.30729)'))
        .toMatchUserAgent({
          name: 'Mozilla',
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, null, null, 'b'),
          engineVersion: '1.b',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, null, null, 'b'),
          engineVersion: '1.b',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Gecko',
          parsedEngineVersion: new Version(1, 9),
          engineVersion: '1.9',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Gecko',
          parsedEngineVersion: new Version(0, 10, 1),
          engineVersion: '0.10.1',
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
          parsedVersion: new Version(),
          version: 'Unknown',
          platform: 'Windows',
          parsedPlatformVersion: new Version(5, 1),
          platformVersion: '5.1',
          engine: 'Gecko',
          parsedEngineVersion: new Version(0, 3, 42),
          engineVersion: '0.3.42',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: false,
            hasWebKitFallbackBug: false,
            hasWebKitMetricsBug: false
          }
        });
      });
    });

    describe('PhantomJS', function () {
      it('should detect PhantomJS as having web font support', function () {
        expect(parse('Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.0 (development) Safari/534.34'))
        .toMatchUserAgent({
          name: 'PhantomJS',
          parsedVersion: new Version(1, 9, 0),
          version: '1.9.0',
          platform: 'Macintosh',
          parsedPlatformVersion: new Version(),
          platformVersion: 'Unknown',
          engine: 'AppleWebKit',
          parsedEngineVersion: new Version(534, 34),
          engineVersion: '534.34',
          documentMode: undefined,
          browserInfo: {
            hasWebFontSupport: true,
            hasWebKitFallbackBug: true,
            hasWebKitMetricsBug: true
          }
        });
      });
    });
  });
});
