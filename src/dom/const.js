/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser ScaleManager constants.
 * 
 * @name Phaser.DOM.ScaleModes
 * @enum {integer}
 * @memberof Phaser
 * @readonly
 * @since 3.16.0
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
     * @since 3.16.0
     */
    WIDTH_CONTROLS_HEIGHT: 1,

    /**
     * 
     * 
     * @name Phaser.DOM.HEIGHT_CONTROLS_WIDTH
     * @since 3.16.0
     */
    HEIGHT_CONTROLS_WIDTH: 2,

    /**
     * 
     * 
     * @name Phaser.DOM.FIT
     * @since 3.16.0
     */
    FIT: 3,

    /**
     * 
     * 
     * @name Phaser.DOM.ENVELOP
     * @since 3.16.0
     */
    ENVELOP: 4,

    /**
     * Canvas is resized to fit all available parent space, regardless of aspect ratio.
     * 
     * @name Phaser.DOM.RESIZE
     * @since 3.16.0
     */
    RESIZE: 5,

    /**
     * Canvas is not centered within the parent.
     * 
     * @name Phaser.DOM.NO_CENTER
     * @since 3.16.0
     */
    NO_CENTER: 0,

    /**
     * Canvas is centered both horizontally and vertically within the parent.
     * 
     * @name Phaser.DOM.CENTER_BOTH
     * @since 3.16.0
     */
    CENTER_BOTH: 1,

    /**
     * Canvas is centered horizontally within the parent.
     * 
     * @name Phaser.DOM.CENTER_HORIZONTALLY
     * @since 3.16.0
     */
    CENTER_HORIZONTALLY: 2,

    /**
     * Canvas is centered vertically within the parent.
     * 
     * @name Phaser.DOM.CENTER_VERTICALLY
     * @since 3.16.0
     */
    CENTER_VERTICALLY: 3,

    /**
     * Browser is in landscape orientation.
     * 
     * @name Phaser.DOM.LANDSCAPE
     * @since 3.16.0
     */
    LANDSCAPE: 'landscape-primary',

    /**
     * Browser is in portrait orientation.
     * 
     * @name Phaser.DOM.PORTRAIT
     * @since 3.16.0
     */
    PORTRAIT: 'portrait-primary'

};
