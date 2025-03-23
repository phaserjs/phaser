/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for enabling lighting effects on a Game Object.
 *
 * This should only be applied to GameObjects that have RenderNodes.
 *
 * @namespace Phaser.GameObjects.Components.Lighting
 * @webglOnly
 * @since 4.0.0
 */
var Lighting = {

    /**
     * Should this GameObject use lighting?
     *
     * This flag is used to set up WebGL shaders for rendering.
     *
     * @name Phaser.GameObjects.Components.Lighting#lighting
     * @type {boolean}
     * @webglOnly
     * @since 4.0.0
     * @default false
     * @readonly
     */
    lighting: false,

    /**
     * Should this GameObject use self-shadowing?
     * Self-shadowing is only enabled if `lighting` is enabled.
     *
     * The game config option `render.selfShadow` is used if this is not a boolean.
     *
     * This flag is used to set up WebGL shaders for rendering.
     *
     * @name Phaser.GameObjects.Components.Lighting#selfShadow
     * @type {{ enabled: boolean, penumbra: number, diffuseFlatThreshold: number }}
     * @webglOnly
     * @since 4.0.0
     */
    selfShadow: {
        enabled: null,
        penumbra: 0.5,
        diffuseFlatThreshold: 1 / 3
    },

    /**
     * Sets whether this GameObject should use lighting.
     *
     * @method Phaser.GameObjects.Components.Lighting#setLighting
     * @webglOnly
     * @since 4.0.0
     * @param {boolean} enable - `true` to use lighting, or `false` to disable it.
     * @return {this} This GameObject instance.
     */
    setLighting: function (enable)
    {
        this.lighting = enable;

        return this;
    },

    /**
     * Sets whether this GameObject should use self-shadowing.
     * Self-shadowing is only enabled if `lighting` is also enabled.
     *
     * @method Phaser.GameObjects.Components.Lighting#setSelfShadow
     * @webglOnly
     * @since 4.0.0
     * @param {?boolean} [enabled] - `true` to use self-shadowing, `false` to disable it, `null` to use the game default from `config.render.selfShadow`, or `undefined` to keep the setting.
     * @param {number} [penumbra] - The penumbra value for the shadow. Lower is sharper but more jagged. Default is 0.5.
     * @param {number} [diffuseFlatThreshold] - The texture brightness threshold at which the diffuse lighting will be considered flat. Range is 0-1. Default is 1/3.
     * @return {this} This GameObject instance.
     */
    setSelfShadow: function (enabled, penumbra, diffuseFlatThreshold)
    {
        if (enabled !== undefined)
        {
            if (enabled === null)
            {
                this.selfShadow.enabled = this.scene.sys.game.config.selfShadow;
            }
            else
            {
                this.selfShadow.enabled = enabled;
            }
        }

        if (penumbra !== undefined)
        {
            this.selfShadow.penumbra = penumbra;
        }

        if (diffuseFlatThreshold !== undefined)
        {
            this.selfShadow.diffuseFlatThreshold = diffuseFlatThreshold;
        }

        return this;
    }
};

module.exports = Lighting;
