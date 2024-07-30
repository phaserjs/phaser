/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for enabling lighting effects on a Game Object.
 *
 * This should only be applied to GameObjects that have RenderNodes.
 *
 * @namespace Phaser.GameObjects.Components.Lighting
 * @webglOnly
 * @since 3.90.0
 */
var Lighting = {

    /**
     * Is this GameObject using lighting?
     *
     * This flag is read-only and cannot be changed directly.
     * Use the `setLighting` method to toggle lighting effects on or off.
     *
     * @name Phaser.GameObjects.Components.Lighting#lighting
     * @type {boolean}
     * @webglOnly
     * @since 3.90.0
     * @default false
     * @readonly
     */
    lighting: false,

    /**
     * Sets whether this GameObject should use lighting.
     *
     * This will assign the relevant RenderNodes to the GameObject.
     *
     * This method will override any custom RenderNode in the `Submitter` role,
     * either replacing it with the RenderNode in the `SubmitterLight` role,
     * or removing it if `enable` is `false`.
     * The `SubmitterLight` role is read from `customRenderNodes` first,
     * then from `defaultRenderNodes`.
     *
     * @method Phaser.GameObjects.Components.Lighting#setLighting
     * @webglOnly
     * @since 3.90.0
     * @param {boolean} enable - `true` to use lighting, or `false` to disable it.
     * @return {this} This Game Object instance.
     */
    setLighting: function (enable)
    {
        if (!this.defaultRenderNodes)
        {
            // Cannot enable lighting without the render nodes component.
            return this;
        }

        if (enable)
        {
            var submitterLight =
                this.customRenderNodes.SubmitterLight ||
                this.defaultRenderNodes.SubmitterLight;

            if (!submitterLight)
            {
                // Cannot enable lighting without the SubmitterLight role.
                return this;
            }

            this.lighting = true;
            this.setRenderNodeRole('Submitter', submitterLight);
        }
        else
        {
            this.lighting = false;
            this.setRenderNodeRole('Submitter', null);
        }

        return this;
    }
};

module.exports = Lighting;
