/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser ScaleManager Modes.
 * 
 * @name Phaser.ScaleManager
 * @enum {integer}
 * @memberOf Phaser
 * @readonly
 * @since 3.15.0
 */

module.exports = {

    /**
     * A scale mode that stretches content to fill all available space - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
     * 
     * @name Phaser.ScaleManager.EXACT_FIT
     * @since 3.15.0
     */
    EXACT_FIT: 0,

    /**
     * A scale mode that prevents any scaling - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
     * 
     * @name Phaser.ScaleManager.NO_SCALE
     * @since 3.15.0
     */
    NO_SCALE: 1,

    /**
     * A scale mode that shows the entire game while maintaining proportions - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
     * 
     * @name Phaser.ScaleManager.SHOW_ALL
     * @since 3.15.0
     */
    SHOW_ALL: 2,

    /**
     * A scale mode that causes the Game size to change - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
     * 
     * @name Phaser.ScaleManager.RESIZE
     * @since 3.15.0
     */
    RESIZE: 3,

    /**
     * A scale mode that allows a custom scale factor - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
     * 
     * @name Phaser.ScaleManager.USER_SCALE
     * @since 3.15.0
     */
    USER_SCALE: 4,

    /**
     * Names of the scale modes, indexed by value.
     *
     * @name Phaser.ScaleManager.MODES
     * @since 3.15.0
     * @type {string[]}
     */
    MODES: [
        'EXACT_FIT',
        'NO_SCALE',
        'SHOW_ALL',
        'RESIZE',
        'USER_SCALE'
    ]

};
