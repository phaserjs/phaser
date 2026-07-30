# Phaser v4 Test Writing Guide

## Environment

Tests use **Vitest** with a **jsdom** environment. A global setup file (`tests/setup.js`) provides:

- Canvas 2D and WebGL context mocks
- An `Image` mock that triggers `onload` (required for Phaser's TextureManager boot)
- `self`, `screen`, and `window.focus` stubs

Run all tests with `npm test`. Watch mode with `npm run test:watch`.

## Two Testing Patterns

### Pattern 1: Direct require (no Phaser Game needed)

For pure functions — math, geometry, color utilities, array helpers, etc. — just require the source file directly:

```js
var Clamp = require('../../src/math/Clamp');

describe('Phaser.Math.Clamp', function ()
{
    it('should clamp above max', function ()
    {
        expect(Clamp(15, 0, 10)).toBe(10);
    });
});
```

Use this pattern when the function takes plain values and returns plain values with no Phaser object dependencies.

### Pattern 2: Real Phaser Game (for Game Objects, physics, scenes)

For anything that needs Sprites, Images, physics bodies, Scenes, or other Phaser objects, use the test helper which boots a real headless Phaser Game from the `dist/phaser.js` build:

```js
var helper = require('../helper'); // adjust depth to match test location

describe('MyFeature', function ()
{
    var scene;

    beforeEach(async function ()
    {
        scene = await helper.createGame();
    });

    afterEach(function ()
    {
        helper.destroyGame();
    });

    it('should work with a real sprite', function ()
    {
        var sprite = scene.add.sprite(100, 200, '__DEFAULT');
        expect(sprite.x).toBe(100);
        expect(sprite.type).toBe('Sprite');
    });
});
```

To enable Arcade Physics, pass config to `createGame`:

```js
scene = await helper.createGame({
    physics: {
        default: 'arcade',
        arcade: { debug: false, gravity: { y: 0 } }
    }
});

var sprite = scene.physics.add.sprite(0, 0, '__DEFAULT');
expect(sprite.body).toBeDefined();
```

The helper provides:
- `helper.createGame(config)` — returns a Promise that resolves with a real Scene
- `helper.destroyGame()` — cleans up (call in `afterEach`)
- `helper.Phaser` — the full Phaser namespace
- `helper.getGame()` — the current Game instance

The default texture key is `'__DEFAULT'` (32x32 pixels).

## Code Style

Match Phaser's style in test files:

- Use `var`, not `const` or `let`
- Use `function ()`, not arrow functions
- Allman brace style (opening brace on its own line for `describe`/`it` blocks)
- 4-space indentation
- Describe blocks use the Phaser namespace: `describe('Phaser.Math.Clamp', function () { ... })`

## Assertions

- `toBe()` for exact equality (numbers, strings, booleans, object identity)
- `toBeCloseTo()` for floating point comparisons
- `toBeNull()` / `toBeUndefined()` / `toBeDefined()` for null checks
- `value === 0` instead of `toBe(0)` when the result might be `-0` (JavaScript's `Object.is(-0, 0)` is `false`)
- For random/nondeterministic functions, run many iterations and assert range constraints

## What NOT to Test

- Methods marked `@private` in JSDoc
- WebGL renderer functions (`*WebGLRenderer.js`) — these are rendering stubs
- Factory/Creator registration methods — trivial wrappers
- Anything requiring actual pixel rendering or screenshot comparison

## Do NOT

- Use `done()` callbacks — Vitest does not support them. Use `async/await` or return a Promise.
- Create mock objects with fake properties when real Phaser objects are available via the helper.
- Use `vi.mock()` to mock Phaser internals — use real objects instead.
- Require from `src/phaser.js` directly — it is unbundled source without webpack flags. Always use `dist/phaser.js` (which the helper does automatically).

## File Structure

Tests mirror the `src/` directory layout:

```
tests/
  setup.js              — global environment setup (auto-loaded)
  helper.js             — Phaser Game bootstrap helper
  helper.test.js        — tests for the helper itself
  math/
    Clamp.test.js       — tests for src/math/Clamp.js
  geom/
    circle/
      Circle.test.js    — tests for src/geom/circle/Circle.js
  physics/
    arcade/
      Body.test.js      — tests for src/physics/arcade/Body.js
```
