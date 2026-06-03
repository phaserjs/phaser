/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Phaser Tint Modes.
 *
 * Tint modes are used by the Tint component to determine how the tint color
 * is applied to the texture. The default mode is `MULTIPLY`.
 * They are only used in WebGL.
 *
 * @namespace Phaser.TintModes
 * @since 4.0.0
 */

module.exports = {

    /**
     * Multiply tint mode (default). The tint color is multiplied with the texture color.
     *
     * @name Phaser.TintModes.MULTIPLY
     * @type {number}
     * @const
     * @since 4.0.0
     */
    MULTIPLY: 0,

    /**
     * Fill tint mode. The tint color replaces the texture color,
     * but respects the texture alpha.
     *
     * You can use this mode to make a Game Object flash 'white' if hit by something.
     *
     * @name Phaser.TintModes.FILL
     * @type {number}
     * @const
     * @since 4.0.0
     */
    FILL: 1,

    /**
     * Additive tint mode. The tint color is added to the texture color,
     * but respects the texture alpha.
     *
     * @name Phaser.TintModes.ADD
     * @type {number}
     * @const
     * @since 4.0.0
     */
    ADD: 2,

    // Not included because there's no clear use case for it.
    // SUBTRACT: 3,

    /**
     * Screen tint mode. The tint color brightens dark areas of the texture.
     *
     * @name Phaser.TintModes.SCREEN
     * @type {number}
     * @const
     * @since 4.0.0
     */
    SCREEN: 4,

    /**
     * Overlay tint mode. The tint color brightens light areas and darkens dark areas.
     *
     * @name Phaser.TintModes.OVERLAY
     * @type {number}
     * @const
     * @since 4.0.0
     */
    OVERLAY: 5,

    /**
     * Hard light tint mode. The tint color brightens light areas and darkens dark areas.
     * This is like overlay, but with the tint color and texture color swapped.
     *
     * @name Phaser.TintModes.HARD_LIGHT
     * @type {number}
     * @const
     * @since 4.0.0
     */
    HARD_LIGHT: 6,

    /**
     * Double color multiply tint mode.
     * The tint color is multiplied with the texture color,
     * and the inverse of the texture color is multiplied by a second tint color.
     * This allows control of light and dark regions separately.
     *
     * @name Phaser.TintModes.MULTIPLY_TWO
     * @type {number}
     * @const
     * @since 4.NEXT
     */
    MULTIPLY_TWO: 7
};
