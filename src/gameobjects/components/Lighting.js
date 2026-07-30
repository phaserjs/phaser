/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for enabling WebGL-based per-pixel lighting effects on a Game Object,
 * using normal maps to simulate surface depth under dynamic light sources.
 *
 * When lighting is enabled, the Game Object will respond to lights added to the scene
 * via the Lights plugin. This component also supports self-shadowing, which creates
 * contact shadows on the surface based on the object's normal map.
 *
 * This component should only be applied to Game Objects that have RenderNodes, and
 * requires the WebGL renderer. It has no effect in Canvas rendering mode.
 *
 * @namespace Phaser.GameObjects.Components.Lighting
 * @webglOnly
 * @since 4.0.0
 */
var Lighting = {

    /**
     * Controls whether this Game Object participates in the WebGL lighting system.
     * When `true`, the object will respond to dynamic lights added via the Lights plugin,
     * using normal maps to calculate per-pixel diffuse lighting.
     *
     * This flag is used to select the appropriate WebGL shader at render time.
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
     * Configuration object controlling self-shadowing for this Game Object.
     * Self-shadowing causes surfaces to cast contact shadows on themselves based on
     * the normal map, giving the appearance of depth. It is only active when
     * `lighting` is also enabled.
     *
     * If `enabled` is `null`, the value from the game config option `render.selfShadow`
     * is used instead.
     *
     * This object is used to select and configure the appropriate WebGL shader at render time.
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
     * Enables or disables WebGL-based per-pixel lighting for this Game Object.
     * When enabled, the object will respond to dynamic lights added to the scene
     * via the Lights plugin, using a normal map for lighting calculations.
     * Disabling lighting restores the standard unlit rendering path.
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
     * Configures the self-shadowing properties of this Game Object.
     * Self-shadowing uses the normal map to cast contact shadows on the surface itself,
     * giving the impression of depth and raised detail. It is only active when
     * `lighting` is also enabled on this Game Object.
     *
     * Parameters that are `undefined` are left unchanged, allowing partial updates.
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
