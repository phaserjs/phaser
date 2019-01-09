/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser ScaleManager Modes.
 * 
 * @name Phaser.DOM.ScaleModes
 * @enum {integer}
 * @memberof Phaser
 * @readonly
 * @since 3.15.0
 */

module.exports = {

    /**
     * No scaling happens at all. The canvas is the size given in the game config and Phaser doesn't change it.
     * 
     * @name Phaser.DOM.NONE
     * @since 3.16.0
     */
    NONE: 0,

    /**
     * 
     * 
     * @name Phaser.DOM.WIDTH_CONTROLS_HEIGHT
     * @since 3.15.0
     */
    WIDTH_CONTROLS_HEIGHT: 1,

    /**
     * 
     * 
     * @name Phaser.DOM.HEIGHT_CONTROLS_WIDTH
     * @since 3.15.0
     */
    HEIGHT_CONTROLS_WIDTH: 2,

    /**
     * 
     * 
     * @name Phaser.DOM.FIT
     * @since 3.15.0
     */
    FIT: 3,

    /**
     * 
     * 
     * @name Phaser.DOM.ENVELOPE
     * @since 3.15.0
     */
    ENVELOPE: 4,

    /**
     * Canvas is resized to fit all available parent space, regardless of aspect ratio.
     * 
     * @name Phaser.DOM.RESIZE
     * @since 3.15.0
     */
    RESIZE: 5

};
