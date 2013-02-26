# Events

WebFont Loader provides an event system that developers can hook into. It
gives you notifications of the font loading sequence in both CSS and
JavaScript.

## The Events

  * `Loading` - This event is triggered when all fonts have been requested.
  * `Active` - This event is triggered when all of the fonts have rendered.
  * `Inactive` - This event is triggered when the browser does not support
      linked fonts *or* if none of the fonts could be loaded.
  * `Font Loading` - This event is triggered once for each font that's loaded.
  * `Font Active` - This event is triggered once for each font that renders.
  * `Font Inactive` - This event is triggered if the font can't be loaded.

### CSS Flavored

CSS events are implemented as classes on the `html` element.

    html.wf-loading
    html.wf-active
    html.wf-inactive
    html.wf-familyname-fvd-loading
    html.wf-familyname-fvd-active
    html.wf-familyname-fvd-inactive

`familyname` is a sanitized version of the name of each font family. Spaces
and underscores are removed from the name, and all characters are converted to
lower case. For example, `Droid Sans` becomes `droidsans`.

`fvd` is a *Font Variation Description*. Put simply, it's a shorthand for
describing the style and weight of a particular font. Here are a few examples:

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

If no style/weight is specified, the default "n4" (font-style: normal;
font-weight: normal;) will be used.

If fonts are loaded multiple times on a single page, the CSS classes continue
to update to reflect the current state of the page. The global `wf-loading`
class is applied whenever fonts are being requested (even if other fonts are
already active or inactive). The `wf-inactive` class is applied only if none of
the fonts on the page have rendered. Otherwise, the `wf-active` class is applied
instead (even if some fonts are inactive).

Here's an example of CSS classes over multiple loads:

  * Droid Sans n4 is requested
    * The `html` element has `wf-loading wf-droidsans-n4-loading`
  * Droid Sans n4 is detected as active
    * The `html` element has `wf-active wf-droidsans-n4-active`
  * Droid Sans n7 is subsequently requested
    * The `html` element has `wf-active wf-loading wf-droidsans-n4-active
        wf-droidsans-n7-loading`
  * Droid Sans n7 is detected as active
    * The `html` element has `wf-active wf-droidsans-n4-active
        wf-droidsans-n7-active`

Here's another example of CSS classes over multiple loads when one of the
requested fonts is inactive:

  * Droid Sans n9 is requested (which doesn't exist)
    * The `html` element has `wf-loading wf-droidsans-n9-loading`
  * Droid Sans n9 is detected as inactive
    * The `html` element has `wf-inactive wf-droidsans-n9-inactive`
  * Droid Sans n4 is subsequently requested
    * The `html` element has `wf-inactive wf-loading wf-droidsans-n9-inactive
        wf-droidsans-n4-loading`
  * Droid Sans n4 is detected as active
    * The `html` element has `wf-active wf-droidsans-n9-inactive
        wf-droidsans-n4-active`


### JavaScript Flavored

JavaScript events are implemented as callback functions on the `WebFont.load`
function.

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


## Error Handling

### Timeouts

Since the Internet is not 100% reliable, it's possible that a font fails to
load. You can use events to gracefully degrade in this situation.

> The `Font Inactive` event will be triggered after 5 seconds if the font
fails to render. If *at least* one font succesfully renders, the `Active`
event will be triggered, else the `Inactive` even will be triggered.

You can configure the timeout by using the `timeout` configuration on the
`WebFont.load` function.

    WebFont.load({
      timeout: 2000, // Set the timeout to two seconds
      ...
    });

The timeout value should be in milliseconds, and defaults to 5 seconds if
not supplied.

### Browser Support

Every web browser has varying levels of support for fonts linked via
@font-face.

> If WebFont Loader determines that the current browser does not support
`@font-face`, the `Inactive` event will be triggered.

When loading fonts from multiple providers, each provider may or may not
support a given browser.

> If WebFont Loader determines that the current browser can support
`@font-face`, and *at least* one provider is able to serve fonts,
the fonts from that provide will be loaded. When finished, the `Active` event
will be triggered.

> For fonts loaded from supported providers, the `Font Active` event will be
triggered. For fonts loaded from a provider that *does not* support the
current browser, the `Font Inactive` event will be triggered.

For example:

    WebFont.load({
      providerA: 'Family1',
      providerB: 'Family2'
    });

> If `providerA` can serve fonts to a browser, but `providerB` cannot, The
`Font Inactive` event will be triggered for `Family2`. The `Font Active`
event will be triggered for `Family1` once it loads, as will the `Active`
event.


