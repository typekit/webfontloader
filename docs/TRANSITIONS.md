# Transitions

In order to support smooth transitions between webfont providers, WebFont JS
provides a common interface to each provider. It also makes it trivial to load
fonts from multiple providers.

This is especially powerful when building your page against the [events][]
because the same events are triggered regardless of the provider.

Here are a few scenarios.

## From Google Fonts to Typekit

### Step 1: Use Google with WebFont JS

You can get started with web fonts quickly and easily by just using Google.

    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript">
      WebFont.load({
        google: {
          family: ['Droid Sans']
        }
      });
    </script>

### Step 2: Add Typekit

If you discover that Google doesn't have your preferred typeface, you may wish
to add fonts from Typekit.

(first sign up Typekit, adds font and retrieve your Kit ID)

    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript">
      WebFont.load({
        google: {
          family: ['Droid Sans']
        },
        typekit: 'abc1def'
      });
    </script>

### Step 3 Remove Google

You may now discover that the number of HTTP requests has increased by pulling
fonts from both Google and Typekit. Since Typekit has all of the fonts that
Google has, let's drop that dependency.

(first add 'Droid Sans' to your Kit with ID 'abc1def')

    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript">
      WebFont.load({
        typekit: 'abc1def'
      });
    </script>

### Step 4: Remove WebFont JS

You may wish to reduce HTTP requests further by dropping the dependency on the
WebFont API and work directly with Typekit. Typekit's API is fully compatible
with WebFont JS.

    <script type="text/javascript" src="http://use.typekit.com/abc1def.js"></script>
    <script type="text/javascript">
      WebFont.load();
    </script>

Or as pure Typekit

    <script type="text/javascript" src="http://use.typekit.com/abc1def.js"></script>
    <script type="text/javascript">
      Typekit.load();
    </script>


## Add events to self-hosted fonts

### Step 1: Link to your own stylesheet

If you already have fonts and the `@font-face` rules written, you might
already be using them in your page.

    <link type="text/css" rel="stylesheet" href="/fonts.css">

### Step 2: Use WebFont JS

To add [events][] support, use the `default` module to load your stylesheet,
and name the font families that the stylesheet provides.

    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript">
      WebFont.load({
        default: {
         families: ['My Font'],
         urls: ['/fonts.css']
       }
      });
    </script>


[events]: EVENTS.md
