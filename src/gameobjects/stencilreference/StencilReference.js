/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var BlendModes = require('../../renderer/BlendModes');
var Components = require('../components');
var GameObject = require('../GameObject');
var Render = require('./StencilReferenceRender');

/**
 * A StencilReference Game Object.
 *
 * A StencilReference is a special type of Game Object that uses a Stencil
 * as a reference for its own rendering. This allows you to re-render a Stencil
 * using different settings.
 *
 * For example, you can add a layer with a Stencil with some complex geometry,
 * draw objects affected by the stencil layer,
 * then use a StencilReference to subtract the same layer without recreating it.
 *
 * It is WebGL-only.
 *
 * A StencilReference temporarily changes the settings on the target Stencil,
 * then restores them after rendering.
 * Thus, it keeps the original Stencil's transforms.
 * The stencil options can be changed by setting the properties on this object.
 * Note that these properties will be set to default values,
 * so if you have configured the targetStencil with its own properties,
 * you should configure this with those properties as well,
 * altered to your requirements.
 *
 * See the {@link Phaser.GameObjects.Stencil} documentation for more details.
 *
 * @class StencilReference
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 4.NEXT
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.GameObjects.Stencil} targetStencil - The Stencil to use as a reference.
 * @param {Phaser.Types.GameObjects.Stencil.StencilOptions} [options] - The options for the StencilReference.
 */
var StencilReference = new Class({
    Extends: GameObject,

    Mixins: [
        Components.Visible,
        Render
    ],

    initialize: function StencilReference(scene, targetStencil, options) {
        GameObject.call(this, scene, 'StencilReference');

        /**
         * The Stencil to use as a reference.
         *
         * @name Phaser.GameObjects.StencilReference#targetStencil
         * @type {Phaser.GameObjects.Stencil}
         * @since 4.NEXT
         */
        this.targetStencil = targetStencil;

        var options = options || {};
        var stencilAlphaStrategy = options.stencilAlphaStrategy;
        var stencilClearValue = options.stencilClearValue || 0;
        var stencilCompositeCheck = options.stencilCompositeCheck;
        var stencilInvert = options.stencilInvert || false;
        var stencilLayerMode = options.stencilLayerMode || 'addLayer';
        var stencilValueWrap = options.stencilValueWrap === undefined ? true : options.stencilValueWrap;
        if (stencilAlphaStrategy === undefined)
        {
            stencilAlphaStrategy = scene.renderer.config.stencilAlphaStrategy;
        }
        if (stencilCompositeCheck === undefined)
        {
            stencilCompositeCheck = 'auto';
        }

        /**
         * The mode to use when rendering the stencil.
         *
         * - 'addLayer' - Add a stencil layer.
         * - 'subtractLayer' - Subtract a stencil layer.
         * - 'clear' - Clear the stencil buffer.
         * - 'clearRegion' - Clear a region of the stencil buffer.
         *
         * @name Phaser.GameObjects.StencilReference#stencilLayerMode
         * @type {Phaser.Types.GameObjects.Stencil.StencilLayerMode}
         * @default 'addLayer'
         * @since 4.NEXT
         */
        this.stencilLayerMode = stencilLayerMode;

        /**
         * Whether to invert the stencil, using an extra draw call.
         *
         * @name Phaser.GameObjects.StencilReference#stencilInvert
         * @type {boolean}
         * @default false
         * @since 4.NEXT
         */
        this.stencilInvert = stencilInvert;

        /**
         * The alpha strategy to use when rendering the stencil.
         * This is usually set to `dither`, or the default game config setting.
         *
         * @name Phaser.GameObjects.StencilReference#stencilAlphaStrategy
         * @type {Phaser.Types.Renderer.WebGL.AlphaStrategy}
         * @since 4.NEXT
         */
        this.stencilAlphaStrategy = stencilAlphaStrategy;

        /**
         * Whether to composite the contents of the stencil to a framebuffer.
         * This is necessary when the stencil contains stencils.
         * It requires extra draw calls to composite.
         * You should set this to `false` or `true` if you know the answer,
         * or `auto` to have Phaser automatically determine the best option.
         *
         * This will set `filtersForceComposite` to `true` during rendering.
         *
         * @name Phaser.GameObjects.StencilReference#stencilCompositeCheck
         * @type {boolean|'auto'}
         * @default 'auto'
         * @since 4.NEXT
         */
        this.stencilCompositeCheck = stencilCompositeCheck;

        /**
         * The value to clear the stencil buffer to,
         * if the `stencilLayerMode` is `clear` or `clearRegion`.
         * Must be between 0 and 255.
         *
         * @name Phaser.GameObjects.StencilReference#stencilClearValue
         * @type {number}
         * @default 0
         * @since 4.NEXT
         */
        this.stencilClearValue = stencilClearValue;

        /**
         * Whether to wrap the value in the stencil buffer when it overflows or underflows
         * when using the `addLayer` or `subtractLayer` mode.
         * This is useful when defining stencils with subtraction,
         * and you don't want to underflow from 0 to 255.
         *
         * @name Phaser.GameObjects.StencilReference#stencilValueWrap
         * @type {boolean}
         * @default true
         * @since 4.NEXT
         */
        this.stencilValueWrap = stencilValueWrap;
    },

    /**
     * Whether this Game Object is a stencil modifier.
     * Do not edit this property. It is used internally.
     *
     * Any object with `isStencilModifier` set to `true` is a positive result
     * for `Stencil#hasStencilChildren`, and can affect stencil compositing.
     *
     * @name Phaser.GameObjects.StencilReference#isStencilModifier
     * @type {boolean}
     * @since 4.NEXT
     * @readonly
     * @default true
     */
    isStencilModifier: {
        get: function() {
            return true;
        },
        set: function(value) {
            // Do nothing
        }
    },

    /**
     * The blend mode to use when rendering the stencil reference.
     * This is read-only, and is only used for internal compliance.
     * Stencil drawing uses its own combination rules.
     *
     * @name Phaser.GameObjects.StencilReference#blendMode
     * @type {Phaser.BlendModes}
     * @since 4.NEXT
     * @readonly
     * @default Phaser.BlendModes.SKIP_CHECK
     */
    blendMode: {
        get: function() {
            return BlendModes.SKIP_CHECK;
        },
        set: function(value) {
            // Do nothing
        }
    }
});

module.exports = StencilReference;
