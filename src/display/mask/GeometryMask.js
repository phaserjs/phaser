/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A Geometry Mask can be applied to a Game Object to hide any pixels of it which don't intersect
 * a visible pixel from the geometry mask. The mask is essentially a clipping path which can only
 * make a masked pixel fully visible or fully invisible without changing its alpha (opacity).
 *
 * A Geometry Mask uses a Graphics Game Object to determine which pixels of the masked Game Object(s)
 * should be clipped. For any given point of a masked Game Object's texture, the pixel will only be displayed
 * if the Graphics Game Object of the Geometry Mask has a visible pixel at the same position. The color and
 * alpha of the pixel from the Geometry Mask do not matter.
 *
 * The Geometry Mask's location matches the location of its Graphics object, not the location of the masked objects.
 * Moving or transforming the underlying Graphics object will change the mask (and affect the visibility
 * of any masked objects), whereas moving or transforming a masked object will not affect the mask.
 * You can think of the Geometry Mask (or rather, of its Graphics object) as an invisible curtain placed
 * in front of all masked objects which has its own visual properties and, naturally, respects the camera's
 * visual properties, but isn't affected by and doesn't follow the masked objects by itself.
 *
 * @class GeometryMask
 * @memberof Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - This parameter is not used.
 * @param {Phaser.GameObjects.Graphics} graphicsGeometry - The Graphics Game Object to use for the Geometry Mask. Doesn't have to be in the Display List.
 */
var GeometryMask = new Class({

    initialize:

    function GeometryMask (scene, graphicsGeometry)
    {
        /**
         * The Graphics object which describes the Geometry Mask.
         *
         * @name Phaser.Display.Masks.GeometryMask#geometryMask
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.0.0
         */
        this.geometryMask = graphicsGeometry;

        /**
         * Similar to the BitmapMasks invertAlpha setting this to true will then hide all pixels
         * drawn to the Geometry Mask.
         *
         * @name Phaser.Display.Masks.GeometryMask#invertAlpha
         * @type {boolean}
         * @since 3.16.0
         */
        this.invertAlpha = false;

        /**
         * Is this mask a stencil mask?
         *
         * @name Phaser.Display.Masks.GeometryMask#isStencil
         * @type {boolean}
         * @readonly
         * @since 3.17.0
         */
        this.isStencil = true;

        /**
         * The current stencil level.
         *
         * @name Phaser.Display.Masks.GeometryMask#level
         * @type {boolean}
         * @private
         * @since 3.17.0
         */
        this.level = 0;
    },

    /**
     * Sets a new Graphics object for the Geometry Mask.
     *
     * @method Phaser.Display.Masks.GeometryMask#setShape
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphicsGeometry - The Graphics object which will be used for the Geometry Mask.
     * 
     * @return {this} This Geometry Mask
     */
    setShape: function (graphicsGeometry)
    {
        this.geometryMask = graphicsGeometry;

        return this;
    },

    /**
     * Sets the `invertAlpha` property of this Geometry Mask.
     * Inverting the alpha essentially flips the way the mask works.
     *
     * @method Phaser.Display.Masks.GeometryMask#setInvertAlpha
     * @since 3.17.0
     *
     * @param {boolean} [value=true] - Invert the alpha of this mask?
     * 
     * @return {this} This Geometry Mask
     */
    setInvertAlpha: function (value)
    {
        if (value === undefined) { value = true; }

        this.invertAlpha = value;

        return this;
    },

    /**
     * Renders the Geometry Mask's underlying Graphics object to the OpenGL stencil buffer and enables the stencil test, which clips rendered pixels according to the mask.
     *
     * @method Phaser.Display.Masks.GeometryMask#preRenderWebGL
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to draw to.
     * @param {Phaser.GameObjects.GameObject} child - The Game Object being rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera the Game Object is being rendered through.
     */
    preRenderWebGL: function (renderer, child, camera)
    {
        var gl = renderer.gl;

        //  Force flushing before drawing to stencil buffer
        renderer.flush();

        if (renderer.maskStack.length === 0)
        {
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);

            renderer.maskCount = 0;
        }

        if (renderer.currentCameraMask.mask !== this)
        {
            renderer.currentMask.mask = this;
        }

        renderer.maskStack.push({ mask: this, camera: camera });

        this.applyStencil(renderer, camera, true);

        renderer.maskCount++;
    },

    /**
     * Applies the current stencil mask to the renderer.
     *
     * @method Phaser.Display.Masks.GeometryMask#applyStencil
     * @since 3.17.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to draw to.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera the Game Object is being rendered through.
     * @param {boolean} inc - Is this an INCR stencil or a DECR stencil?
     */
    applyStencil: function (renderer, camera, inc)
    {
        var gl = renderer.gl;
        var geometryMask = this.geometryMask;
        var level = renderer.maskCount;

        gl.colorMask(false, false, false, false);

        if (inc)
        {
            gl.stencilFunc(gl.EQUAL, level, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
        }

        //  Write stencil buffer
        geometryMask.renderWebGL(renderer, geometryMask, 0, camera);

        renderer.flush();

        gl.colorMask(true, true, true, true);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

        if (inc)
        {
            if (this.invertAlpha)
            {
                gl.stencilFunc(gl.NOTEQUAL, level + 1, 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
            }
        }
        else if (this.invertAlpha)
        {
            gl.stencilFunc(gl.NOTEQUAL, level, 0xFF);
        }
        else
        {
            gl.stencilFunc(gl.EQUAL, level, 0xFF);
        }
    },

    /**
     * Flushes all rendered pixels and disables the stencil test of a WebGL context, thus disabling the mask for it.
     *
     * @method Phaser.Display.Masks.GeometryMask#postRenderWebGL
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to draw flush.
     */
    postRenderWebGL: function (renderer)
    {
        var gl = renderer.gl;

        renderer.maskStack.pop();

        renderer.maskCount--;

        if (renderer.maskStack.length === 0)
        {
            //  If this is the only mask in the stack, flush and disable
            renderer.flush();

            renderer.currentMask.mask = null;

            gl.disable(gl.STENCIL_TEST);
        }
        else
        {
            //  Force flush before disabling stencil test
            renderer.flush();

            var prev = renderer.maskStack[renderer.maskStack.length - 1];

            prev.mask.applyStencil(renderer, prev.camera, false);

            if (renderer.currentCameraMask.mask !== prev.mask)
            {
                renderer.currentMask.mask = prev.mask;
                renderer.currentMask.camera = prev.camera;
            }
            else
            {
                renderer.currentMask.mask = null;
            }
        }
    },

    /**
     * Sets the clipping path of a 2D canvas context to the Geometry Mask's underlying Graphics object.
     *
     * @method Phaser.Display.Masks.GeometryMask#preRenderCanvas
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - The Canvas Renderer instance to set the clipping path on.
     * @param {Phaser.GameObjects.GameObject} mask - The Game Object being rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera the Game Object is being rendered through.
     */
    preRenderCanvas: function (renderer, mask, camera)
    {
        var geometryMask = this.geometryMask;

        renderer.currentContext.save();

        geometryMask.renderCanvas(renderer, geometryMask, 0, camera, null, null, true);

        renderer.currentContext.clip();
    },

    /**
     * Restore the canvas context's previous clipping path, thus turning off the mask for it.
     *
     * @method Phaser.Display.Masks.GeometryMask#postRenderCanvas
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - The Canvas Renderer instance being restored.
     */
    postRenderCanvas: function (renderer)
    {
        renderer.currentContext.restore();
    },

    /**
     * Destroys this GeometryMask and nulls any references it holds.
     *
     * Note that if a Game Object is currently using this mask it will _not_ automatically detect you have destroyed it,
     * so be sure to call `clearMask` on any Game Object using it, before destroying it.
     *
     * @method Phaser.Display.Masks.GeometryMask#destroy
     * @since 3.7.0
     */
    destroy: function ()
    {
        this.geometryMask = null;
    }

});

module.exports = GeometryMask;
