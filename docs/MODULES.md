# Modules

WebFont Loader provides a generic module system so that any web font provider
may be used. The specifics of each provider are documented here.


## Google

Using Google's Font API, name the font families you'd like to load.

    WebFont.load({
      google: {
        families: ['Droid Sans', 'Droid Serif']
      }
    });

Learn more about the [Google Font API][gfontapi].


## Typekit

When using Typekit, specify the Kit to retrieve by its ID. You can find this
ID within Typekit's Kit Editor interface.

    WebFont.load({
      typekit: {
        id: 'xxxxxx'
      }
    });

Learn more about [Typekit][tk].

## Fontdeck

To use Fontdeck, specify the ID of your website. You can find this ID on the
website page within your account settings.

    WebFont.load({
      fontdeck: {
        id: 'xxxxx'
      }
    });

Learn more about [Fontdeck][fd].

## Fonts.com web fonts

When using [Fonts.com web fonts][mtiwfs]

(First sign up for [Fonts.com web fonts][mtiwfs]. Create a project, choose fonts to add into the created project and retrieve your Project ID. You can find this Project ID in the "Publish" tab).

<script type="text/javascript" src="http://www.google.com/jsapi"></script>
<script type="text/javascript">
  WebFont.load({
    monotype: {
      projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
  });
</script>
Or as pure Fonts.com Web fonts API

<script type="text/javascript" src="http://fast.fonts.com/jsapi/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.js"></script>

## Custom

To load fonts from any external stylesheet, use the `custom` module. Here you'll
need to specify both the url of the stylesheet as well as the font families it
provides.

    WebFont.load({
      custom: {
        families: ['My Font', 'My Other Font'],
        urls: ['/fonts.css']
      }
    });


[gfontapi]: https://code.google.com/apis/webfonts/docs/getting_started.html
[tk]: http://typekit.com/
[fd]: http://fontdeck.com/
[mtiwfs]: http://webfonts.fonts.com/
