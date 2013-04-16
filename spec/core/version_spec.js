describe('Version', function () {
  var Version = webfont.Version;

  describe('parse', function () {
    it('should ignore non versions', function () {
      expect(Version.parse('abcedf')).toEqual(new Version());
      expect(Version.parse('...')).toEqual(new Version());
      expect(Version.parse('Unknown')).toEqual(new Version());
    });

    it('should parse single digit versions', function () {
      expect(Version.parse('0')).toEqual(new Version(0));
      expect(Version.parse('1')).toEqual(new Version(1));
    });

    it('should parse two digit versions', function () {
      expect(Version.parse('1.0')).toEqual(new Version(1, 0));
      expect(Version.parse('12.9')).toEqual(new Version(12, 9));
    });

    it('should parse three digit versions', function () {
      expect(Version.parse('1.2.5')).toEqual(new Version(1, 2, 5));
      expect(Version.parse('10.0.2')).toEqual(new Version(10, 0, 2));
    });

    it('should accept alternate separators', function () {
      expect(Version.parse('10_8_2')).toEqual(new Version(10, 8, 2));
      expect(Version.parse('5-46-2')).toEqual(new Version(5, 46, 2));
    });

    it('should accept build strings', function () {
      expect(Version.parse('1.3.5+alpha')).toEqual(new Version(1, 3, 5, 'alpha'));
      expect(Version.parse('1.3.5-askdsj')).toEqual(new Version(1, 3, 5, 'askdsj'));
    });

    it('should parse real version strings', function () {
      expect(Version.parse('5.0')).toEqual(new Version(5, 0));
      expect(Version.parse('531.9')).toEqual(new Version(531, 9));
      expect(Version.parse('1.9.2.3')).toEqual(new Version(1, 9, 2, 3));
      expect(Version.parse('3.6.3')).toEqual(new Version(3, 6, 3));
      expect(Version.parse('1.9.2a1pre')).toEqual(new Version(1, 9, 2, 'a1pre'));
      expect(Version.parse('3.6a1pre')).toEqual(new Version(3, 6, null, 'a1pre'));
      expect(Version.parse('2.0b1')).toEqual(new Version(2, 0, null, 'b1'));
      expect(Version.parse('5.0.342.9')).toEqual(new Version(5, 0, 342, 9));
      expect(Version.parse('10_5_8')).toEqual(new Version(10, 5, 8));
      expect(Version.parse('18.0.1025.46')).toEqual(new Version(18, 0, 1025, 46));
      expect(Version.parse('i868 1660.57.0')).toEqual(new Version()); // FIXME: ???
      expect(Version.parse('4.0dp1')).toEqual(new Version(4, 0, null, 'dp1'));
      expect(Version.parse('528.4+')).toEqual(new Version(528, 4));
      expect(Version.parse('2.1-update1')).toEqual(new Version(2, 1, null, 'update1'));
      expect(Version.parse('10.0.22.79_1003310')).toEqual(new Version(10, 0, 22, '79_1003310')); // FIXME: ???
      expect(Version.parse('1.b')).toEqual(new Version(1, null, null, 'b'));
      expect(Version.parse('0.10.1')).toEqual(new Version(0, 10, 1));
    });
  });

  describe('#compare', function () {
    it('should return zero when two versions are equal', function () {
      expect(new Version(1, 2, 3).compare(new Version(1, 2, 3))).toEqual(0);
    });

    it('should return one when one version is greater', function () {
      expect(new Version(1, 2, 3).compare(new Version(0, 1, 3))).toEqual(1);
      expect(new Version(1, 2, 3).compare(new Version(1, 2, 2))).toEqual(1);
      expect(new Version(1, 2, 3).compare(new Version(1, 1, 3))).toEqual(1);
    });

    it('should return minus one when one version is smaller', function () {
      expect(new Version(1, 2, 3).compare(new Version(1, 2, 4))).toEqual(-1);
      expect(new Version(1, 2, 3).compare(new Version(1, 3, 3))).toEqual(-1);
      expect(new Version(1, 2, 3).compare(new Version(2, 2, 3))).toEqual(-1);
    });
  });

  describe('#eq', function () {
    it('should return true when two versions are equal', function () {
      expect(new Version(1, 2, 3).eq(new Version(1, 2, 3))).toBe(true);
    });

    it('should return false when two versions are unequal', function () {
      expect(new Version(3, 2, 1).eq(new Version(1, 2, 3))).toBe(false);
    });
  });

  describe('#gt', function () {
    it('should return true when one version is greater than another', function () {
      expect(new Version(3, 2, 1).gt(new Version(1, 2, 3))).toBe(true);
    });

    it('should return false when one version is not greater than another', function () {
      expect(new Version(1, 2, 3).gt(new Version(3, 2, 1))).toBe(false)
    });
  });

  describe('#ge', function () {
    it('should return true when one version is greater than another', function () {
      expect(new Version(3, 2, 1).ge(new Version(1, 2, 3))).toBe(true);
    });

    it('should return false when one version is not greater than another', function () {
      expect(new Version(1, 2, 3).ge(new Version(3, 2, 1))).toBe(false)
    });

    it('should return true when one version is equal to another', function () {
      expect(new Version(1, 2, 3).ge(new Version(1, 2, 3))).toBe(true);
    });
  });

  describe('#lt', function () {
    it('should return true when one version is less than another', function () {
      expect(new Version(1, 2, 3).lt(new Version(3, 2, 1))).toBe(true);
    });

    it('should return false when one version is not less than another', function () {
      expect(new Version(3, 2, 1).lt(new Version(1, 2, 3))).toBe(false)
    });
  });

  describe('#le', function () {
    it('should return true when one version is less than another', function () {
      expect(new Version(1, 2, 3).le(new Version(3, 2, 1))).toBe(true);
    });

    it('should return false when one version is not less than another', function () {
      expect(new Version(3, 2, 1).le(new Version(1, 2, 3))).toBe(false)
    });

    it('should return true when one version is equal to another', function () {
      expect(new Version(1, 2, 3).le(new Version(1, 2, 3))).toBe(true);
    });
  });

  describe('#isValid', function () {
    it('should return true when the version is valid', function () {
      expect(new Version(1).isValid()).toBe(true);
      expect(new Version(1, 2).isValid()).toBe(true);
    });

    it('should return false when the version is not valid', function () {
      expect(new Version().isValid()).toBe(false);
      expect(new Version(null, 1).isValid()).toBe(false);
    });
  });
});
