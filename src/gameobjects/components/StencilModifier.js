/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for modifying the stencil buffer.
 * This component is mixed in to Game Objects that can modify the stencil buffer,
 * such as Stencil and StencilReference.
 *
 * StencilModifier objects are assumed to draw to the stencil buffer.
 * The `isStencilModifier` property is checked to determine whether
 * extra compositing steps are necessary within other StencilModifier objects.
 *
 * @namespace Phaser.GameObjects.Components.StencilModifier
 * @since 4.2.0
 */

var StencilModifier = {
    /**
     * The mode to use when rendering the stencil.
     *
     * - 'addLayer' - Add a stencil layer.
     * - 'subtractLayer' - Subtract a stencil layer.
     * - 'clear' - Clear the stencil buffer.
     * - 'clearRegion' - Clear a region of the stencil buffer.
     *
     * @name Phaser.GameObjects.Components.StencilModifier#stencilLayerMode
     * @since 4.2.0
     * @type {Phaser.Types.GameObjects.Stencil.StencilLayerMode}
     * @default 'addLayer'
     */
    stencilLayerMode: 'addLayer',

    /**
     * Whether to invert the stencil, using an extra draw call.
     *
     * @name Phaser.GameObjects.Components.StencilModifier#stencilInvert
     * @since 4.2.0
     * @type {boolean}
     * @default false
     */
    stencilInvert: false,

    /**
     * The alpha strategy to use when rendering the stencil.
     * This is usually set to `dither`, or the default game config setting.
     *
     * @name Phaser.GameObjects.Components.StencilModifier#stencilAlphaStrategy
     * @since 4.2.0
     * @type {Phaser.Types.Renderer.WebGL.AlphaStrategy}
     * @default 'dither'
     */
    stencilAlphaStrategy: 'dither',

    /**
     * Whether to composite the contents of the stencil to a framebuffer.
     * This is necessary when the stencil contains stencils.
     * It requires extra draw calls to composite.
     * You should set this to `false` or `true` if you know the answer,
     * or `auto` to have Phaser automatically determine the best option.
     *
     * This will set `filtersForceComposite` to `true` during rendering.
     *
     * @name Phaser.GameObjects.Components.StencilModifier#stencilCompositeCheck
     * @since 4.2.0
     * @type {boolean|'auto'}
     * @default 'auto'
     */
    stencilCompositeCheck: 'auto',

    /**
     * The value to clear the stencil buffer to,
     * if the `stencilLayerMode` is `clear` or `clearRegion`.
     * Should be between 0 and 255, as the buffer is 8 bits.
     *
     * @name Phaser.GameObjects.Components.StencilModifier#stencilClearValue
     * @since 4.2.0
     * @type {number}
     * @default 0
     */
    stencilClearValue: 0,

    /**
     * Whether to wrap the value in the stencil buffer when it overflows or underflows
     * when using the `addLayer` or `subtractLayer` mode.
     * This is useful when defining stencils with subtraction,
     * and you don't want to underflow from 0 to 255.
     *
     * @name Phaser.GameObjects.Components.StencilModifier#stencilValueWrap
     * @since 4.2.0
     * @type {boolean}
     * @default true
     */
    stencilValueWrap: true,

    /**
     * Whether this Game Object is a stencil modifier.
     * Do not edit this property. It is used internally.
     *
     * Any object with `isStencilModifier` set to `true` is a positive result
     * for `hasStencilChildren`, and can affect stencil compositing.
     *
     * @name Phaser.GameObjects.Components.StencilModifier#isStencilModifier
     * @since 4.2.0
     * @type {boolean}
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
     * Sets the alpha strategy to use when rendering the stencil.
     *
     * @method Phaser.GameObjects.Components.StencilModifier#setStencilAlphaStrategy
     * @since 4.2.0
     * @param {Phaser.Types.Renderer.WebGL.AlphaStrategy} stencilAlphaStrategy - The alpha strategy to use when rendering the stencil.
     * @returns {this} This Game Object instance.
     */
    setStencilAlphaStrategy: function (stencilAlphaStrategy)
    {
        this.stencilAlphaStrategy = stencilAlphaStrategy;
        return this;
    },

    /**
     * Sets the value to clear the stencil to,
     * if the `stencilLayerMode` is `clear` or `clearRegion`.
     * Should be between 0 and 255, as the buffer is 8 bits.
     *
     * @method Phaser.GameObjects.Components.StencilModifier#setStencilClearValue
     * @since 4.2.0
     * @param {number} stencilClearValue - The value to clear the stencil buffer to.
     * @returns {this} This Game Object instance.
     */
    setStencilClearValue: function (stencilClearValue)
    {
        this.stencilClearValue = stencilClearValue;
        return this;
    },

    /**
     * Sets whether to composite the contents of the stencil to a framebuffer.
     * While `auto` is default, it must run extra checks,
     * so you should set it to `true` or `false` if you know the answer.
     *
     * - `true` - Composite the contents of the stencil to a framebuffer.
     * - `false` - Do not composite the contents of the stencil to a framebuffer.
     * - `'auto'` - Automatically determine whether to composite the contents of the stencil to a framebuffer.
     *
     * @method Phaser.GameObjects.Components.StencilModifier#setStencilCompositeCheck
     * @since 4.2.0
     * @param {boolean|'auto'} stencilCompositeCheck - The check mode to use.
     * @returns {this} This Game Object instance.
     */
    setStencilCompositeCheck: function (stencilCompositeCheck)
    {
        this.stencilCompositeCheck = stencilCompositeCheck;
        return this;
    },

    /**
     * Sets whether to invert the stencil, using an extra draw call.
     *
     * @method Phaser.GameObjects.Components.StencilModifier#setStencilInvert
     * @since 4.2.0
     * @param {boolean} stencilInvert - Whether to invert the stencil.
     * @returns {this} This Game Object instance.
     */
    setStencilInvert: function (stencilInvert)
    {
        this.stencilInvert = stencilInvert;
        return this;
    },

    /**
     * Sets the mode to use when rendering the stencil.
     *
     * - 'addLayer' - Add a stencil layer.
     * - 'subtractLayer' - Subtract a stencil layer.
     * - 'clear' - Clear the whole stencil buffer.
     * - 'clearRegion' - Clear a specific region of the stencil buffer.
     *   You can also use this to fill a region with a specific value.
     *
     * @method Phaser.GameObjects.Components.StencilModifier#setStencilLayerMode
     * @since 4.2.0
     * @param {Phaser.Types.GameObjects.Stencil.StencilLayerMode} stencilLayerMode - The mode which the Stencil should run in.
     * @returns {this} This Game Object instance.
     */
    setStencilLayerMode: function (stencilLayerMode)
    {
        this.stencilLayerMode = stencilLayerMode;
        return this;
    },

    /**
     * Sets whether to wrap the value in the stencil buffer when it overflows or underflows.
     * This is useful when defining stencils with subtraction,
     * and you don't want to underflow from 0 to 255.
     *
     * @method Phaser.GameObjects.Components.StencilModifier#setStencilValueWrap
     * @since 4.2.0
     * @param {boolean} stencilValueWrap - Whether to wrap the value in the stencil buffer when it overflows or underflows.
     * @returns {this} This Game Object instance.
     */
    setStencilValueWrap: function (stencilValueWrap)
    {
        this.stencilValueWrap = stencilValueWrap;
        return this;
    }
};

module.exports = StencilModifier;
