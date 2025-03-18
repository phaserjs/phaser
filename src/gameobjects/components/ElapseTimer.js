/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods for managing an elapse timer on a Game Object.
 * The timer is used to drive animations and other time-based effects.
 *
 * This is not necessary for normal animations.
 * It is intended to drive shader effects that require a time value.
 *
 * If you are adding this component to a Game Object,
 * ensure that you register a preUpdate method on the Game Object, e.g.:
 *
 * ```javascript
 * //  Overrides Game Object method
 * addedToScene: function ()
 * {
 *     this.scene.sys.updateList.add(this);
 * },
 *
 * //  Overrides Game Object method
 * removedFromScene: function ()
 * {
 *     this.scene.sys.updateList.remove(this);
 * },
 *
 * preUpdate: function (time, delta)
 * {
 *    this.updateTimer(time, delta);
 * }
 * ```
 *
 * @namespace Phaser.GameObjects.Components.ElapseTimer
 * @since 4.0.0
 */
var ElapseTimer = {

    /**
     * The time elapsed since timer initialization, in milliseconds.
     *
     * @name Phaser.GameObjects.Components.ElapseTimer#timeElapsed
     * @type {number}
     * @since 4.0.0
     */
    timeElapsed: 0,

    /**
     * The time after which `timeElapsed` will reset, in milliseconds.
     * By default, this is 1 hour.
     * If you use the timer for animations, you can set this to a period
     * that matches the animation durations.
     *
     * This is necessary for the timer to avoid floating-point precision issues
     * in shaders.
     * A float32 can represent a few hours of milliseconds accurately,
     * but the precision decreases as the value increases.
     *
     * @name Phaser.GameObjects.Components.ElapseTimer#timeElapsedResetPeriod
     * @type {number}
     * @since 4.0.0
     * @default 3600000
     */
    timeElapsedResetPeriod: 60 * 60 * 1000,

    /**
     * Whether the elapse timer is paused.
     *
     * @name Phaser.GameObjects.Components.ElapseTimer#timePaused
     * @type {boolean}
     * @since 4.0.0
     * @default false
     */
    timePaused: false,

    /**
     * Set the reset period for the elapse timer for this game object.
     *
     * @method Phaser.GameObjects.Components.ElapseTimer#setTimerResetPeriod
     * @since 4.0.0
     * @param {number} period - The time after which `timeElapsed` will reset, in milliseconds.
     * @return {this} This game object.
     */
    setTimerResetPeriod: function (period)
    {
        this.timeElapsedResetPeriod = period;

        return this;
    },

    /**
     * Pauses or resumes the elapse timer for this game object.
     *
     * @method Phaser.GameObjects.Components.ElapseTimer#setTimerPaused
     * @since 4.0.0
     * @param {boolean} [paused] - Pause state (`true` to pause, `false` to unpause). If not specified, the timer will unpause.
     * @return {this} This game object.
     */
    setTimerPaused: function (paused)
    {
        this.timePaused = !!paused;

        return this;
    },

    /**
     * Reset the elapse timer for this game object.
     *
     * @method Phaser.GameObjects.Components.ElapseTimer#resetTimer
     * @since 4.0.0
     * @param {number} [ms=0] - The time to reset the timer to.
     * @return {this} This game object.
     */
    resetTimer: function (ms)
    {
        if (ms === undefined) { ms = 0; }
        this.timeElapsed = ms;

        return this;
    },

    /**
     * Update the elapse timer for this game object.
     * This should be called automatically by the preUpdate method.
     *
     * Override this method to create more advanced time management,
     * or set it to a NOOP function to disable the timer update.
     * If you want to control animations with a tween or input system,
     * disabling the timer update could be useful.
     *
     * @method Phaser.GameObjects.Components.ElapseTimer#updateTimer
     * @since 4.0.0
     * @param {number} time - The current time in milliseconds.
     * @param {number} delta - The time since the last update, in milliseconds.
     * @return {this} This game object.
     */
    updateTimer: function (time, delta)
    {
        if (!this.timePaused)
        {
            this.timeElapsed += delta;

            if (this.timeElapsed >= this.timeElapsedResetPeriod)
            {
                this.timeElapsed -= this.timeElapsedResetPeriod;
            }
        }

        return this;
    }
};

module.exports = ElapseTimer;
