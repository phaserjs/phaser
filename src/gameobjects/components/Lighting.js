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
     * @method Phaser.GameObjects.Components.Lighting#setLighting
     * @webglOnly
     * @since 3.90.0
     * @param {boolean} enable - `true` to use lighting, or `false` to disable it.
     */
    setLighting: function (enable)
    {
        if (!this.defaultRenderNodes)
        {
            // Cannot enable lighting without custom render nodes.
            return this;
        }

        if (enable)
        {
            this.lighting = true;
            this.setRenderNodeRole('Submitter', 'SubmitterImageLight');
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
