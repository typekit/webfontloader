describe('modules.google.FontApiUrlBuilder', function () {
  var FontApiUrlBuilder = webfont.modules.google.FontApiUrlBuilder;

  it('should throw an exception if there are no font families', function () {
    var builder = new FontApiUrlBuilder('https://moo');
    expect(builder.build).toThrow();
  });

  it('should build a proper url', function () {
    var builder = new FontApiUrlBuilder('https://moo');
    builder.setFontFamilies(['Font1', 'Font2']);
    expect(builder.build()).toEqual('https://moo?family=Font1%7CFont2');
  });

  it('should build a proper url', function () {
    var builder = new FontApiUrlBuilder(undefined);
    builder.setFontFamilies(['Font1', 'Font2']);
    expect(builder.build()).toEqual(
      FontApiUrlBuilder.DEFAULT_API_URL +
      '?family=Font1%7CFont2');
  });

  it('should build a proper url', function () {
    var builder = new FontApiUrlBuilder(undefined);
    builder.setFontFamilies(['Font1:bold:greek,cyrillic', 'Font2:italic', 'Font3']);
    expect(builder.build()).toEqual(
      FontApiUrlBuilder.DEFAULT_API_URL +
      '?family=Font1:bold%7CFont2:italic%7CFont3' +
      '&subset=greek,cyrillic');
  });

  it('should build a proper url', function () {
    var builder = new FontApiUrlBuilder(undefined);
    builder.setFontFamilies(['Font1:bold,italic:greek,cyrillic', 'Font2:italic', 'Font3::latin']);
    expect(builder.build()).toEqual(
      FontApiUrlBuilder.DEFAULT_API_URL +
      '?family=Font1:bold,italic%7CFont2:italic%7CFont3' +
      '&subset=greek,cyrillic,latin');
  });
});
