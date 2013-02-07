describe('Size', function () {
  var Size = webfont.Size;

  it('should return true on identical sizes', function () {
    expect(new Size(10, 10).equals(new Size(10, 10))).toBe(true);
  });

  it('should return false when two sizes are different', function () {
    expect(new Size(10, 10).equals(new Size(20, 20))).toBe(false);
    expect(new Size(10, 10).equals(new Size(10, 20))).toBe(false);
  });

  it('should return false when one font is undefined or null', function () {
    expect(new Size(10, 10).equals(undefined)).toBe(false);
    expect(new Size(10, 10).equals(null)).toBe(false);
  });
});
