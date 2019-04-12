## Options
Work in progress.

###### minWidth
Type: `number`

Minimum acceptable width.

###### maxWidth
Type: `number`

Maximum acceptable width.

###### width
Type: `number`

Short hand for `minWidth` & `maxWidth`

###### flex
Type:
```typescript
number | {
  grow: number
  shrink: number
}
```

Make the element grow or shrink.

###### postProcess
Type: `(...texts: string[]) => string | string[]`
Post process the rendered text.

Putting ANSI escape code to your text may cause various problems.
Especially when the text needed to be truncated.
Therefore it's an unrecommended act.

Pass a function to this option to postProcess the output
(e.g. `chalk.red`)
The resulted string visual length must always equal to the input length.

***NOTE:*** class `Bar` pass 3 strings as arguments:
- 1st, a string represents filled space
- 2nd, a string represents half-filled space
- 3rd, a string represents empty space

### Group
A group of elements. A `Group` is also an element.
Therefore it can be added to another `Group` as a sub-element.

`Group` implements the following space
```typescript
type FlexChild = string | number | ChildElement

interface Container {
  add (item: FlexChild, atIndex?: number): void
  remove (item: ChildElement): void
  append (...items: FlexChild[]): void
  clear (): void
}
```
`FlexChild` will all be converted to `ChildElement`:
- `string` to a text element
- `number` to a space element


### Output
Inherited from `Group`, supports all `Group` functions. Except that it cannot
be added to another `Group` and all it output will be directed to screen.

### Bar
###### ratio
Type: `number`

The completion degree of the progress bar. Clamped to [0-1].

###### theme
Type:
```typescript
interface BarTheme {
  symbols: string[] /* default: [ '░', '▒', '▓', '█' ] */
}
```
An array of string representing how to render this progress bar.

The first string → an incomplete field.
The last string → a completed field.
Anything in between are divided evenly.

### Spinner
###### theme
Type:
```typescript
interface SpinnerTheme {
  interval: number
  frames: string[]
  /* Optional fixed width to rendered at */
  width?: number
}
```
Compatible with
[![npm version](https://badge.fury.io/js/cli-spinners.svg)](https://badge.fury.io/js/cli-spinners)


### Text
###### text
Type: `string`

Text to display.

##### align
Type:
```typescript
const enum TextAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}
```

Where to place text when there's too much space?

### HideCursor
A helper class to hide the CLI cursor.
Adding this to an `Output` make the cursor goes away.
Removing it make the cursor return.

**NOTE:** if the program was interrupted with Ctrl+C, the cursor
may stay hidden.
Capture `SIGINT` signal to cleanly clear out `Output`.

```typescript
process.on('SIGINT', () => {
  out.clear(false) /* output is an instance of Output */
  console.log()
  process.exit(0)
})
```
