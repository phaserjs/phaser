/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser Scale Manager constants.
 * 
 * @name Phaser.Scale.ScaleModes
 * @enum {integer}
 * @memberof Phaser
 * @readonly
 * @since 3.16.0
 */

module.exports = {

    /**
     * No scaling happens at all. The canvas is set to the size given in the game config and Phaser doesn't change it
     * again from that point on. If you change the canvas size, either via CSS, or directly via code, then you need
     * to call the Scale Managers `resize` method to give the new dimensions, or input events will stop working.
     * 
     * @name Phaser.Scale.NONE
     * @enum {integer}
     * @since 3.16.0
     */
    NONE: 0,

    /**
     * 
     * 
     * @name Phaser.Scale.WIDTH_CONTROLS_HEIGHT
     * @enum {integer}
     * @since 3.16.0
     */
    WIDTH_CONTROLS_HEIGHT: 1,

    /**
     * 
     * 
     * @name Phaser.Scale.HEIGHT_CONTROLS_WIDTH
     * @enum {integer}
     * @since 3.16.0
     */
    HEIGHT_CONTROLS_WIDTH: 2,

    /**
     * 
     * 
     * @name Phaser.Scale.FIT
     * @enum {integer}
     * @since 3.16.0
     */
    FIT: 3,

    /**
     * 
     * 
     * @name Phaser.Scale.ENVELOP
     * @enum {integer}
     * @since 3.16.0
     */
    ENVELOP: 4,

    /**
     * Canvas is resized to fit all available parent space, regardless of aspect ratio.
     * 
     * @name Phaser.Scale.RESIZE
     * @enum {integer}
     * @since 3.16.0
     */
    RESIZE: 5,

    /**
     * Canvas is not centered within the parent.
     * 
     * @name Phaser.Scale.NO_CENTER
     * @enum {integer}
     * @since 3.16.0
     */
    NO_CENTER: 0,

    /**
     * Canvas is centered both horizontally and vertically within the parent.
     * 
     * @name Phaser.Scale.CENTER_BOTH
     * @enum {integer}
     * @since 3.16.0
     */
    CENTER_BOTH: 1,

    /**
     * Canvas is centered horizontally within the parent.
     * 
     * @name Phaser.Scale.CENTER_HORIZONTALLY
     * @enum {integer}
     * @since 3.16.0
     */
    CENTER_HORIZONTALLY: 2,

    /**
     * Canvas is centered vertically within the parent.
     * 
     * @name Phaser.Scale.CENTER_VERTICALLY
     * @enum {integer}
     * @since 3.16.0
     */
    CENTER_VERTICALLY: 3,

    /**
     * Browser is in landscape orientation.
     * 
     * @name Phaser.Scale.LANDSCAPE
     * @enum {string}
     * @since 3.16.0
     */
    LANDSCAPE: 'landscape-primary',

    /**
     * Browser is in portrait orientation.
     * 
     * @name Phaser.Scale.PORTRAIT
     * @enum {string}
     * @since 3.16.0
     */
    PORTRAIT: 'portrait-primary',

    /**
     * Calculate the zoom value based on the maximum multiplied game size that will
     * fit into the parent, or browser window if no parent is set.
     * 
     * @name Phaser.Scale.MAX_ZOOM
     * @enum {integer}
     * @since 3.16.0
     */
    MAX_ZOOM: -1

};
