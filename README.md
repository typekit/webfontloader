# WebFont Loader

WebFont Loader gives you added control when using linked fonts via `@font-face`. It provides a common interface to loading fonts regardless of the source, then adds a standard set of events you may use to control the loading experience. The WebFont Loader is able to load fonts from Google Fonts, Typekit, Ascender, Monotype, Fontdeck and self-hosted. It was co-developed by [Google](http://www.google.com/) and [Typekit](http://www.typekit.com).

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
    * [Google](#google)
    * [Monotype](#monotype)
    * [Typekit](#typekit)
* [Browser support](#browser-support)
* [Contributing](#contributing)
* [License](#license)

## Get Started

Link to the WebFont Loader library, then tell it which fonts to load. Here we'll load fonts from [Google Fonts](http://www.google.com/fonts/) using the WebFont Loader hosted on [Google's AJAX Libraries](https://developers.google.com/speed/libraries/).

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
      WebFont.load({
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      });
    </script>

Alternatively, load fonts from [Typekit](http://www.typekit.com). Just specify your Kit ID.

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
      WebFont.load({
        typekit: {
          id: 'xxxxxx'
        }
      });
    </script>


## Configuration

The WebFont Loader configuration defines which fonts to load from each web font provider and can specify callbacks that will be called when certain events fire.

The WebFont Loader configuration is defined by a global variable named WebFontConfig when loading the script asynchronously, or passed directly to the `WebFont.load` method. When using the asynchronous approach, you must define the global variable `WebFontConfig` before the code that loads the WebFont Loader.

### Events

WebFont Loader provides an event system that developers can hook into. It gives you notifications of the font loading sequence in both CSS and JavaScript.

  * `loading` - This event is triggered when all fonts have been requested.
  * `active` - This event is triggered when all of the fonts have rendered.
  * `inactive` - This event is triggered when the browser does not support linked fonts *or* if none of the fonts could be loaded.
  * `fontloading` - This event is triggered once for each font that's loaded.
  * `fontactive` - This event is triggered once for each font that renders.
  * `fontinactive` - This event is triggered if the font can't be loaded.

CSS events are implemented as classes on the `html` element. The following classes can be set on the `html` element:

    .wf-loading
    .wf-active
    .wf-inactive
    .wf-familyname-fvd-loading
    .wf-familyname-fvd-active
    .wf-familyname-fvd-inactive

`familyname` is a sanitized version of the name of each font family. Spaces and underscores are removed from the name, and all characters are converted to lower case. For example, `Droid Sans` becomes `droidsans`. `fvd` is a *[Font Variation Description](https://github.com/typekit/fvd)*. Put simply, it's a shorthand for describing the style and weight of a particular font. Here are a few examples:

    @font-face {
      font-style: normal;
      font-weight: normal;
    }
    => n4

    @font-face {
      font-style: italic;
      font-weight: bold;
    }
    => i7

If no style/weight is specified, the default "n4" (font-style: normal; font-weight: normal;) will be used.

If fonts are loaded multiple times on a single page, the CSS classes continue to update to reflect the current state of the page. The global `wf-loading` class is applied whenever fonts are being requested (even if other fonts are already active or inactive). The `wf-inactive` class is applied only if none of the fonts on the page have rendered. Otherwise, the `wf-active` class is applied instead (even if some fonts are inactive).

JavaScript events are implemented as callback functions on the `WebFont.load` function.

    WebFont.load({
      loading: function() {
      },
      active: function() {
      },
      inactive: function() {
      },
      fontloading: function(familyName, fvd) {
      },
      fontactive: function(familyName, fvd) {
      },
      fontinactive: function(familyName, fvd) {
      }
    })

### Timeouts

Since the Internet is not 100% reliable, it's possible that a font fails to load. The `fontinactive` event will be triggered after 5 seconds if the font fails to render. If *at least* one font succesfully renders, the `active` event will be triggered, else the `inactive` even will be triggered.

You can change the default timeout by using the `timeout` configuration on the `WebFont.load` function.

    WebFont.load({
      google: {
        families: ['Droid Sans']
      },
      timeout: 2000 // Set the timeout to two seconds
    });

The timeout value should be in milliseconds, and defaults to 5 seconds if not supplied.

### Iframes

Usually, it's easiest to include a copy of webfontloader in every window where fonts are needed, so that each window manages its own fonts. However, if you need to have a single window manage fonts for multiple same-origin child windows or iframes that are built up using JavaScript, webfontloader supports that as well. Just use the optional `context` configuration option and give it a reference to the target window for loading:

    WebFont.load({
      google: {
        families: ['Droid Sans']
      },
      context: frames['my-child']
    });

## Browser Support

Every web browser has varying levels of support for fonts linked via `@font-face`. Support for web fonts is determined using the browser user agent string. The user agent string may claim to support a web font format when it in fact does not. This is especially noticable on mobile browsers with a "Desktop" mode, which usually identify as Chrome on Linux. In this case a web font provider may decide to send WOFF fonts to the device because the real desktop Chrome supports it, while the mobile browser does not. The WebFont Loader is not designed to handle these cases and it chooses to believe the user agent string. Web font providers can build on top of the basic WebFont Loader functionality to handle these special cases individually.

If WebFont Loader determines that the current browser does not support `@font-face`, the `inactive` event will be triggered.

When loading fonts from multiple providers, each provider may or may not support a given browser. If WebFont Loader determines that the current browser can support `@font-face`, and *at least* one provider is able to serve fonts, the fonts from that provide will be loaded. When finished, the `active` event will be triggered.

For fonts loaded from supported providers, the `fontactive` event will be triggered. For fonts loaded from a provider that *does not* support the current browser, the `fontinactive` event will be triggered.

For example:

    WebFont.load({
      providerA: 'Family1',
      providerB: 'Family2'
    });

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
