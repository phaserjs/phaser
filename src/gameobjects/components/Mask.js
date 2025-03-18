/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const');
var GeometryMask = require('../../display/mask/GeometryMask');

/**
 * Provides methods used for getting and setting the mask of a Game Object.
 *
 * This only works under the Canvas Renderer.
 * For WebGL, see {@link Phaser.GameObjects.Components.FilterList#addMask}.
 *
 * @namespace Phaser.GameObjects.Components.Mask
 * @since 3.0.0
 */

var Mask = {

    /**
     * The Mask this Game Object is using during render.
     *
     * @name Phaser.GameObjects.Components.Mask#mask
     * @type {Phaser.Display.Masks.GeometryMask}
     * @since 3.0.0
     */
    mask: null,

    /**
     * Sets the mask that this Game Object will use to render with.
     *
     * The mask must have been previously created and must be a GeometryMask.
     * This only works in the Canvas Renderer.
     * In WebGL, use a Mask filter instead (see {@link Phaser.GameObjects.Components.FilterList#addMask}).
     *
     * If a mask is already set on this Game Object it will be immediately replaced.
     *
     * Masks are positioned in global space and are not relative to the Game Object to which they
     * are applied. The reason for this is that multiple Game Objects can all share the same mask.
     *
     * Masks have no impact on physics or input detection. They are purely a rendering component
     * that allows you to limit what is visible during the render pass.
     *
     * @method Phaser.GameObjects.Components.Mask#setMask
     * @since 3.6.2
     *
     * @param {Phaser.Display.Masks.GeometryMask} mask - The mask this Game Object will use when rendering.
     *
     * @return {this} This Game Object instance.
     */
    setMask: function (mask)
    {
        if (this.scene.renderer.type === CONST.WEBGL)
        {
            console.warn('Phaser.GameObjects.Components.Mask.setMask: This method is not supported in WebGL. Create a Mask filter instead.');
            return this;
        }

        this.mask = mask;

        return this;
    },

    /**
     * Clears the mask that this Game Object was using.
     *
     * This only works in the Canvas Renderer.
     * In WebGL, use a Mask filter instead (see {@link Phaser.GameObjects.Components.FilterList#addMask}).
     *
     * @method Phaser.GameObjects.Components.Mask#clearMask
     * @since 3.6.2
     *
     * @param {boolean} [destroyMask=false] - Destroy the mask before clearing it?
     *
     * @return {this} This Game Object instance.
     */
    clearMask: function (destroyMask)
    {
        if (destroyMask === undefined) { destroyMask = false; }

        if (destroyMask && this.mask)
        {
            this.mask.destroy();
        }

        this.mask = null;

        return this;
    },

    /**
     * Creates and returns a Geometry Mask. This mask can be used by any Game Object,
     * including this one.
     *
     * To create the mask you need to pass in a reference to a Graphics Game Object.
     *
     * If you do not provide a graphics object, and this Game Object is an instance
     * of a Graphics object, then it will use itself to create the mask.
     *
     * This means you can call this method to create a Geometry Mask from any Graphics Game Object.
     *
     * This only works in the Canvas Renderer.
     * In WebGL, use a Mask filter instead (see {@link Phaser.GameObjects.Components.FilterList#addMask}).
     *
     * @method Phaser.GameObjects.Components.Mask#createGeometryMask
     * @since 3.6.2
     *
     * @generic {Phaser.GameObjects.Graphics} G
     * @generic {Phaser.GameObjects.Shape} S
     * @genericUse {(G|S)} [graphics]
     *
     * @param {Phaser.GameObjects.Graphics|Phaser.GameObjects.Shape} [graphics] - A Graphics Game Object, or any kind of Shape Game Object. The geometry within it will be used as the mask.
     *
     * @return {Phaser.Display.Masks.GeometryMask} This Geometry Mask that was created.
     */
    createGeometryMask: function (graphics)
    {
        if (graphics === undefined && (this.type === 'Graphics' || this.geom))
        {
            // eslint-disable-next-line consistent-this
            graphics = this;
        }

        return new GeometryMask(this.scene, graphics);
    }

};

module.exports = Mask;
