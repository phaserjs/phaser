/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the FX values of a Game Object.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.FX
 * @webglOnly
 * @since 3.60.0
 */

var FX = {

    /**
     * The amount of extra padding to be applied to this Game Object
     * when it is being rendered by a SpriteFX Pipeline.
     *
     * Lots of FX require additional spacing added to the texture the
     * Game Object uses, for example a glow or shadow effect, and this
     * method allows you to control how much extra padding is included
     * in addition to the texture size.
     *
     * @name Phaser.GameObjects.Components.FX#fxPadding
     * @type {number}
     * @default 0
     * @since 3.60.0
     */
    fxPadding: 0,

    /**
     * Sets the amount of extra padding to be applied to this Game Object
     * when it is being rendered by a SpriteFX Pipeline.
     *
     * Lots of FX require additional spacing added to the texture the
     * Game Object uses, for example a glow or shadow effect, and this
     * method allows you to control how much extra padding is included
     * in addition to the texture size.
     *
     * @method Phaser.GameObjects.Components.FX#setFXPadding
     * @webglOnly
     * @since 3.60.0
     *
     * @param {number} [padding=0] - The amount of padding to add to the texture.
     *
     * @return {this} This Game Object instance.
     */
    setFXPadding: function (padding)
    {
        if (padding === undefined) { padding = 0; }

        this.fxPadding = padding;

        return this;
    },

    /**
     * This callback is invoked when this Game Object is copied by a SpriteFX Pipeline.
     *
     * This happens when the pipeline uses its `copySprite` method.
     *
     * It's invoked prior to the copy, allowing you to set shader uniforms, etc on the pipeline.
     *
     * @method Phaser.GameObjects.Components.FX#onFXCopy
     * @webglOnly
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline} pipeline - The SpriteFX Pipeline that invoked this callback.
     */
    onFXCopy: function ()
    {
    },

    /**
     * This callback is invoked when this Game Object is rendered by a SpriteFX Pipeline.
     *
     * This happens when the pipeline uses its `drawSprite` method.
     *
     * It's invoked prior to the draw, allowing you to set shader uniforms, etc on the pipeline.
     *
     * @method Phaser.GameObjects.Components.FX#onFX
     * @webglOnly
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline} pipeline - The SpriteFX Pipeline that invoked this callback.
     */
    onFX: function ()
    {
    }

};

module.exports = FX;
