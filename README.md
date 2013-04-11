# WebFont Loader

WebFont Loader gives you added control when using linked fonts via
`@font-face`. It provides a common interface to loading fonts regardless of
the source, then adds a standard set of events you may use to control the
loading experience.

## Get Started

(These samples use WebFont Loader hosted on [Google's AJAX Libraries][gajax].)

Link to the WebFont Loader library, then tell it which fonts to load. Here we'll
load fonts from [Google's Font API][gfontapi].

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
      WebFont.load({
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      });
    </script>

Alternatively, load fonts from Typekit. Just specify your Kit ID.

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
      WebFont.load({
        typekit: {
          id: 'xxxxxx'
        }
      });
    </script>

Learn more about the
[modules][mod].

## Do More

WebFont Loader gives you control over how fonts are loaded. If you're
frustrated by the "flash of unstyled text" typically seen in FireFox, try
this.

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
      WebFont.load({
        google: {
          families: ['Droid Sans']
        }
      });
    </script>
    <style>
      h1 {
        font-family: 'Droid Sans';
        visibility: hidden;
      }
      .wf-active h1 {
        visibility: visible;
      }
    </style>

    <body>
      <h1>This headline will be hidden until Droid Sans is completely loaded.</h1>
    </body>

Learn more about [events][evt].

## Manage loading everywhere

Usually, it's easiest to include a copy of webfontloader in every window where
fonts are needed, so that each window manages its own fonts. However, if you
need to have a single window manage fonts for multiple same-origin child windows
or iframes that are built up using JavaScript, webfontloader supports that as
well. Just use the optional `context` configuration option and give it a
reference to the target window for loading:

    <script>
      WebFont.load({
        google: {
          families: ['Droid Sans']
        },
        context: frames['my-child']
      });
    </script>

## A common ground

WebFont Loader aims to provide a common interface for font loading. Today it
works with Google, Typekit, Ascender, Fontdeck, Fonts.com Web fonts and your own
CSS. Learn more in [transitions][trn].

## Problems?

Please open [an issue][issues]. Sample pages are greatly appreciated.

## Developing

Is there something else WebFont Loader should do? Did you find a bug and want
to fix it?

### Installing development requirements

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

Browse the demos [source code][demos].

### Testing

WebFont Loader has an extensive test suite that runs via Jasmine. The test suite
should be passing before submitting a pull request, and new tests should be added
for any new functionality.

To run tests, open up `spec/index.html` in a browser and check the results. The
test suite will run automatically. Again, before submitting a pull request
please run the test suite in multiple browsers and list them in the pull request.

To run tests in a headless WebKit using [PhantomJS](http://www.phantomjs.org) run:

    $ rake test

## Contributing

* Fork webfontloader
* Create a topic branch - `git checkout -b my_branch`
* Push to your branch - `git push origin my_branch`
* Make sure all tests are passing
* Create a pull request for your branch
* That's it!


## Authors

* Ryan Carver / ryan@typekit.com
* Jeremie Lenfant-engelmann /  jeremiele@google.com
* Sean McBride / sean@typekit.com
* Bram Stein / bram@typekit.com


## License

WebFont Loader is released under the [Apache 2.0][lic] license.


[mod]: http://github.com/typekit/webfontloader/blob/master/docs/MODULES.md
[trn]: http://github.com/typekit/webfontloader/blob/master/docs/TRANSITIONS.md
[evt]: http://github.com/typekit/webfontloader/blob/master/docs/EVENTS.md
[lic]: http://github.com/typekit/webfontloader/blob/master/LICENSE
[demos]: http://github.com/typekit/webfontloader/blob/master/lib/webfontloader/demo/public
[gfontapi]: https://developers.google.com/fonts/
[gajax]: https://developers.google.com/speed/libraries/
[issues]: https://github.com/typekit/webfontloader/issues
