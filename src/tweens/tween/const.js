/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TWEEN_CONST = {

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.CREATED
     * @type {number}
     * @since 3.0.0
     */
    CREATED: 0,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.INIT
     * @type {number}
     * @since 3.0.0
     */
    INIT: 1,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.DELAY
     * @type {number}
     * @since 3.0.0
     */
    DELAY: 2,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.OFFSET_DELAY
     * @type {number}
     * @since 3.0.0
     */
    OFFSET_DELAY: 3,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.PENDING_RENDER
     * @type {number}
     * @since 3.0.0
     */
    PENDING_RENDER: 4,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.PLAYING_FORWARD
     * @type {number}
     * @since 3.0.0
     */
    PLAYING_FORWARD: 5,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.PLAYING_BACKWARD
     * @type {number}
     * @since 3.0.0
     */
    PLAYING_BACKWARD: 6,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.HOLD_DELAY
     * @type {number}
     * @since 3.0.0
     */
    HOLD_DELAY: 7,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.REPEAT_DELAY
     * @type {number}
     * @since 3.0.0
     */
    REPEAT_DELAY: 8,

    /**
     * TweenData state.
     *
     * @name Phaser.Tweens.COMPLETE
     * @type {number}
     * @since 3.0.0
     */
    COMPLETE: 9,

    //  Tween specific (starts from 20 to cleanly allow extra TweenData consts in the future)

    /**
     * Tween state. The tween has been created and is paused, pending playback.
     *
     * @name Phaser.Tweens.PENDING
     * @type {number}
     * @since 3.0.0
     */
    PENDING: 20,

    /**
     * Tween state. The tween is actively playing, or was playing and is paused.
     *
     * @name Phaser.Tweens.PLAYING
     * @type {number}
     * @since 3.0.0
     */
    PLAYING: 21,

    /**
     * Tween state. The tween is waiting for a loop countdown to elapse.
     *
     * @name Phaser.Tweens.LOOP_DELAY
     * @type {number}
     * @since 3.0.0
     */
    LOOP_DELAY: 22,

    /**
     * Tween state. The tween is waiting for a complete delay to elapse.
     *
     * @name Phaser.Tweens.COMPLETE_DELAY
     * @type {number}
     * @since 3.0.0
     */
    COMPLETE_DELAY: 23,

    /**
     * Tween state. The tween has finished playback and is waiting to be removed from the Tween Manager.
     *
     * @name Phaser.Tweens.PENDING_REMOVE
     * @type {number}
     * @since 3.0.0
     */
    PENDING_REMOVE: 24,

    /**
     * Tween state. The tween has been removed from the Tween Manager.
     *
     * @name Phaser.Tweens.REMOVED
     * @type {number}
     * @since 3.0.0
     */
    REMOVED: 25,

    /**
     * Tween state. The tween has been destroyed and can no longer be played by a Tween Manager.
     *
     * @name Phaser.Tweens.DESTROYED
     * @type {number}
     * @since 3.60.0
     */
    DESTROYED: 26

};

module.exports = TWEEN_CONST;
