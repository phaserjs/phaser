/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var INPUT_CONST = {

    /**
     * The mouse pointer is being held down.
     * 
     * @name Phaser.Input.MOUSE_DOWN
     * @type {number}
     * @since 3.10.0
     */
    MOUSE_DOWN: 0,

    /**
     * The mouse pointer is being moved.
     * 
     * @name Phaser.Input.MOUSE_MOVE
     * @type {number}
     * @since 3.10.0
     */
    MOUSE_MOVE: 1,

    /**
     * The mouse pointer is released.
     * 
     * @name Phaser.Input.MOUSE_UP
     * @type {number}
     * @since 3.10.0
     */
    MOUSE_UP: 2,

    /**
     * A touch pointer has been started.
     * 
     * @name Phaser.Input.TOUCH_START
     * @type {number}
     * @since 3.10.0
     */
    TOUCH_START: 3,

    /**
     * A touch pointer has been started.
     * 
     * @name Phaser.Input.TOUCH_MOVE
     * @type {number}
     * @since 3.10.0
     */
    TOUCH_MOVE: 4,

    /**
     * A touch pointer has been started.
     * 
     * @name Phaser.Input.TOUCH_END
     * @type {number}
     * @since 3.10.0
     */
    TOUCH_END: 5,

    /**
     * The pointer lock has changed.
     * 
     * @name Phaser.Input.POINTER_LOCK_CHANGE
     * @type {number}
     * @since 3.10.0
     */
    POINTER_LOCK_CHANGE: 6,

    /**
     * A touch pointer has been been cancelled by the browser.
     * 
     * @name Phaser.Input.TOUCH_CANCEL
     * @type {number}
     * @since 3.15.0
     */
    TOUCH_CANCEL: 7,

    /**
     * The mouse wheel changes.
     * 
     * @name Phaser.Input.MOUSE_WHEEL
     * @type {number}
     * @since 3.18.0
     */
    MOUSE_WHEEL: 8

};

module.exports = INPUT_CONST;
