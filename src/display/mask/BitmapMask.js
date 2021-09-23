/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GameEvents = require('../../core/events');
var RenderEvents = require('../../renderer/events');

/**
 * @classdesc
 * A Bitmap Mask combines the alpha (opacity) of a masked pixel with the alpha of another pixel.
 * Unlike the Geometry Mask, which is a clipping path, a Bitmap Mask behaves like an alpha mask,
 * not a clipping path. It is only available when using the WebGL Renderer.
 *
 * A Bitmap Mask can use any Game Object to determine the alpha of each pixel of the masked Game Object(s).
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
 * @class BitmapMask
 * @memberof Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene which this Bitmap Mask will be used in.
 * @param {Phaser.GameObjects.GameObject} renderable - A renderable Game Object that uses a texture, such as a Sprite.
 */
var BitmapMask = new Class({

    initialize:

    function BitmapMask (scene, renderable)
    {
        var renderer = scene.sys.renderer;

        /**
         * A reference to either the Canvas or WebGL Renderer that this Mask is using.
         *
         * @name Phaser.Display.Masks.BitmapMask#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.11.0
         */
        this.renderer = renderer;

        /**
         * A renderable Game Object that uses a texture, such as a Sprite.
         *
         * @name Phaser.Display.Masks.BitmapMask#bitmapMask
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.bitmapMask = renderable;

        /**
         * The texture used for the masks framebuffer.
         *
         * @name Phaser.Display.Masks.BitmapMask#maskTexture
         * @type {WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.maskTexture = null;

        /**
         * The texture used for the main framebuffer.
         *
         * @name Phaser.Display.Masks.BitmapMask#mainTexture
         * @type {WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.mainTexture = null;

        /**
         * Whether the Bitmap Mask is dirty and needs to be updated.
         *
         * @name Phaser.Display.Masks.BitmapMask#dirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.dirty = true;

        /**
         * The framebuffer to which a masked Game Object is rendered.
         *
         * @name Phaser.Display.Masks.BitmapMask#mainFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.0.0
         */
        this.mainFramebuffer = null;

        /**
         * The framebuffer to which the Bitmap Mask's masking Game Object is rendered.
         *
         * @name Phaser.Display.Masks.BitmapMask#maskFramebuffer
         * @type {WebGLFramebuffer}
         * @since 3.0.0
         */
        this.maskFramebuffer = null;

        /**
         * Whether to invert the masks alpha.
         *
         * If `true`, the alpha of the masking pixel will be inverted before it's multiplied with the masked pixel.
         * Essentially, this means that a masked area will be visible only if the corresponding area in the mask is invisible.
         *
         * @name Phaser.Display.Masks.BitmapMask#invertAlpha
         * @type {boolean}
         * @since 3.1.2
         */
        this.invertAlpha = false;

        /**
         * Is this mask a stencil mask?
         *
         * @name Phaser.Display.Masks.BitmapMask#isStencil
         * @type {boolean}
         * @readonly
         * @since 3.17.0
         */
        this.isStencil = false;

        /**
         * The Scene which this Bitmap Mask will be used in.
         *
         * @name Phaser.Display.Masks.BitmapMask#scene
         * @type {Phaser.Scene}
         * @since 3.60.0
         */
        this.scene = scene;

        this.createMask();

        scene.sys.game.events.on(GameEvents.CONTEXT_RESTORED, this.createMask, this);

        if (renderer)
        {
            renderer.on(RenderEvents.RESIZE, this.createMask, this);
        }
    },

    /**
     * Creates the WebGL Texture2D objects and Framebuffers required for this
     * mask. If this mask has already been created, then `clearMask` is called first.
     *
     * @method Phaser.Display.Masks.BitmapMask#createMask
     * @since 3.50.0
     */
    createMask: function ()
    {
        var renderer = this.renderer;

        if (!renderer || !renderer.gl)
        {
            return;
        }

        if (this.mainTexture)
        {
            this.clearMask();
        }

        var width = renderer.width;
        var height = renderer.height;
        var pot = ((width & (width - 1)) === 0 && (height & (height - 1)) === 0);
        var gl = renderer.gl;
        var wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
        var filter = gl.LINEAR;

        this.mainTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
        this.maskTexture = renderer.createTexture2D(0, filter, filter, wrap, wrap, gl.RGBA, null, width, height);
        this.mainFramebuffer = renderer.createFramebuffer(width, height, this.mainTexture, true);
        this.maskFramebuffer = renderer.createFramebuffer(width, height, this.maskTexture, true);
    },

    /**
     * Deletes the `mainTexture` and `maskTexture` WebGL Textures and deletes
     * the `mainFramebuffer` and `maskFramebuffer` too, nulling all references.
     *
     * This is called when this mask is destroyed, or if you try to creat a new
     * mask from this object when one is already set.
     *
     * @method Phaser.Display.Masks.BitmapMask#clearMask
     * @since 3.50.0
     */
    clearMask: function ()
    {
        var renderer = this.renderer;

        if (!renderer || !renderer.gl || !this.mainTexture)
        {
            return;
        }

        renderer.deleteTexture(this.mainTexture);
        renderer.deleteTexture(this.maskTexture);
        renderer.deleteFramebuffer(this.mainFramebuffer);
        renderer.deleteFramebuffer(this.maskFramebuffer);

        this.mainTexture = null;
        this.maskTexture = null;
        this.mainFramebuffer = null;
        this.maskFramebuffer = null;
    },

    /**
     * Sets a new masking Game Object for the Bitmap Mask.
     *
     * @method Phaser.Display.Masks.BitmapMask#setBitmap
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} renderable - A renderable Game Object that uses a texture, such as a Sprite.
     */
    setBitmap: function (renderable)
    {
        this.bitmapMask = renderable;
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
     */
    postRenderWebGL: function (renderer, camera)
    {
        renderer.pipelines.BITMAPMASK_PIPELINE.endMask(this, camera);
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
        this.clearMask();

        this.scene.sys.game.events.off(GameEvents.CONTEXT_RESTORED, this.createMask, this);

        if (this.renderer)
        {
            this.renderer.off(RenderEvents.RESIZE, this.createMask, this);
        }

        this.bitmapMask = null;
        this.prevFramebuffer = null;
        this.renderer = null;
    }

});

module.exports = BitmapMask;
