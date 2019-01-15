/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser Blend Modes.
 * 
 * @name Phaser.BlendModes
 * @enum {integer}
 * @memberof Phaser
 * @readonly
 * @since 3.0.0
 */

module.exports = {

    /**
     * Skips the Blend Mode check in the renderer.
     * 
     * @name Phaser.BlendModes.SKIP_CHECK
     */
    SKIP_CHECK: -1,

    /**
     * Normal blend mode. For Canvas and WebGL.
     * This is the default setting and draws new shapes on top of the existing canvas content.
     * 
     * @name Phaser.BlendModes.NORMAL
     */
    NORMAL: 0,

    /**
     * Add blend mode. For Canvas and WebGL.
     * Where both shapes overlap the color is determined by adding color values.
     * 
     * @name Phaser.BlendModes.ADD
     */
    ADD: 1,

    /**
     * Multiply blend mode. For Canvas and WebGL.
     * The pixels are of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.
     * 
     * @name Phaser.BlendModes.MULTIPLY
     */
    MULTIPLY: 2,

    /**
     * Screen blend mode. For Canvas and WebGL.
     * The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)
     * 
     * @name Phaser.BlendModes.SCREEN
     */
    SCREEN: 3,

    /**
     * Overlay blend mode. For Canvas only.
     * A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.
     * 
     * @name Phaser.BlendModes.OVERLAY
     */
    OVERLAY: 4,

    /**
     * Darken blend mode. For Canvas only.
     * Retains the darkest pixels of both layers.
     * 
     * @name Phaser.BlendModes.DARKEN
     */
    DARKEN: 5,

    /**
     * Lighten blend mode. For Canvas only.
     * Retains the lightest pixels of both layers.
     * 
     * @name Phaser.BlendModes.LIGHTEN
     */
    LIGHTEN: 6,

    /**
     * Color Dodge blend mode. For Canvas only.
     * Divides the bottom layer by the inverted top layer.
     * 
     * @name Phaser.BlendModes.COLOR_DODGE
     */
    COLOR_DODGE: 7,

    /**
     * Color Burn blend mode. For Canvas only.
     * Divides the inverted bottom layer by the top layer, and then inverts the result.
     * 
     * @name Phaser.BlendModes.COLOR_BURN
     */
    COLOR_BURN: 8,

    /**
     * Hard Light blend mode. For Canvas only.
     * A combination of multiply and screen like overlay, but with top and bottom layer swapped.
     * 
     * @name Phaser.BlendModes.HARD_LIGHT
     */
    HARD_LIGHT: 9,

    /**
     * Soft Light blend mode. For Canvas only.
     * A softer version of hard-light. Pure black or white does not result in pure black or white.
     * 
     * @name Phaser.BlendModes.SOFT_LIGHT
     */
    SOFT_LIGHT: 10,

    /**
     * Difference blend mode. For Canvas only.
     * Subtracts the bottom layer from the top layer or the other way round to always get a positive value.
     * 
     * @name Phaser.BlendModes.DIFFERENCE
     */
    DIFFERENCE: 11,

    /**
     * Exclusion blend mode. For Canvas only.
     * Like difference, but with lower contrast.
     * 
     * @name Phaser.BlendModes.EXCLUSION
     */
    EXCLUSION: 12,

    /**
     * Hue blend mode. For Canvas only.
     * Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.
     * 
     * @name Phaser.BlendModes.HUE
     */
    HUE: 13,

    /**
     * Saturation blend mode. For Canvas only.
     * Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.
     * 
     * @name Phaser.BlendModes.SATURATION
     */
    SATURATION: 14,

    /**
     * Color blend mode. For Canvas only.
     * Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.
     * 
     * @name Phaser.BlendModes.COLOR
     */
    COLOR: 15,

    /**
     * Luminosity blend mode. For Canvas only.
     * Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.
     * 
     * @name Phaser.BlendModes.LUMINOSITY
     */
    LUMINOSITY: 16,

    /**
     * Alpha erase blend mode. For Canvas and WebGL.
     * 
     * @name Phaser.BlendModes.ERASE
     */
    ERASE: 17,

    /**
     * Source-in blend mode. For Canvas only.
     * The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.
     * 
     * @name Phaser.BlendModes.SOURCE_IN
     */
    SOURCE_IN: 18,

    /**
     * Source-out blend mode. For Canvas only.
     * The new shape is drawn where it doesn't overlap the existing canvas content.
     * 
     * @name Phaser.BlendModes.SOURCE_OUT
     */
    SOURCE_OUT: 19,

    /**
     * Source-out blend mode. For Canvas only.
     * The new shape is only drawn where it overlaps the existing canvas content.
     * 
     * @name Phaser.BlendModes.SOURCE_ATOP
     */
    SOURCE_ATOP: 20,

    /**
     * Destination-over blend mode. For Canvas only.
     * New shapes are drawn behind the existing canvas content.
     * 
     * @name Phaser.BlendModes.DESTINATION_OVER
     */
    DESTINATION_OVER: 21,

    /**
     * Destination-in blend mode. For Canvas only.
     * The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent.
     * 
     * @name Phaser.BlendModes.DESTINATION_IN
     */
    DESTINATION_IN: 22,

    /**
     * Destination-out blend mode. For Canvas only.
     * The existing content is kept where it doesn't overlap the new shape.
     * 
     * @name Phaser.BlendModes.DESTINATION_OUT
     */
    DESTINATION_OUT: 23,

    /**
     * Destination-out blend mode. For Canvas only.
     * The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.
     * 
     * @name Phaser.BlendModes.DESTINATION_ATOP
     */
    DESTINATION_ATOP: 24,

    /**
     * Lighten blend mode. For Canvas only.
     * Where both shapes overlap the color is determined by adding color values.
     * 
     * @name Phaser.BlendModes.LIGHTER
     */
    LIGHTER: 25,

    /**
     * Copy blend mode. For Canvas only.
     * Only the new shape is shown.
     * 
     * @name Phaser.BlendModes.COPY
     */
    COPY: 26,

    /**
     * xor blend mode. For Canvas only.
     * Shapes are made transparent where both overlap and drawn normal everywhere else.
     * 
     * @name Phaser.BlendModes.XOR
     */
    XOR: 27

};
