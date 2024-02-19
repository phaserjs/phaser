/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');

/**
 * @classdesc
 * A Bitmap Mask combines the alpha (opacity) of a masked pixel with the alpha of another pixel.
 * Unlike the Geometry Mask, which is a clipping path, a Bitmap Mask behaves like an alpha mask,
 * not a clipping path. It is only available when using the WebGL Renderer.
 *
 * A Bitmap Mask can use any Game Object or Dynamic Texture to determine the alpha of each pixel of the masked Game Object(s).
 * For any given point of a masked Game Object's texture, the pixel's alpha will be multiplied by the alpha
 * of the pixel at the same position in the Bitmap Mask's Game Object. The color of the pixel from the
 * Bitmap Mask doesn't matter.
 *
 * For example, if a pure blue pixel with an alpha of 0.95 is masked with a pure red pixel with an
 * alpha of 0.5, the resulting pixel will be pure blue with an alpha of 0.475. Naturally, this means
 * that a pixel in the mask with an alpha of 0 will hide the corresponding pixel in all masked Game Objects.
 * A pixel with an alpha of 1 in the masked Game Object will receive the same alpha as the
 * corresponding pixel in the mask.
 *
 * Note: You cannot combine Bitmap Masks and Blend Modes on the same Game Object. You can, however,
 * combine Geometry Masks and Blend Modes together.
 *
 * The Bitmap Mask's location matches the location of its Game Object, not the location of the
 * masked objects. Moving or transforming the underlying Game Object will change the mask
 * (and affect the visibility of any masked objects), whereas moving or transforming a masked object
 * will not affect the mask.
 *
 * The Bitmap Mask will not render its Game Object by itself. If the Game Object is not in a
 * Scene's display list, it will only be used for the mask and its full texture will not be directly
 * visible. Adding the underlying Game Object to a Scene will not cause any problems - it will
 * render as a normal Game Object and will also serve as a mask.
 *
 * @class BitmapMask
 * @memberof Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this mask is being added.
 * @param {(Phaser.GameObjects.GameObject|Phaser.Textures.DynamicTexture)} [maskObject] - The Game Object or Dynamic Texture that will be used as the mask. If `null` it will generate an Image Game Object using the rest of the arguments.
 * @param {number} [x] - If creating a Game Object, the horizontal position in the world.
 * @param {number} [y] - If creating a Game Object, the vertical position in the world.
 * @param {(string|Phaser.Textures.Texture)} [texture] - If creating a Game Object, the key, or instance of the Texture it will use to render with, as stored in the Texture Manager.
 * @param {(string|number|Phaser.Textures.Frame)} [frame] - If creating a Game Object, an optional frame from the Texture this Game Object is rendering with.
 */
var BitmapMask = new Class({

    initialize:

    function BitmapMask (scene, maskObject, x, y, texture, frame)
    {
        if (!maskObject)
        {
            maskObject = scene.sys.make.image({ x: x, y: y, key: texture, frame: frame, add: false });
        }

        /**
         * The Game Object that is used as the mask. Must use a texture, such as a Sprite.
         *
         * @name Phaser.Display.Masks.BitmapMask#bitmapMask
         * @type {(Phaser.GameObjects.GameObject|Phaser.Textures.DynamicTexture)}
         * @since 3.0.0
         */
        this.bitmapMask = maskObject;

        /**
         * Whether to invert the masks alpha.
         *
         * If `true`, the alpha of the masking pixel will be inverted before it's multiplied with the masked pixel.
         *
         * Essentially, this means that a masked area will be visible only if the corresponding area in the mask is invisible.
         *
         * @name Phaser.Display.Masks.BitmapMask#invertAlpha
         * @type {boolean}
         * @since 3.1.2
         */
        this.invertAlpha = false;

        /**
         * Is this mask a stencil mask? This is false by default and should not be changed.
         *
         * @name Phaser.Display.Masks.BitmapMask#isStencil
         * @type {boolean}
         * @readonly
         * @since 3.17.0
         */
        this.isStencil = false;
    },

    /**
     * Sets a new Game Object or Dynamic Texture for this Bitmap Mask to use.
     *
     * If a Game Object it must have a texture, such as a Sprite.
     *
     * You can update the source of the mask as often as you like.
     *
     * @method Phaser.Display.Masks.BitmapMask#setBitmap
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.Textures.DynamicTexture)} maskObject - The Game Object or Dynamic Texture that will be used as the mask. If a Game Object, it must have a texture, such as a Sprite.
     */
    setBitmap: function (maskObject)
    {
        this.bitmapMask = maskObject;
    },

    /**
     * Prepares the WebGL Renderer to render a Game Object with this mask applied.
     *
     * This renders the masking Game Object to the mask framebuffer and switches to the main framebuffer so that the masked Game Object will be rendered to it instead of being rendered directly to the frame.
     *
     * @method Phaser.Display.Masks.BitmapMask#preRenderWebGL
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The WebGL Renderer to prepare.
     * @param {Phaser.GameObjects.GameObject} maskedObject - The masked Game Object which will be drawn.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    preRenderWebGL: function (renderer, maskedObject, camera)
    {
        renderer.pipelines.BITMAPMASK_PIPELINE.beginMask(this, maskedObject, camera);
    },

    /**
     * Finalizes rendering of a masked Game Object.
     *
     * This resets the previously bound framebuffer and switches the WebGL Renderer to the Bitmap Mask Pipeline, which uses a special fragment shader to apply the masking effect.
     *
     * @method Phaser.Display.Masks.BitmapMask#postRenderWebGL
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The WebGL Renderer to clean up.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [renderTarget] - Optional WebGL RenderTarget.
     */
    postRenderWebGL: function (renderer, camera, renderTarget)
    {
        renderer.pipelines.BITMAPMASK_PIPELINE.endMask(this, camera, renderTarget);
    },

    /**
     * This is a NOOP method. Bitmap Masks are not supported by the Canvas Renderer.
     *
     * @method Phaser.Display.Masks.BitmapMask#preRenderCanvas
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The Canvas Renderer which would be rendered to.
     * @param {Phaser.GameObjects.GameObject} mask - The masked Game Object which would be rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    preRenderCanvas: function ()
    {
        // NOOP
    },

    /**
     * This is a NOOP method. Bitmap Masks are not supported by the Canvas Renderer.
     *
     * @method Phaser.Display.Masks.BitmapMask#postRenderCanvas
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The Canvas Renderer which would be rendered to.
     */
    postRenderCanvas: function ()
    {
        // NOOP
    },

    /**
     * Destroys this BitmapMask and nulls any references it holds.
     *
     * Note that if a Game Object is currently using this mask it will _not_ automatically detect you have destroyed it,
     * so be sure to call `clearMask` on any Game Object using it, before destroying it.
     *
     * @method Phaser.Display.Masks.BitmapMask#destroy
     * @since 3.7.0
     */
    destroy: function ()
    {
        this.bitmapMask = null;
    }

});

/**
 * A Bitmap Mask combines the alpha (opacity) of a masked pixel with the alpha of another pixel.
 * Unlike the Geometry Mask, which is a clipping path, a Bitmap Mask behaves like an alpha mask,
 * not a clipping path. It is only available when using the WebGL Renderer.
 *
 * A Bitmap Mask can use any Game Object, or Dynamic Texture, to determine the alpha of each pixel of the masked Game Object(s).
 * For any given point of a masked Game Object's texture, the pixel's alpha will be multiplied by the alpha
 * of the pixel at the same position in the Bitmap Mask's Game Object. The color of the pixel from the
 * Bitmap Mask doesn't matter.
 *
 * For example, if a pure blue pixel with an alpha of 0.95 is masked with a pure red pixel with an
 * alpha of 0.5, the resulting pixel will be pure blue with an alpha of 0.475. Naturally, this means
 * that a pixel in the mask with an alpha of 0 will hide the corresponding pixel in all masked Game Objects
 *  A pixel with an alpha of 1 in the masked Game Object will receive the same alpha as the
 * corresponding pixel in the mask.
 *
 * Note: You cannot combine Bitmap Masks and Blend Modes on the same Game Object. You can, however,
 * combine Geometry Masks and Blend Modes together.
 *
 * The Bitmap Mask's location matches the location of its Game Object, not the location of the
 * masked objects. Moving or transforming the underlying Game Object will change the mask
 * (and affect the visibility of any masked objects), whereas moving or transforming a masked object
 * will not affect the mask.
 *
 * The Bitmap Mask will not render its Game Object by itself. If the Game Object is not in a
 * Scene's display list, it will only be used for the mask and its full texture will not be directly
 * visible. Adding the underlying Game Object to a Scene will not cause any problems - it will
 * render as a normal Game Object and will also serve as a mask.
 *
 * @method Phaser.GameObjects.GameObjectFactory#bitmapMask
 * @since 3.60.0
 *
 * @param {(Phaser.GameObjects.GameObject|Phaser.Textures.DynamicTexture)} [maskObject] - The Game Object or Texture that will be used as the mask. If `null` it will generate an Image Game Object using the rest of the arguments.
 * @param {number} [x] - If creating a Game Object, the horizontal position in the world.
 * @param {number} [y] - If creating a Game Object, the vertical position in the world.
 * @param {(string|Phaser.Textures.Texture)} [texture] - If creating a Game Object, the key, or instance of the Texture it will use to render with, as stored in the Texture Manager.
 * @param {(string|number|Phaser.Textures.Frame)} [frame] - If creating a Game Object, an optional frame from the Texture this Game Object is rendering with.
 *
 * @return {Phaser.Display.Masks.BitmapMask} The Bitmap Mask that was created.
 */
GameObjectFactory.register('bitmapMask', function (maskObject, x, y, key, frame)
{
    return new BitmapMask(this.scene, maskObject, x, y, key, frame);
});

module.exports = BitmapMask;
