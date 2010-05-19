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
event will be triggered, else the `Inative` even will be triggered.

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


