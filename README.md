# flex-progress

> CLI progress bar made simple

[![Build Status](https://travis-ci.org/dino-absoluto/flex-progress-js.svg?branch=master)](https://travis-ci.org/dino-absoluto/flex-progress-js)
[![Coverage Status](https://coveralls.io/repos/github/dino-absoluto/flex-progress-js/badge.svg?branch=master)](https://coveralls.io/github/dino-absoluto/flex-progress-js?branch=master)
[![npm version](https://badge.fury.io/js/%40dinoabsoluto%2Fflex-progress.svg)](https://badge.fury.io/js/%40dinoabsoluto%2Fflex-progress)

An object-oriented approach to progress bar.

- **Simple:** no template, no ticking, just change the `ratio` property and
you're good to go.
- **Theme:** personalize with colors and style.
- **Object-oriented:** each element is an object, updating its data leads to
updating the output.
No need to care about what other elements are doing.

```typescript
import * as FlexProgress from '@dinoabsoluto/flex-progress'

const out = new FlexProgress.Output()
const bar = new FlexProgress.Bar({ width: 25 })

out.append(
  1, new FlexProgress.Spinner()
, 1, 'Hello World!'
, 1, new FlexProgress.Spinner()
, 1, '⸨', bar , '⸩'
)

let count = 0
const loop = setInterval(() => {
  count++
  bar.ratio = (count % 39) / 38
}, 40)
```

<<<<<<< HEAD
<img width="550" height="50"
src="docs/media/demo-1.gif" />

<img width="550" height="50"
src="docs/media/demo-2.gif" />

<img width="550" height="50"
src="docs/media/demo-3.gif" />

**NOTE:** The three images above are screen capture of the demos in folder examples.
=======
<img width="430" height="40"
src="docs/media/demo-1.gif" />

<img width="430" height="40"
src="docs/media/demo-2.gif" />

<img width="430" height="40"
src="docs/media/demo-3.gif" />

**NOTE:** The images above are screen captures of the demos in folder examples.
>>>>>>> Update sample images

## Concept: why is it **flex**-progress?
This was inspired by CSS Flexbox concept, although much simpler.

Basically, all elements have `flexShrink` and `flexGrow` properties,
which controls how much they shrink/grow. (`flex` is a shorthand for both)

In most case, you'll want your progress `Bar` to have fixed width and a `Text`
with `flexShrink` set to 1. This way, your text will fill up the
CLI width, but will truncate at the end of the line.

## Usage
See [documents](docs/index.md) for more details.
The module has the following basic elements:
* `Group` - A group of elements. Child elements are rendered together.
A `Group` can contain other groups.
* `Output` - Write text to screen, derived from `Group`.
* `Bar` - A progress bar. Set progress via `ratio` property.
* `Spinner` - An infinity looping spinner.
* `Space` - Empty space.
* `Text` - A dynamic text element. Set the displayed text via `text` property.

Elements width can be changed dynamically. Although some, such as `Spinner`,
only render at fixed width (decided by the theme).
