---
name: text-and-bitmaptext
description: "Use this skill when displaying text in Phaser 4. Covers Text game objects, BitmapText, web fonts, text styling, word wrap, alignment, padding, and dynamic text content. Triggers on: Text, BitmapText, this.add.text, font, word wrap, text style."
---

# Text and BitmapText
> Displaying text in Phaser 4 -- the Canvas-based Text game object, TextStyle configuration, word wrap, BitmapText (static and dynamic), retro fonts, text alignment, text bounds, and padding.

**Key source paths:** `src/gameobjects/text/`, `src/gameobjects/bitmaptext/static/`, `src/gameobjects/bitmaptext/dynamic/`
**Related skills:** ../loading-assets/SKILL.md, ../sprites-and-images/SKILL.md, ../game-object-components/SKILL.md

## Quick Start

```js
// Canvas-based Text (flexible styling, uses browser fonts)
const title = this.add.text(400, 50, 'Hello World', {
    fontFamily: 'Arial',
    fontSize: '32px',
    color: '#ffffff'
});

// BitmapText (pre-rendered font texture, faster rendering)
// Font must be loaded first: this.load.bitmapFont('myFont', 'font.png', 'font.xml')
const score = this.add.bitmapText(400, 100, 'myFont', 'Score: 0', 32);

// DynamicBitmapText (per-character manipulation via callback)
const fancy = this.add.dynamicBitmapText(400, 200, 'myFont', 'Wavy!', 32);
fancy.setDisplayCallback(function (data) {
    data.y += Math.sin(data.index * 0.5 + fancy.scene.time.now * 0.005) * 10;
    return data;
});
```

## Core Concepts

### Text vs BitmapText

| Feature | Text | BitmapText | DynamicBitmapText |
|---|---|---|---|
| Rendering method | Canvas 2D API, uploaded as texture | Pre-rendered font texture | Pre-rendered font texture |
| Web/CSS fonts | Yes | No | No |
| Shadows, gradients, strokes | Yes (Canvas API) | Drop shadow only (WebGL) | No |
| Word wrap | Built-in (width, callback, advanced) | `setMaxWidth` | `setMaxWidth` |
| Per-character effects | No | `setCharacterTint`, `setWordTint` (WebGL) | `setDisplayCallback` |
| Performance | Slower (re-creates canvas texture on change) | Fast (batched rendering) | Moderate (callback per char) |
| Alignment | `left`, `right`, `center`, `justify` | `ALIGN_LEFT` (0), `ALIGN_CENTER` (1), `ALIGN_RIGHT` (2) | Same as BitmapText |
| RTL support | Yes (`rtl` style option) | No | No |

**Rule of thumb:** Use `Text` for UI elements that need flexible styling, web fonts, or infrequent updates. Use `BitmapText` for scores, timers, and anything that updates frequently or is rendered in large quantities. Use `DynamicBitmapText` only when you need per-character animation effects.

### TextStyle

The `Text` game object delegates all styling to its `TextStyle` instance, accessible via `text.style`. You pass a style config object when creating the Text, or update it later with setter methods. The style object uses Canvas 2D properties internally.

The `fontFamily` default is `'Courier'`, `fontSize` default is `'16px'`, and `color` default is `'#fff'`. The `font` shorthand property (e.g. `'bold 24px Arial'`) overrides `fontFamily`, `fontSize`, and `fontStyle` when provided.

## Common Patterns

### Basic Text Creation

```js
// Simple text with inline style
const label = this.add.text(100, 100, 'Player 1', {
    fontFamily: 'Georgia',
    fontSize: '24px',
    color: '#00ff00'
});

// Using the font shorthand (sets fontStyle, fontSize, fontFamily)
const bold = this.add.text(100, 150, 'Bold Text', {
    font: 'bold 28px Arial'
});

// Array of strings creates multi-line text
const multi = this.add.text(100, 200, ['Line 1', 'Line 2', 'Line 3'], {
    fontFamily: 'Arial',
    fontSize: '18px',
    color: '#ffffff'
});

// Text origin defaults to (0, 0) -- top-left corner
label.setOrigin(0.5); // center the text on its position
```

### Styling Text

```js
const text = this.add.text(400, 300, 'Styled', {
    fontFamily: 'Verdana',
    fontSize: '48px',
    color: '#ff0000',
    stroke: '#000000',
    strokeThickness: 4,
    backgroundColor: '#333333',
    shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, stroke: false, fill: true }
});

// Modify style after creation (all return `this` for chaining)
text.setColor('#00ffff');
text.setFontSize(64);
text.setFontFamily('Courier');
text.setFontStyle('italic');
text.setStroke('#ff00ff', 6);
text.setShadow(3, 3, '#000', 5, false, true);
text.setBackgroundColor('#222');

// Replace entire style at once
text.setStyle({ fontSize: '64px', fontFamily: 'Arial', color: '#ffffff', align: 'center' });

// Canvas gradients and patterns work as fill/stroke
const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
gradient.addColorStop(0, '#ff0000');
gradient.addColorStop(1, '#0000ff');
text.setFill(gradient);
```

### Word Wrap

```js
// Basic word wrap by pixel width
const wrapped = this.add.text(50, 50, 'Long text here...', {
    fontFamily: 'Arial',
    fontSize: '20px',
    color: '#fff',
    wordWrap: { width: 300 }
});

// Or set after creation
wrapped.setWordWrapWidth(300);

// Advanced wrap (collapses spaces, trims whitespace)
wrapped.setWordWrapWidth(300, true);

// Custom word wrap callback
wrapped.setWordWrapCallback(function (text, textObject) {
    // Return wrapped text as string with \n or array of lines
    return text.split(' ').join('\n');
});

// Get wrapped lines as array
const lines = wrapped.getWrappedText();
```

### Text Alignment

```js
// Alignment only affects multi-line text: 'left' (default), 'right', 'center', 'justify'
const aligned = this.add.text(400, 100, 'Line 1\nLonger Line 2\nLine 3', {
    fontFamily: 'Arial', fontSize: '24px', color: '#fff', align: 'center'
});

aligned.setAlign('right');

// For center alignment to look correct, combine with fixedWidth:
aligned.setFixedSize(300, 0);
aligned.setAlign('center');
```

### Dynamic Text Updates

```js
const scoreText = this.add.text(10, 10, 'Score: 0', {
    fontFamily: 'Arial',
    fontSize: '24px',
    color: '#fff'
});

// setText replaces content (accepts string or string[])
scoreText.setText('Score: 100');
scoreText.setText(['Score: 100', 'Lives: 3']); // joins with \n

// appendText adds to existing content
scoreText.appendText('Extra line');          // prepends \n by default
scoreText.appendText(' more', false);        // no carriage return

// Read current text
const current = scoreText.text;
```

### Text Padding

```js
// Padding adds space around text inside the canvas
const padded = this.add.text(100, 100, 'Padded', {
    fontFamily: 'Arial', fontSize: '24px', color: '#fff',
    backgroundColor: '#333',
    padding: { left: 10, right: 10, top: 5, bottom: 5 }
});

padded.setPadding({ x: 10, y: 5 });       // shorthand: x=left+right, y=top+bottom
padded.setPadding(10, 5, 10, 5);           // left, top, right, bottom
padded.setPadding(10);                     // single value = all sides
```

### Fixed Size, Max Lines, and Spacing

```js
// Fixed dimensions create a text canvas of exact size
const fixed = this.add.text(100, 100, 'Fixed box', {
    fontFamily: 'Arial', fontSize: '18px', color: '#fff',
    fixedWidth: 200, fixedHeight: 100,
    wordWrap: { width: 200 }, align: 'center'
});
fixed.setMaxLines(3); // limit displayed lines

// Line and letter spacing (in style config or via setters)
const spaced = this.add.text(100, 200, 'Spaced\nLines', {
    fontFamily: 'Arial', fontSize: '24px', color: '#fff',
    lineSpacing: 10, letterSpacing: 2
});
spaced.setLineSpacing(20);
spaced.setLetterSpacing(5);
```

### BitmapText Creation

```js
// Load in preload: this.load.bitmapFont('pixelFont', 'font.png', 'font.xml');

// Static BitmapText -- fast, batched rendering
const bmpText = this.add.bitmapText(100, 100, 'pixelFont', 'Hello', 32);

// With alignment (for multi-line)
const aligned = this.add.bitmapText(100, 200, 'pixelFont', 'Line 1\nLine 2', 24, 1);
// align: 0 = left, 1 = center, 2 = right

// Convenience alignment methods
bmpText.setLeftAlign();
bmpText.setCenterAlign();
bmpText.setRightAlign();

// Modify text
bmpText.setText('Updated!');
bmpText.text = 'Also works';

// Font size
bmpText.setFontSize(48);
bmpText.fontSize = 48;

// Spacing
bmpText.setLetterSpacing(2);
bmpText.setLineSpacing(5);

// Word wrap by max pixel width
bmpText.setMaxWidth(200);
```

### BitmapText Drop Shadow and Tinting

```js
// Drop shadow (WebGL only, static BitmapText only)
bmpText.setDropShadow(2, 2, 0x000000, 0.5);
// Clear shadow
bmpText.setDropShadow();

// Tint individual characters (WebGL only)
bmpText.setCharacterTint(0, 5, Phaser.TintModes.MULTIPLY, 0xff0000);
// start index, length (-1 for all from start), tintMode, color

// Tint by word (string match or word index)
bmpText.setWordTint('Score', -1, Phaser.TintModes.MULTIPLY, 0x00ff00);
```

### DynamicBitmapText

```js
const dynamic = this.add.dynamicBitmapText(100, 100, 'pixelFont', 'Dynamic!', 32);

// Per-character display callback -- invoked each render frame per character
dynamic.setDisplayCallback(function (data) {
    // data properties: parent, tint, index, charCode, x, y, scale, rotation, data
    data.x += Math.sin(data.index + dynamic.scene.time.now * 0.01) * 5;
    data.y += Math.cos(data.index + dynamic.scene.time.now * 0.01) * 5;
    return data;
});

// Scrolling text window
dynamic.setSize(200, 50);      // crop region in pixels
dynamic.setScrollX(10);
dynamic.setScrollY(0);
```

### Retro Fonts

Retro fonts use a fixed-width character grid from a standard image (no XML/JSON font file needed).

```js
// In preload -- load the image containing the font characters
this.load.image('retroFont', 'retroFont.png');

// In create -- parse the retro font configuration
const config = {
    image: 'retroFont',
    width: 8,           // character width in pixels
    height: 8,          // character height in pixels
    chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
    charsPerRow: 16,
    offset: { x: 0, y: 0 },
    spacing: { x: 0, y: 0 },
    lineSpacing: 0
};

// Parse adds it to the BitmapFont cache
this.cache.bitmapFont.add('retroFont', { data: Phaser.GameObjects.RetroFont.Parse(this, config) });

// Now use it like any BitmapText
const retro = this.add.bitmapText(100, 100, 'retroFont', 'RETRO TEXT', 8);
```

Available `Phaser.GameObjects.RetroFont` TEXT_SET constants: `TEXT_SET1` (full ASCII printable), `TEXT_SET2` (space through Z), `TEXT_SET3`-`TEXT_SET11` (various subsets of uppercase, digits, punctuation). `TEXT_SET10` is uppercase letters only.

### Text Bounds (BitmapText)

```js
// getTextBounds returns local, global, line, word, and character data
const bounds = bmpText.getTextBounds();
// bounds.local       -- { x, y, width, height } at origin 0,0
// bounds.global      -- { x, y, width, height } with scale + world position
// bounds.lines       -- per-line { x, y, width, height }
// bounds.words       -- word objects with positions
// bounds.characters  -- character objects with positions

// width/height are read-only properties (computed from global bounds)
console.log(bmpText.width, bmpText.height);

// Get character at world position (useful for click detection)
const char = bmpText.getCharacterAt(pointer.worldX, pointer.worldY);
```

### Resolution (High DPI)

```js
// Higher resolution for crisp text on HiDPI displays (costs more memory)
const crisp = this.add.text(100, 100, 'Sharp!', {
    fontFamily: 'Arial', fontSize: '24px', color: '#fff', resolution: 2
});
crisp.setResolution(window.devicePixelRatio); // change after creation
```

## Configuration Reference

### TextStyle Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `fontFamily` | string | `'Courier'` | CSS font family |
| `fontSize` | string/number | `'16px'` | Font size (number auto-appends `'px'`) |
| `fontStyle` | string | `''` | CSS font style (`'bold'`, `'italic'`, `'bold italic'`) |
| `font` | string | - | Shorthand: `'bold 24px Arial'` (overrides family/size/style) |
| `color` | string/CanvasGradient/CanvasPattern | `'#fff'` | Fill color |
| `stroke` | string/CanvasGradient/CanvasPattern | `'#fff'` | Stroke color |
| `strokeThickness` | number | `0` | Stroke width (0 = no stroke) |
| `backgroundColor` | string | `null` | Solid background color |
| `align` | string | `'left'` | Multi-line alignment: `'left'`, `'right'`, `'center'`, `'justify'` |
| `maxLines` | number | `0` | Max lines to render (0 = unlimited) |
| `fixedWidth` | number | `0` | Fixed canvas width (0 = auto) |
| `fixedHeight` | number | `0` | Fixed canvas height (0 = auto) |
| `resolution` | number | `0` | Canvas resolution (0 = use game config) |
| `rtl` | boolean | `false` | Right-to-left rendering |
| `baselineX` | number | `1.2` | Horizontal padding for font metrics |
| `baselineY` | number | `1.4` | Vertical padding for font metrics |
| `testString` | string | `'\|MEqgy'` | String used for font height measurement |
| `wordWrap` | object | - | `{ width, callback, callbackScope, useAdvancedWrap }` |
| `shadow` | object | - | `{ offsetX, offsetY, color, blur, stroke, fill }` |
| `padding` | object | - | `{ left, right, top, bottom }` or `{ x, y }` |
| `lineSpacing` | number | `0` | Extra vertical spacing between lines |
| `letterSpacing` | number | `0` | Extra horizontal spacing between characters |
| `metrics` | object | - | Pre-computed `{ ascent, descent, fontSize }` to skip measurement |

## Factory Methods

```js
// Text -- Canvas-based
this.add.text(x, y, text, style);
// x, y: number; text: string | string[]; style: TextStyle (optional)
// Returns: Phaser.GameObjects.Text

// BitmapText -- static, fast
this.add.bitmapText(x, y, font, text, size, align);
// x, y: number; font: string (cache key); text: string | string[] (optional)
// size: number (optional, defaults to font data size); align: number (optional, 0)
// Returns: Phaser.GameObjects.BitmapText

// DynamicBitmapText -- per-character callback
this.add.dynamicBitmapText(x, y, font, text, size);
// Same as bitmapText but returns DynamicBitmapText
// Returns: Phaser.GameObjects.DynamicBitmapText
```

## API Quick Reference

### Text Methods

`setText(value)`, `appendText(value, addCR?)`, `setStyle(style)`, `setFont(font)`, `setFontFamily(family)`, `setFontSize(size)`, `setFontStyle(style)`, `setColor(color)`, `setFill(color)`, `setStroke(color, thickness)`, `setShadow(x, y, color, blur, stroke, fill)`, `setBackgroundColor(color)`, `setWordWrapWidth(width, useAdvanced?)`, `setWordWrapCallback(callback, scope?)`, `setAlign(align)`, `setPadding(left, top?, right?, bottom?)`, `setFixedSize(width, height)`, `setMaxLines(max)`, `setLineSpacing(value)`, `setLetterSpacing(value)`, `setResolution(value)`, `setRTL(rtl?)`, `getWrappedText(text?)`, `updateText()`

All setters return `this` for chaining. Properties: `text` (get/set), `style` (TextStyle instance), `padding`, `lineSpacing`, `letterSpacing`, `autoRound`, `splitRegExp`.

### BitmapText Methods

`setText(value)`, `setFont(font, size?, align?)`, `setFontSize(size)`, `setLetterSpacing(spacing?)`, `setLineSpacing(spacing?)`, `setMaxWidth(value, wordWrapCharCode?)`, `setLeftAlign()`, `setCenterAlign()`, `setRightAlign()`, `setDropShadow(x?, y?, color?, alpha?)`, `setCharacterTint(start?, length?, tintMode?, tl?, tr?, bl?, br?)`, `setWordTint(word, count?, tintMode?, tl?, tr?, bl?, br?)`, `getTextBounds(round?)`, `getCharacterAt(x, y, camera?)`

Properties (get/set): `text`, `fontSize`, `letterSpacing`, `lineSpacing`, `align` (number), `maxWidth`. Read-only: `width`, `height`, `font`, `fontData`.

Alignment constants: `BitmapText.ALIGN_LEFT` (0), `BitmapText.ALIGN_CENTER` (1), `BitmapText.ALIGN_RIGHT` (2).

### DynamicBitmapText Methods (additional)

`setDisplayCallback(callback)`, `setSize(width, height)`, `setScrollX(value)`, `setScrollY(value)`

Properties: `scrollX`, `scrollY`, `cropWidth`, `cropHeight`, `displayCallback`, `callbackData`.

## Gotchas

1. **Text re-renders on every change.** Each call to `setText`, `setStyle`, `setColor`, etc. re-creates the internal canvas and (in WebGL) re-uploads the texture. Batch your style changes and call `updateText()` once, or set the style object properties directly and call `updateText()` at the end.

2. **Font must be loaded before use.** The Text object uses the Canvas `fillText` API, so fonts must be available in the browser (loaded via CSS, a web font loader, or already installed). Phaser does not load web fonts -- use a third-party loader or CSS `@font-face`.

3. **Font names with special characters need quotes.** Font names containing digits or special characters must be double-quoted inside the string: `fontFamily: '"Press Start 2P"'`.

4. **Text origin defaults to (0, 0).** Unlike Sprites which default to (0.5, 0.5), Text objects default to top-left origin. Call `setOrigin(0.5)` to center.

5. **Alignment only affects multi-line text.** `align: 'center'` does nothing on single-line text. For centering a single line, use `setOrigin(0.5)` or position it manually.

6. **BitmapText font must be in cache.** The font key passed to `this.add.bitmapText()` must match a key loaded via `this.load.bitmapFont()`. If missing, you get a console warning and undefined behavior.

7. **BitmapText `setMaxWidth` only wraps on whitespace.** If no whitespace character is found (default char code 32 = space), no wrapping occurs. Change the wrap character with the second argument to `setMaxWidth`.

8. **DynamicBitmapText is more expensive.** The display callback runs for every character every frame. Only use it when you need per-character manipulation.

9. **`setCharacterTint` and `setWordTint` are WebGL only.** These have no effect in Canvas renderer.

10. **`setDropShadow` is WebGL only and static BitmapText only.** It does not work with DynamicBitmapText or the Canvas renderer.

11. **`letterSpacing` on Text is expensive.** When non-zero, Phaser renders each character individually with `fillText` instead of the whole line at once. Use BitmapText for large amounts of text with custom letter spacing.

12. **`setFill` and `setColor` are equivalent.** Both set the `color` property on the TextStyle. The style config also accepts `fill` as an alias for `color`.

13. **`setRTL` must be called BEFORE `setText`.** Right-to-left mode changes how the internal canvas is constructed. If you call `setRTL(true)` after setting text, the text may not render correctly. Set RTL in the style config or call `setRTL()` before any `setText()` call.

14. **BitmapText is much faster for frequently updating content.** Text re-renders its entire Canvas and re-uploads the GPU texture on every change. BitmapText just updates vertex data in an existing texture atlas. For scores, timers, damage numbers, or any text that changes every frame, always prefer BitmapText.

## Source File Map

| File | Description |
|---|---|
| `src/gameobjects/text/Text.js` | Text class (Canvas-based rendering) |
| `src/gameobjects/text/TextFactory.js` | `this.add.text()` factory |
| `src/gameobjects/text/TextStyle.js` | TextStyle class (all style properties + setters) |
| `src/gameobjects/text/GetTextSize.js` | Internal text measurement |
| `src/gameobjects/text/MeasureText.js` | Font metrics measurement |
| `src/gameobjects/text/typedefs/` | TextStyle, TextWordWrap, TextPadding, TextShadow typedefs |
| `src/gameobjects/bitmaptext/static/BitmapText.js` | Static BitmapText class |
| `src/gameobjects/bitmaptext/static/BitmapTextFactory.js` | `this.add.bitmapText()` factory |
| `src/gameobjects/bitmaptext/dynamic/DynamicBitmapText.js` | DynamicBitmapText (extends BitmapText) |
| `src/gameobjects/bitmaptext/dynamic/DynamicBitmapTextFactory.js` | `this.add.dynamicBitmapText()` factory |
| `src/gameobjects/bitmaptext/ParseRetroFont.js` | Retro font parser (`RetroFont.Parse`) |
| `src/gameobjects/bitmaptext/RetroFont.js` | RetroFont namespace (Parse + TEXT_SET constants) |
| `src/gameobjects/bitmaptext/const.js` | TEXT_SET1 through TEXT_SET11 constants |
| `src/gameobjects/bitmaptext/GetBitmapTextSize.js` | BitmapText bounds calculation |
| `src/gameobjects/bitmaptext/typedefs/` | RetroFontConfig, DisplayCallbackConfig, BitmapTextSize typedefs |
