# WebFont Loader

WebFont Loader gives you added control when using linked fonts via `@font-face`. It provides a common interface to loading fonts regardless of the source, then adds a standard set of events you may use to control the loading experience. The WebFont Loader is able to load fonts from [Google Fonts](http://www.google.com/fonts/), [Typekit](http://www.typekit.com/), [Ascender](http://www.ascenderfonts.com/webfonts/), [Fonts.com](http://www.fonts.com/), [Fontdeck](http://fontdeck.com/) and self-hosted. It was co-developed by [Google](http://www.google.com/) and [Typekit](http://www.typekit.com).

## Contents

* [Get started](#get-started)
* [Configuration](#configuration)
    * [Events](#events)
    * [Timeout](#timeout)
    * [Iframes](#iframes)
* [Modules](#modules)
    * [Ascender](#ascender)
    * [Custom](#custom)
    * [Fontdeck](#fontdeck)
    * [Fonts.com](#fonts.com)
    * [Google](#google)
    * [Typekit](#typekit)
* [Browser support](#browser-support)
* [Contributing](#contributing)
* [License](#license)

## Get Started

Link to the WebFont Loader library, then tell it which fonts to load. Here we'll load fonts from [Google Fonts](http://www.google.com/fonts/) using the WebFont Loader hosted on [Google Hosted Libraries](https://developers.google.com/speed/libraries/).

    <script src="//ajax.googleapis.com/ajax/libs/webfont/1.4.2/webfont.js"></script>
    <script>    
      WebFont.load({
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      });
    </script>

Alternatively one can link to the latest version of the WebFont Loader by using `//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js` as the `script` source. Note that this version has a shorter cache time. We recommend using an explicit version and manually updating the WebFont Loader version you use.

It is also possible to use the WebFont Loader asynchronously, for example to load [Typekit](http://www.typekit.com) fonts.

    <script>
      WebFontConfig = {
        typekit: { id: 'xxxxxx' }
      };

      (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1.4.2/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      })();
    </script>

## Configuration

The WebFont Loader configuration is defined by a global variable named `WebFontConfig`, or passed directly to the `WebFont.load` method. It defines which fonts to load from each web font provider and gives you the option to specify callbacks for certain events. When using the asynchronous approach, you must define the global variable `WebFontConfig` before the code that loads the WebFont Loader.

### Events

WebFont Loader provides an event system that developers can hook into. It gives you notifications of the font loading sequence in both CSS and JavaScript.

  * `loading` - This event is triggered when all fonts have been requested.
  * `active` - This event is triggered when all of the fonts have rendered.
  * `inactive` - This event is triggered when the browser does not support linked fonts *or* if none of the fonts could be loaded.
  * `fontloading` - This event is triggered once for each font that's loaded.
  * `fontactive` - This event is triggered once for each font that renders.
  * `fontinactive` - This event is triggered if the font can't be loaded.

CSS events are implemented as classes on the `html` element. The following classes are set on the `html` element:

    .wf-loading
    .wf-active
    .wf-inactive
    .wf-<familyname>-<fvd>-loading
    .wf-<familyname>-<fvd>-active
    .wf-<familyname>-<fvd>-inactive

The `<familyname>` placeholder will be replaced by a sanitized version of the name of each font family. Spaces and underscores are removed from the name, and all characters are converted to lower case. For example, `Droid Sans` becomes `droidsans`. The `<fvd>` placeholder is a [Font Variation Description](https://github.com/typekit/fvd). Put simply, it's a shorthand for describing the style and weight of a particular font. Here are a few examples:

    /* n4 */
    @font-face { font-style: normal; font-weight: normal; }

    /* i7 */
    @font-face { font-style: italic; font-weight: bold; }

If no style/weight is specified, the default `n4` (`font-style: normal; font-weight: normal;`) will be used.

If fonts are loaded multiple times on a single page, the CSS classes continue to update to reflect the current state of the page. The global `wf-loading` class is applied whenever fonts are being requested (even if other fonts are already active or inactive). The `wf-inactive` class is applied only if none of the fonts on the page have rendered. Otherwise, the `wf-active` class is applied instead (even if some fonts are inactive).

JavaScript events are implemented as callback functions on the `WebFontConfig` configuration object.

    WebFontConfig = {
      loading: function() {},
      active: function() {},
      inactive: function() {},
      fontloading: function(familyName, fvd) {},
      fontactive: function(familyName, fvd) {},
      fontinactive: function(familyName, fvd) {}
    };

The `fontloading`, `fontactive` and `fontinactive` callbacks are passed the family name and font variation description of the font that concerns the event. 

### Timeouts

Since the Internet is not 100% reliable, it's possible that a font fails to load. The `fontinactive` event will be triggered after 5 seconds if the font fails to render. If *at least* one font succesfully renders, the `active` event will be triggered, else the `inactive` even will be triggered.

You can change the default timeout by using the `timeout` option on the `WebFontConfig` object.

    WebFontConfig = {
      google: {
        families: ['Droid Sans']
      },
      timeout: 2000 // Set the timeout to two seconds
    };

The timeout value should be in milliseconds, and defaults to 5 seconds if not supplied.

### Iframes

Usually, it's easiest to include a copy of webfontloader in every window where fonts are needed, so that each window manages its own fonts. However, if you need to have a single window manage fonts for multiple same-origin child windows or iframes that are built up using JavaScript, webfontloader supports that as well. Just use the optional `context` configuration option and give it a reference to the target window for loading:

    WebFontConfig = {
      google: {
        families: ['Droid Sans']
      },
      context: frames['my-child']
    };

## Modules

WebFont Loader provides a generic module system so that any web font provider
may be used. The specifics of each provider are documented here.

### Ascender

To load fonts from the FontsLive service use the `ascender` module.

    WebFontConfig = {
      ascender: {
        key: 'myAscenderKey',
        families: [ 'AscenderSans:bold,bolditalic,italic,regular' ]
      }
    };

**NOTE**: The Ascender font service has been acquired by Monotype (Fonts.com) and as such the use of the Fonts.com module is recommended.

### Custom

To load fonts from any external stylesheet, use the `custom` module. Here you'll
need to specify both the url of the stylesheet as well as the font families it
provides.

You can specify a specific font variation or set of variations to load and watch
by appending the variations separated by commas to the family name separated by 
a colon. Variations are specified using [FVD notation](https://github.com/typekit/fvd).

    WebFontConfig = {
      custom: {
        families: ['My Font', 'My Other Font:n4,i4,n7'],
        urls: ['/fonts.css']
      }
    };

### Fontdeck

To use the [Fontdeck](http://fontdeck.com/) module, specify the ID of your website. You can find this ID on the website page within your account settings.

    WebFontConfig = {
      fontdeck: {
        id: 'xxxxx'
      }
    };

### Fonts.com

When using [Fonts.com web fonts](http://webfonts.fonts.com/) specify your Project ID.

    WebFontConfig = {
      monotype: {
        projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        version: 12345 // (optional, flushes the CDN cache)
      }
    };

The Fonts.com module has an optional `version` option which acts as a cache-buster.

### Google

Using [Google's Font API](https://code.google.com/apis/webfonts/docs/getting_started.html), name the font families you'd like to load.

    WebFontConfig = {
      google: {
        families: ['Droid Sans', 'Droid Serif']
      }
    };

You can also supply the `text` parameter to perform character subsetting:

    WebFontConfig = {
      google: {
        families: ['Droid Sans', 'Droid Serif'],
        text: 'abcdedfghijklmopqrstuvwxyz!'
      }
    };

This functionality is only available for the Google module.

### Typekit

When using [Typekit](http://www.typekit.com), specify the Kit to retrieve by its ID. You can find this ID within Typekit's Kit Editor interface.

    WebFontConfig = {
      typekit: {
        id: 'xxxxxx'
      }
    };

## Browser Support

Every web browser has varying levels of support for fonts linked via `@font-face`. Support for web fonts is determined using the browser user agent string. The user agent string may claim to support a web font format when it in fact does not. This is especially noticeable on mobile browsers with a "Desktop" mode, which usually identify as Chrome on Linux. In this case a web font provider may decide to send WOFF fonts to the device because the real desktop Chrome supports it, while the mobile browser does not. The WebFont Loader is not designed to handle these cases and it chooses to believe the user agent string. Web font providers can build on top of the basic WebFont Loader functionality to handle these special cases individually.

If WebFont Loader determines that the current browser does not support `@font-face`, the `inactive` event will be triggered.

When loading fonts from multiple providers, each provider may or may not support a given browser. If WebFont Loader determines that the current browser can support `@font-face`, and *at least* one provider is able to serve fonts, the fonts from that provider will be loaded. When finished, the `active` event will be triggered.

For fonts loaded from supported providers, the `fontactive` event will be triggered. For fonts loaded from a provider that *does not* support the current browser, the `fontinactive` event will be triggered.

For example:

    WebFontConfig = {
      providerA: 'Family1',
      providerB: 'Family2'
    };

If `providerA` can serve fonts to a browser, but `providerB` cannot, The `fontinactive` event will be triggered for `Family2`. The `fontactive` event will be triggered for `Family1` once it loads, as will the `active` event.

## Contributing

Please open [an issue](https://github.com/typekit/webfontloader/issues) if you find or suspect any problems. Sample pages and test cases are greatly appreciated.

### Development requirements

You'll need a few rubygems to run the tests, demo server, and other rake tasks, which should be installed with [Bundler](http://gembundler.com/).

    $ gem install bundler
    $ bundle install

To run the tests in a headless WebKit you will also need to have [PhantomJS](http://www.phantomjs.org) installed. You can install PhantomJS by downloading a binary of using HomeBrew.

    $ brew install phantomjs

### Building

To build a JS file from source, just run rake:

    $ rake

### Demos

A full suite of demo pages is included in this source. Here you can find some
live examples using the JS and CSS events. Run the demo server with:

    $ rake demo

You can also run the demos with uncompressed, debuggable code to aid in
development. Just start the server in dev mode:

    $ rake demodev

Browse the demos [source code](http://github.com/typekit/webfontloader/blob/master/lib/webfontloader/demo/public).

### Testing

WebFont Loader has an extensive test suite that runs via Jasmine. The test suite
should be passing before submitting a pull request, and new tests should be added
for any new functionality.

To run tests, open up `spec/index.html` in a browser and check the results. The
test suite will run automatically. Again, before submitting a pull request
please run the test suite in multiple browsers and list them in the pull request.

To run tests in a headless WebKit using [PhantomJS](http://www.phantomjs.org) run:

    $ rake test

## License

WebFont Loader is released under the [Apache 2.0](http://github.com/typekit/webfontloader/blob/master/LICENSE) license.
