/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
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
 * GeometryMask is only supported in the Canvas Renderer.
 * If you want to use geometry to mask objects in WebGL,
 * see {@link Phaser.GameObjects.Components.FilterList#addMask}.
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

        geometryMask.renderCanvas(renderer, geometryMask, camera, null, null, true);

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
