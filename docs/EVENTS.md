# Events

WebFont JS provides an event system that developers can hook into. It gives
you notifications of the font loading sequence in both CSS and JavaScript.

## The Events

  * `Loading` - This event is triggered when all fonts have been requested.
  * `Active` - This event is triggered when all of the fonts have rendered.
  * `Inactive` - This event is triggered when the browser does not support linked fonts.
  * `Family Loading` - This event is triggered once for each family that's loaded.
  * `Family Active` - This event is triggered once for each family that renders.
  * `Family Inactive` - This event is triggered if the font.

### CSS Flavored

CSS events are implemented as classes on the `html` element.

    html.wf-loading
    html.wf-active
    html.wf-inactive
    html.wf-familyname-loading
    html.wf-familyname-active
    html.wf-familyname-inactive

`FAMILYNAME` is a sanitized version of the name of each font family. Spaces
and underscores are removed from the name, and all characters are converted to
lower case. For example, `Droid Sans` becomes `droidsans`.

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
      familyloading: function(familyName) {
      },
      familyactive: function(familyName) {
      },
      familyinactive: function(familyName) {
      }
    })


## Error Handling

### Timeouts

Since the Internet is not 100% reliable, it's possible that a font fails to
load. You can use events to gracefully degrade in this situation.

> The `Family Inactive` event will be triggered after 5 seconds if the font
fails to render. If *at least* one font succesfully renders, the `Active`
event will be triggered, else the `Inative` even will be triggered.

### Browser Support

Every web browser has varying levels of support for fonts linked via
@font-face.

> If WebFont JS determines that the current browser does not support
`@font-face`, the `Inactive` event will be triggered.

When loading fonts from multiple providers, each provider may or may not
support a given browser.

> If WebFont JS determines that the current browser can support
`@font-face`, and *at least* one provider is able to serve fonts,
the fonts from that provide will be loaded. When finished, the `Active` event
will be triggered.

> For fonts loaded from supported providers, the `Family Active` event will be
triggered. For fonts loaded from a provider that *does not* support the current
browser, the `Family Inactive` event will be triggered.

For example:

    WebFont.load({
      providerA: 'Font1'
      providerB: 'Font2'
    });

> If `providerA` can serve fonts to a browser, but `providerB` cannot, The
`Family Inactive` event will be triggered for `Font2`. The `Family Active`
event will be triggered for `Font1` once it loads, as will the `Active`
event.


