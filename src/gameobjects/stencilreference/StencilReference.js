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
 * @classdesc
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
 * @extends Phaser.GameObjects.Components.StencilModifier
 * @extends Phaser.GameObjects.Components.Visible
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
        Components.StencilModifier,
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

        if (options)
        {
            if (options.stencilAlphaStrategy !== undefined)
            {
                this.stencilAlphaStrategy = options.stencilAlphaStrategy;
            }
            else
            {
                this.stencilAlphaStrategy = scene.renderer.config.stencilAlphaStrategy;
            }
            if (options.stencilClearValue !== undefined)
            {
                this.stencilClearValue = options.stencilClearValue;
            }
            if (options.stencilCompositeCheck !== undefined)
            {
                this.stencilCompositeCheck = options.stencilCompositeCheck;
            }
            if (options.stencilInvert !== undefined)
            {
                this.stencilInvert = options.stencilInvert;
            }
            if (options.stencilLayerMode !== undefined)
            {
                this.stencilLayerMode = options.stencilLayerMode;
            }
            if (options.stencilValueWrap !== undefined)
            {
                this.stencilValueWrap = options.stencilValueWrap;
            }
        }
        else
        {
            this.stencilAlphaStrategy = scene.renderer.config.stencilAlphaStrategy;
        }
    },

    /**
     * The blend mode to use when rendering the stencil reference.
     * This is read-only, and is only used for internal compliance.
     * Stencil drawing uses its own combination rules.
     *
     * @name Phaser.GameObjects.StencilReference#blendMode
     * @type {number}
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
    },

    /**
     * Pre-destroy callback.
     * @method Phaser.GameObjects.StencilReference#preDestroy
     * @since 4.NEXT
     */
    preDestroy: function()
    {
        this.targetStencil = null;
    }
});

module.exports = StencilReference;
