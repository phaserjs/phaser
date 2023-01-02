/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Phaser Tween States.
 *
 * @namespace Phaser.Tweens.States
 * @memberof Phaser.Tweens
 * @since 3.60.0
 */

/**
 * Phaser Tween state constants.
 *
 * @typedef {Phaser.Tweens.States} Phaser.Tweens.StateType
 * @memberof Phaser.Tweens
 * @since 3.60.0
 */

var TWEEN_CONST = {

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.States.CREATED
     * @type {number}
     * @const
     * @since 3.0.0
     */
    CREATED: 0,

    //  1 used to be INIT prior to 3.60

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.States.DELAY
     * @type {number}
     * @const
     * @since 3.0.0
     */
    DELAY: 2,

    //  3 used to be OFFSET_DELAY prior to 3.60

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.States.PENDING_RENDER
     * @type {number}
     * @const
     * @since 3.0.0
     */
    PENDING_RENDER: 4,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.States.PLAYING_FORWARD
     * @type {number}
     * @const
     * @since 3.0.0
     */
    PLAYING_FORWARD: 5,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.States.PLAYING_BACKWARD
     * @type {number}
     * @const
     * @since 3.0.0
     */
    PLAYING_BACKWARD: 6,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.States.HOLD_DELAY
     * @type {number}
     * @const
     * @since 3.0.0
     */
    HOLD_DELAY: 7,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.States.REPEAT_DELAY
     * @type {number}
     * @const
     * @since 3.0.0
     */
    REPEAT_DELAY: 8,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.States.COMPLETE
     * @type {number}
     * @const
     * @since 3.0.0
     */
    COMPLETE: 9,

    //  Tween specific (starts from 20 to cleanly allow extra TweenData consts in the future)

    /**
     * Tween state. The Tween has been created but has not yet been added to the Tween Manager.
     *
     * @name Phaser.Tweens.States.PENDING
     * @type {number}
     * @const
     * @since 3.0.0
     */
    PENDING: 20,

    /**
     * Tween state. The Tween is active within the Tween Manager. This means it is either playing,
     * or was playing and is currently paused, but in both cases it's still being processed by
     * the Tween Manager, so is considered 'active'.
     *
     * @name Phaser.Tweens.States.ACTIVE
     * @type {number}
     * @const
     * @since 3.0.0
     */
    ACTIVE: 21,

    /**
     * Tween state. The Tween is waiting for a loop countdown to elapse.
     *
     * @name Phaser.Tweens.States.LOOP_DELAY
     * @type {number}
     * @const
     * @since 3.0.0
     */
    LOOP_DELAY: 22,

    /**
     * Tween state. The Tween is waiting for a complete delay to elapse.
     *
     * @name Phaser.Tweens.States.COMPLETE_DELAY
     * @type {number}
     * @const
     * @since 3.0.0
     */
    COMPLETE_DELAY: 23,

    /**
     * Tween state. The Tween is waiting for a starting delay to elapse.
     *
     * @name Phaser.Tweens.States.START_DELAY
     * @type {number}
     * @const
     * @since 3.0.0
     */
    START_DELAY: 24,

    /**
     * Tween state. The Tween has finished playback and is waiting to be removed from the Tween Manager.
     *
     * @name Phaser.Tweens.States.PENDING_REMOVE
     * @type {number}
     * @const
     * @since 3.0.0
     */
    PENDING_REMOVE: 25,

    /**
     * Tween state. The Tween has been removed from the Tween Manager.
     *
     * @name Phaser.Tweens.States.REMOVED
     * @type {number}
     * @const
     * @since 3.0.0
     */
    REMOVED: 26,

    /**
     * Tween state. The Tween has finished playback but was flagged as 'persistent' during creation,
     * so will not be automatically removed by the Tween Manager.
     *
     * @name Phaser.Tweens.States.FINISHED
     * @type {number}
     * @const
     * @since 3.60.0
     */
    FINISHED: 27,

    /**
     * Tween state. The Tween has been destroyed and can no longer be played by a Tween Manager.
     *
     * @name Phaser.Tweens.States.DESTROYED
     * @type {number}
     * @const
     * @since 3.60.0
     */
    DESTROYED: 28,

    /**
     * A large integer value used for 'infinite' style countdowns.
     *
     * Similar use-case to Number.MAX_SAFE_INTEGER but we cannot use that because it's not
     * supported on IE.
     *
     * @name Phaser.Tweens.States.MAX
     * @type {number}
     * @const
     * @since 3.60.0
     */
    MAX: 999999999999

};

module.exports = TWEEN_CONST;
