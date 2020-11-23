/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Phaser Scale Manager constants for the different scale modes available.
 * 
 * @namespace Phaser.Scale.ScaleModes
 * @memberof Phaser.Scale
 * @since 3.16.0
 */

/**
 * Phaser Scale Manager constants for the different scale modes available.
 * 
 * To find out what each mode does please see [Phaser.Scale.ScaleModes]{@link Phaser.Scale.ScaleModes}.
 * 
 * @typedef {Phaser.Scale.ScaleModes} Phaser.Scale.ScaleModeType
 * @memberof Phaser.Scale
 * @since 3.16.0
 */

module.exports = {

    /**
     * No scaling happens at all. The canvas is set to the size given in the game config and Phaser doesn't change it
     * again from that point on. If you change the canvas size, either via CSS, or directly via code, then you need
     * to call the Scale Managers `resize` method to give the new dimensions, or input events will stop working.
     * 
     * @name Phaser.Scale.ScaleModes.NONE
     * @type {number}
     * @const
     * @since 3.16.0
     */
    NONE: 0,

    /**
     * The height is automatically adjusted based on the width.
     * 
     * @name Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT
     * @type {number}
     * @const
     * @since 3.16.0
     */
    WIDTH_CONTROLS_HEIGHT: 1,

    /**
     * The width is automatically adjusted based on the height.
     * 
     * @name Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH
     * @type {number}
     * @const
     * @since 3.16.0
     */
    HEIGHT_CONTROLS_WIDTH: 2,

    /**
     * The width and height are automatically adjusted to fit inside the given target area,
     * while keeping the aspect ratio. Depending on the aspect ratio there may be some space
     * inside the area which is not covered.
     * 
     * @name Phaser.Scale.ScaleModes.FIT
     * @type {number}
     * @const
     * @since 3.16.0
     */
    FIT: 3,

    /**
     * The width and height are automatically adjusted to make the size cover the entire target
     * area while keeping the aspect ratio. This may extend further out than the target size.
     * 
     * @name Phaser.Scale.ScaleModes.ENVELOP
     * @type {number}
     * @const
     * @since 3.16.0
     */
    ENVELOP: 4,

    /**
     * The Canvas is resized to fit all available _parent_ space, regardless of aspect ratio.
     * 
     * @name Phaser.Scale.ScaleModes.RESIZE
     * @type {number}
     * @const
     * @since 3.16.0
     */
    RESIZE: 5

};
