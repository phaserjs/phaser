/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var CanvasPool: any;
declare var Class: any;
declare var Components: any;
declare var CONST: {
    VERSION: string;
    BlendModes: any;
    ScaleModes: any;
    /**
     * @classdesc
     * A TileSprite is a Sprite that has a repeating texture.
     *
     * The texture can be scrolled and scaled independently of the TileSprite itself. Textures will automatically wrap and
     * are designed so that you can create game backdrops using seamless textures as a source.
     *
     * You shouldn't ever create a TileSprite any larger than your actual screen size. If you want to create a large repeating background
     * that scrolls across the whole map of your game, then you create a TileSprite that fits the screen size and then use the `tilePosition`
     * property to scroll the texture as the player moves. If you create a TileSprite that is thousands of pixels in size then it will
     * consume huge amounts of memory and cause performance issues. Remember: use `tilePosition` to scroll your texture and `tileScale` to
     * adjust the scale of the texture - don't resize the sprite itself or make it larger than it needs.
     *
     * An important note about Tile Sprites and NPOT textures: Internally, TileSprite textures use GL_REPEAT to provide
     * seamless repeating of the textures. This, combined with the way in which the textures are handled in WebGL, means
     * they need to be POT (power-of-two) sizes in order to wrap. If you provide a NPOT (non power-of-two) texture to a
     * TileSprite it will generate a POT sized canvas and draw your texture to it, scaled up to the POT size. It's then
     * scaled back down again during rendering to the original dimensions. While this works, in that it allows you to use
     * any size texture for a Tile Sprite, it does mean that NPOT textures are going to appear anti-aliased when rendered,
     * due to the interpolation that took place when it was resized into a POT texture. This is especially visible in
     * pixel art graphics. If you notice it and it becomes an issue, the only way to avoid it is to ensure that you
     * provide POT textures for Tile Sprites.
     *
     * @class TileSprite
     * @extends Phaser.GameObjects.GameObject
     * @memberOf Phaser.GameObjects
     * @constructor
     * @since 3.0.0
     *
     * @extends Phaser.GameObjects.Components.Alpha
     * @extends Phaser.GameObjects.Components.BlendMode
     * @extends Phaser.GameObjects.Components.ComputedSize
     * @extends Phaser.GameObjects.Components.Depth
     * @extends Phaser.GameObjects.Components.Flip
     * @extends Phaser.GameObjects.Components.GetBounds
     * @extends Phaser.GameObjects.Components.Mask
     * @extends Phaser.GameObjects.Components.Origin
     * @extends Phaser.GameObjects.Components.Pipeline
     * @extends Phaser.GameObjects.Components.ScaleMode
     * @extends Phaser.GameObjects.Components.ScrollFactor
     * @extends Phaser.GameObjects.Components.Texture
     * @extends Phaser.GameObjects.Components.Tint
     * @extends Phaser.GameObjects.Components.Transform
     * @extends Phaser.GameObjects.Components.Visible
     *
     * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {number} width - The width of the Game Object.
     * @param {number} height - The height of the Game Object.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     */
    AUTO: number;
    CANVAS: number;
    WEBGL: number;
    HEADLESS: number;
    FOREVER: number;
    NONE: number;
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
};
declare var GameObject: any;
declare var GetPowerOfTwo: any;
declare var TileSpriteRender: any;
/**
 * @classdesc
 * A TileSprite is a Sprite that has a repeating texture.
 *
 * The texture can be scrolled and scaled independently of the TileSprite itself. Textures will automatically wrap and
 * are designed so that you can create game backdrops using seamless textures as a source.
 *
 * You shouldn't ever create a TileSprite any larger than your actual screen size. If you want to create a large repeating background
 * that scrolls across the whole map of your game, then you create a TileSprite that fits the screen size and then use the `tilePosition`
 * property to scroll the texture as the player moves. If you create a TileSprite that is thousands of pixels in size then it will
 * consume huge amounts of memory and cause performance issues. Remember: use `tilePosition` to scroll your texture and `tileScale` to
 * adjust the scale of the texture - don't resize the sprite itself or make it larger than it needs.
 *
 * An important note about Tile Sprites and NPOT textures: Internally, TileSprite textures use GL_REPEAT to provide
 * seamless repeating of the textures. This, combined with the way in which the textures are handled in WebGL, means
 * they need to be POT (power-of-two) sizes in order to wrap. If you provide a NPOT (non power-of-two) texture to a
 * TileSprite it will generate a POT sized canvas and draw your texture to it, scaled up to the POT size. It's then
 * scaled back down again during rendering to the original dimensions. While this works, in that it allows you to use
 * any size texture for a Tile Sprite, it does mean that NPOT textures are going to appear anti-aliased when rendered,
 * due to the interpolation that took place when it was resized into a POT texture. This is especially visible in
 * pixel art graphics. If you notice it and it becomes an issue, the only way to avoid it is to ensure that you
 * provide POT textures for Tile Sprites.
 *
 * @class TileSprite
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} width - The width of the Game Object.
 * @param {number} height - The height of the Game Object.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
declare var TileSprite: any;
