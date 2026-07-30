# Phaser 4 Cone Lights

Cone lights are standard Phaser dynamic lights restricted to a directional cone. They are useful for flashlights, lantern beams, vision cones, headlights, searchlights, and other focal light sources.

Cone lights run through the existing WebGL lighting shader. They do not require a mask, a second Camera, or rendering the map twice. Any Game Object that already works with Phaser lighting can be lit by a cone light.

## Requirements

Cone lights use the same requirements as regular dynamic lights:

- The renderer must be WebGL.
- The Scene Light Manager must be enabled with `this.lights.enable()`.
- Game Objects that should receive light must use `setLighting(true)`.
- Normal maps are optional. Without a normal map, objects use the default flat normal map.
- Lighting has no effect in Canvas rendering.

```javascript
function create ()
{
    this.lights.enable();
    this.lights.setAmbientColor(0x202020);

    this.add.image(400, 300, 'tiles').setLighting(true);
}
```

## Creating a Cone Light

The quickest way is `addConeLight`:

```javascript
const light = this.lights.addConeLight(
    400,                       // x
    300,                       // y
    320,                       // radius
    0xffcc88,                  // color
    2,                         // intensity
    Phaser.Math.DegToRad(0),   // rotation
    Phaser.Math.DegToRad(30),  // inner angle
    Phaser.Math.DegToRad(60)   // outer angle
);
```

`rotation` is in radians. A rotation of `0` points right, `Math.PI / 2` points down in world space, `Math.PI` points left, and `-Math.PI / 2` points up.

The cone angles are full cone widths, not half-angles:

- `innerAngle`: the fully-lit cone width.
- `outerAngle`: the wider falloff cone width.

Fragments inside the inner angle receive full light. Fragments between the inner and outer angles fade out smoothly. Fragments outside the outer angle receive no light from this light.

If `outerAngle` is omitted, the cone uses a hard edge:

```javascript
const hardCone = this.lights.addConeLight(
    400,
    300,
    320,
    0xffffff,
    1,
    Phaser.Math.DegToRad(45),
    Phaser.Math.DegToRad(35)
);
```

## Converting a Regular Light

You can also create a normal radius light and restrict it later:

```javascript
const light = this.lights.addLight(400, 300, 320, 0xffcc88, 2);

light.setCone(
    Phaser.Math.DegToRad(0),
    Phaser.Math.DegToRad(30),
    Phaser.Math.DegToRad(60)
);
```

This is useful when you want to reuse existing light setup code, or toggle between omnidirectional and cone modes.

## Following a Player

For a lantern or flashlight attached to a player, update the light position and cone rotation each frame:

```javascript
function create ()
{
    this.lights.enable();
    this.lights.setAmbientColor(0x080808);

    this.player = this.add.sprite(400, 300, 'player').setLighting(true);

    this.flashlight = this.lights.addConeLight(
        this.player.x,
        this.player.y,
        360,
        0xffd28a,
        2.5,
        this.player.rotation,
        Phaser.Math.DegToRad(35),
        Phaser.Math.DegToRad(75)
    );
}

function update ()
{
    this.flashlight.x = this.player.x;
    this.flashlight.y = this.player.y;
    this.flashlight.setConeRotation(this.player.rotation);
}
```

If your character art points up by default, add an offset:

```javascript
this.flashlight.setConeRotation(this.player.rotation - Math.PI / 2);
```

## Changing Cone Shape

Use `setConeAngles` to adjust the width without changing direction:

```javascript
light.setConeAngles(
    Phaser.Math.DegToRad(20),
    Phaser.Math.DegToRad(80)
);
```

For a narrow flashlight:

```javascript
light.setConeAngles(
    Phaser.Math.DegToRad(18),
    Phaser.Math.DegToRad(35)
);
```

For a soft lantern beam:

```javascript
light.setConeAngles(
    Phaser.Math.DegToRad(60),
    Phaser.Math.DegToRad(120)
);
```

For a hard-edged searchlight:

```javascript
light.setConeAngles(
    Phaser.Math.DegToRad(25),
    Phaser.Math.DegToRad(25)
);
```

Angles are clamped to the range `0` to `Math.PI * 2`. If the outer angle is smaller than the inner angle, Phaser uses the inner angle for both.

## Disabling the Cone

Call `disableCone` to return a cone light to normal radius behavior:

```javascript
light.disableCone();
```

The previous cone values remain on the Light object, but they are ignored until `setCone` is called again.

## API Summary

### `this.lights.addConeLight`

```javascript
this.lights.addConeLight(
    x,
    y,
    radius,
    rgb,
    intensity,
    rotation,
    innerAngle,
    outerAngle,
    z
);
```

Parameters:

- `x`: horizontal light position. Default `0`.
- `y`: vertical light position. Default `0`.
- `radius`: maximum light distance in pixels. Default `128`.
- `rgb`: light color as an integer RGB value. Default `0xffffff`.
- `intensity`: brightness multiplier. Default `1`.
- `rotation`: cone direction in radians. Default `0`.
- `innerAngle`: fully-lit cone width in radians. Default `Math.PI / 4`.
- `outerAngle`: outer falloff cone width in radians. Default `innerAngle`.
- `z`: light height. If omitted, Phaser uses `radius * 0.1`.

Returns a `Phaser.GameObjects.Light`.

### `light.setCone`

```javascript
light.setCone(rotation, innerAngle, outerAngle);
```

Enables cone limiting and sets direction and angles.

### `light.setConeRotation`

```javascript
light.setConeRotation(rotation);
```

Changes the cone direction without changing the cone width.

### `light.setConeAngles`

```javascript
light.setConeAngles(innerAngle, outerAngle);
```

Changes the cone width without changing the cone direction.

### `light.disableCone`

```javascript
light.disableCone();
```

Disables cone limiting and returns the light to normal radius behavior.

## Performance

Cone lights are cheaper than a mask-based approach that renders the map through extra Cameras. They add a small amount of shader math to the existing lighting pass for each active cone light.

The normal lighting limits still apply:

- The renderer processes up to the configured `maxLights`.
- Lights outside the Camera view are culled.
- If too many lights are visible, Phaser keeps the closest lights to the Camera.
- Lighting changes the shader path, which can break batches.

For best performance:

- Keep the number of active cone lights low.
- Use ambient color for general darkness instead of many large low-intensity lights.
- Prefer one player cone light plus a few local radius lights over many overlapping large cones.
- Reduce `radius` where possible; it affects culling and how many fragments evaluate visible light.

## Choosing Between Cone Light and Point Light

Use cone lights when the light should affect lit Game Objects and normal maps.

Use Point Light Game Objects when you only need a fast radial glow effect. Point Lights do not affect other Game Objects and do not use normal maps.

For a lantern that should illuminate the map, player, enemies, or normal-mapped tiles, use `addConeLight` or `addLight().setCone(...)`.

## Complete Example

```javascript
class DungeonScene extends Phaser.Scene
{
    preload ()
    {
        this.load.image('floor', 'assets/floor.png');
        this.load.image('floor_n', 'assets/floor_n.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('player_n', 'assets/player_n.png');
    }

    create ()
    {
        this.lights.enable();
        this.lights.setAmbientColor(0x050505);

        const floor = this.add.image(400, 300, 'floor');
        floor.setLighting(true);

        this.player = this.add.sprite(400, 300, 'player');
        this.player.setLighting(true);

        this.lantern = this.lights.addConeLight(
            this.player.x,
            this.player.y,
            420,
            0xffcc88,
            2.2,
            0,
            Phaser.Math.DegToRad(55),
            Phaser.Math.DegToRad(110),
            42
        );

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update ()
    {
        const speed = 3;

        if (this.cursors.left.isDown)
        {
            this.player.x -= speed;
            this.player.rotation = Math.PI;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.x += speed;
            this.player.rotation = 0;
        }

        if (this.cursors.up.isDown)
        {
            this.player.y -= speed;
            this.player.rotation = -Math.PI / 2;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.y += speed;
            this.player.rotation = Math.PI / 2;
        }

        this.lantern.x = this.player.x;
        this.lantern.y = this.player.y;
        this.lantern.setConeRotation(this.player.rotation);
    }
}
```

