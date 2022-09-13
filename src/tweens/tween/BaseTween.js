/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('../events');
var TWEEN_CONST = require('./const');

/**
 * @classdesc
 * TODO
 *
 * @class BaseTween
 * @memberof Phaser.Tweens
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - A reference to the Tween Manager that owns this Tween.
 */
var BaseTween = new Class({

    Extends: EventEmitter,

    initialize:

    function BaseTween (parent)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Tween Manager that owns this Tween.
         *
         * @name Phaser.Tweens.Tween#parent
         * @type {Phaser.Tweens.TweenManager}
         * @since 3.60.0
         */
        this.parent = parent;

        /**
         * An array of TweenData objects, each containing a unique property and target being tweened.
         *
         * @name Phaser.Tweens.Tween#data
         * @type {Phaser.Tweens.TweenData[]}
         * @since 3.60.0
         */
        this.data = [];

        /**
         * The cached size of the data array.
         *
         * @name Phaser.Tweens.Tween#totalData
         * @type {number}
         * @since 3.60.0
         */
        this.totalData = 0;

        /**
         * Time in ms/frames before the 'onStart' event fires.
         * This is the shortest `delay` value across all of the TweenDatas of this Tween.
         *
         * @name Phaser.Tweens.Tween#startDelay
         * @type {number}
         * @default 0
         * @since 3.19.0
         */
        this.startDelay = 0;

        /**
         * Has this Tween started playback yet?
         * This boolean is toggled when the Tween leaves the 'delayed' state and starts running.
         *
         * @name Phaser.Tweens.Tween#hasStarted
         * @type {boolean}
         * @readonly
         * @since 3.19.0
         */
        this.hasStarted = false;

        /**
         * Scales the time applied to this Tween. A value of 1 runs in real-time. A value of 0.5 runs 50% slower, and so on.
         *
         * The value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
         *
         * @name Phaser.Tweens.Tween#timeScale
         * @type {number}
         * @default 1
         * @since 3.60.0
         */
        this.timeScale = 1;

        /**
         * Loop this tween? Can be -1 for an infinite loop, or a positive integer.
         *
         * When enabled it will play through ALL TweenDatas again. Use TweenData.repeat to loop a single element.
         *
         * @name Phaser.Tweens.Tween#loop
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.loop = 0;

        /**
         * Time in ms/frames before the Tween loops.
         *
         * @name Phaser.Tweens.Tween#loopDelay
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.loopDelay = 0;

        /**
         * Internal counter recording how many loops are left to run.
         *
         * @name Phaser.Tweens.Tween#loopCounter
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.loopCounter = 0;

        /**
         * The time in ms/frames before the 'onComplete' event fires.
         *
         * This never fires if loop = -1 (as it never completes)
         *
         * @name Phaser.Tweens.Tween#completeDelay
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.completeDelay = 0;

        /**
         * An internal countdown timer (used by loopDelay and completeDelay)
         *
         * @name Phaser.Tweens.Tween#countdown
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.countdown = 0;

        /**
         * The current state of the Tween.
         *
         * @name Phaser.Tweens.Tween#state
         * @type {Phaser.Types.Tweens.TweenState}
         * @since 3.60.0
         */
        this.state = TWEEN_CONST.PENDING;

        /**
         * Is the Tween paused? If so it needs to be started with `Tween.play` or resumed with `Tween.resume`.
         *
         * @name Phaser.Tweens.Tween#paused
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.paused = false;

        /**
         * An object containing the different Tween callback functions.
         *
         * You can either set these in the Tween config, or by calling the `Tween.setCallback` method.
         *
         * The types available are:
         *
         * `onActive` - When the Tween is first created it moves to an 'active' state when added to the Tween Manager. 'Active' does not mean 'playing'.
         * `onStart` - When the Tween starts playing after a delayed or paused state. This will happen at the same time as `onActive` if the tween has no delay and isn't paused.
         * `onLoop` - When a Tween loops, if it has been set to do so. This happens _after_ the `loopDelay` expires, if set.
         * `onComplete` - When the Tween finishes playback fully. Never invoked if the Tween is set to repeat infinitely.
         * `onStop` - Invoked only if the `Tween.stop` method is called.
         * `onPause` - Invoked only if the `Tween.pause` method is called. Not invoked if the Tween Manager is paused.
         * `onResume` - Invoked only if the `Tween.resume` method is called. Not invoked if the Tween Manager is resumed.
         *
         * The following types are also available and are invoked on a TweenData level, that is per-object, per-property being tweened:
         *
         * `onYoyo` - When a TweenData starts a yoyo. This happens _after_ the `hold` delay expires, if set.
         * `onRepeat` - When a TweenData repeats playback. This happens _after_ the `repeatDelay` expires, if set.
         * `onUpdate` - When a TweenData updates a property on a source target during playback.
         *
         * @name Phaser.Tweens.Tween#callbacks
         * @type {Phaser.Types.Tweens.TweenCallbacks}
         * @since 3.60.0
         */
        this.callbacks = {
            onActive: null,
            onComplete: null,
            onLoop: null,
            onPause: null,
            onRepeat: null,
            onResume: null,
            onStart: null,
            onStop: null,
            onUpdate: null,
            onYoyo: null
        };

        /**
         * The scope (or context) in which all of the callbacks are invoked.
         *
         * This defaults to be this Tween, but you can override this property
         * to set it to whatever object you require.
         *
         * @name Phaser.Tweens.Tween#callbackScope
         * @type {any}
         * @since 3.60.0
         */
        this.callbackScope;

        /**
         * Will this Tween persist after playback? A Tween that persists will _not_ be destroyed by the
         * Tween Manager, or when calling `Tween.stop`, and can be re-played as required. You can either
         * set this property when creating the tween in the tween config, or set it _prior_ to playback.
         *
         * However, it's up to you to ensure you destroy persistent tweens when you are finished with them,
         * or they will retain references you may no longer require and waste memory.
         *
         * @name Phaser.Tweens.Tween#persist
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.persist = false;
    },

    /**
     * Prepares this Tween for playback.
     *
     * Called automatically by the TweenManager. Should not be called directly.
     *
     * @method Phaser.Tweens.Tween#init
     * @fires Phaser.Tweens.Events#TWEEN_ACTIVE
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    init: function ()
    {
        this.initTweenData();

        this.setActiveState();

        this.dispatchEvent(Events.TWEEN_ACTIVE, 'onActive');

        return this;
    },

    /**
     * Sets the value of the time scale applied to this Tween. A value of 1 runs in real-time.
     * A value of 0.5 runs 50% slower, and so on.
     *
     * The value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
     *
     * @method Phaser.Tweens.Tween#setTimeScale
     * @since 3.60.0
     *
     * @param {number} value - The time scale value to set.
     *
     * @return {this} This Tween instance.
     */
    setTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    /**
     * Gets the value of the time scale applied to this Tween. A value of 1 runs in real-time.
     * A value of 0.5 runs 50% slower, and so on.
     *
     * @method Phaser.Tweens.Tween#getTimeScale
     * @since 3.60.0
     *
     * @return {number} The value of the time scale applied to this Tween.
     */
    getTimeScale: function ()
    {
        return this.timeScale;
    },

    /**
     * Checks if this Tween is currently playing.
     *
     * If this Tween is paused, this method will return false.
     *
     * @method Phaser.Tweens.Tween#isPlaying
     * @since 3.60.0
     *
     * @return {boolean} `true` if the Tween is playing, otherwise `false`.
     */
    isPlaying: function ()
    {
        return (!this.paused && this.isActive());
    },

    /**
     * Checks if the Tween is currently paused.
     *
     * @method Phaser.Tweens.Tween#isPaused
     * @since 3.60.0
     *
     * @return {boolean} `true` if the Tween is paused, otherwise `false`.
     */
    isPaused: function ()
    {
        return this.paused;
    },

    /**
     * Pauses the Tween immediately. Use `resume` to continue playback.
     *
     * You can also toggle the `Tween.paused` boolean property, but doing so will not trigger the PAUSE event.
     *
     * @method Phaser.Tweens.Tween#pause
     * @fires Phaser.Tweens.Events#TWEEN_PAUSE
     * @since 3.60.0
     *
     * @return {this} This Tween instance.
     */
    pause: function ()
    {
        if (!this.paused)
        {
            this.paused = true;

            this.dispatchEvent(Events.TWEEN_PAUSE, 'onPause');
        }

        return this;
    },

    /**
     * Resumes the playback of a previously paused Tween.
     *
     * You can also toggle the `Tween.paused` boolean property, but doing so will not trigger the RESUME event.
     *
     * @method Phaser.Tweens.Tween#resume
     * @fires Phaser.Tweens.Events#TWEEN_RESUME
     * @since 3.60.0
     *
     * @return {this} This Tween instance.
     */
    resume: function ()
    {
        if (this.paused)
        {
            this.paused = false;

            this.dispatchEvent(Events.TWEEN_RESUME, 'onResume');
        }

        return this;
    },

    /**
     * Internal method that makes this Tween active within the TweenManager
     * and emits the onActive event and callback.
     *
     * @method Phaser.Tweens.Tween#makeActive
     * @fires Phaser.Tweens.Events#TWEEN_ACTIVE
     * @since 3.60.0
     */
    makeActive: function ()
    {
        this.parent.makeActive(this);

        this.dispatchEvent(Events.TWEEN_ACTIVE, 'onActive');
    },

    /**
     * See if this Tween is currently acting upon the given target.
     *
     * @method Phaser.Tweens.Tween#hasTarget
     * @since 3.0.0
     *
     * @param {object} target - The target to check against this Tween.
     *
     * @return {boolean} `true` if the given target is a target of this Tween, otherwise `false`.
    hasTarget: function (target)
    {
        return (this.targets.indexOf(target) !== -1);
    },
     */

    /**
     * Restarts the Tween from the beginning.
     *
     * You can only restart a Tween that is currently playing. If the Tween has already been stopped, restarting
     * it will throw an error.
     *
     * If you wish to restart the Tween from a specific point, use the `Tween.seek` method instead.
     *
     * @method Phaser.Tweens.Tween#restart
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
    restart: function ()
    {
        switch (this.state)
        {
            case TWEEN_CONST.REMOVED:
            case TWEEN_CONST.FINISHED:
                this.seek();
                this.parent.makeActive(this);
                break;

            case TWEEN_CONST.PENDING:
            case TWEEN_CONST.PENDING_REMOVE:
                this.parent.reset(this);
                break;

            case TWEEN_CONST.DESTROYED:
                console.warn('Cannot restart destroyed Tweens');
                break;

            default:
                this.seek();
                break;
        }

        this.paused = false;
        this.hasStarted = false;

        return this;
    },
     */

    /**
     * Internal method that advances to the next state of the Tween during playback.
     *
     * @method Phaser.Tweens.Tween#nextState
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @fires Phaser.Tweens.Events#TWEEN_LOOP
     * @since 3.0.0
     *
     * @return {boolean} `true` if this Tween has completed, otherwise `false`.
     */
    nextState: function ()
    {
        if (this.loopCounter > 0)
        {
            this.elapsed = 0;
            this.progress = 0;
            this.loopCounter--;

            this.resetTweenData(true);

            if (this.loopDelay > 0)
            {
                this.countdown = this.loopDelay;

                this.setLoopDelayState();
            }
            else
            {
                this.setActiveState();

                this.dispatchEvent(Events.TWEEN_LOOP, 'onLoop');
            }
        }
        else if (this.completeDelay > 0)
        {
            this.countdown = this.completeDelay;

            this.setCompleteDelayState();
        }
        else
        {
            this.onCompleteHandler();

            return true;
        }

        return false;
    },

    /**
     * Internal method that handles this tween completing and starting
     * the next tween in the chain, if any.
     *
     * @method Phaser.Tweens.Tween#onCompleteHandler
     * @since 3.60.0
     */
    onCompleteHandler: function ()
    {
        this.progress = 1;
        this.totalProgress = 1;

        this.setPendingRemoveState();

        this.dispatchEvent(Events.TWEEN_COMPLETE, 'onComplete');
    },

    /**
     * Starts a Tween playing.
     *
     * You only need to call this method if you have configured the tween to be paused on creation.
     *
     * If the Tween is already playing, calling this method again will have no effect. If you wish to
     * restart the Tween, use `Tween.restart` instead.
     *
     * Calling this method after the Tween has completed will start the Tween playing again from the beginning.
     * This is the same as calling `Tween.seek(0)` and then `Tween.play()`.
     *
     * @method Phaser.Tweens.Tween#play
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    play: function ()
    {
        if (this.isDestroyed())
        {
            console.warn('Cannot play destroyed Tween');

            return this;
        }

        if (this.isPendingRemove() || this.isPending())
        {
            //  This makes the tween active as well:
            this.seek();
        }

        this.paused = false;

        this.setActiveState();

        return this;
    },

    /**
     * Seeks to a specific point in the Tween.
     *
     * **Note:** Be careful when seeking a Tween that repeats or loops forever,
     * or that has an unusually long total duration, as it's possible to hang the browser.
     *
     * The given position is a value between 0 and 1 which represents how far through the Tween to seek to.
     * A value of 0.5 would seek to half-way through the Tween, where-as a value of zero would seek to the start.
     *
     * Note that the seek takes the entire duration of the Tween into account, including delays, loops and repeats.
     * For example, a Tween that lasts for 2 seconds, but that loops 3 times, would have a total duration of 6 seconds,
     * so seeking to 0.5 would seek to 3 seconds into the Tween, as that's half-way through its _entire_ duration.
     *
     * Seeking works by resetting the Tween to its initial values and then iterating through the Tween at `delta`
     * jumps per step. The longer the Tween, the longer this can take.
     *
     * @method Phaser.Tweens.Tween#seek
     * @since 3.0.0
     *
     * @param {number} [toPosition=0] - A value between 0 and 1 which represents the progress point to seek to.
     * @param {number} [delta=16.6] - The size of each step when seeking through the Tween. A higher value completes faster but at the cost of less precision.
     *
     * @return {this} This Tween instance.
    seek: function (toPosition, delta)
    {
        if (toPosition === undefined) { toPosition = 0; }
        if (delta === undefined) { delta = 16.6; }

        if (this.isRemoved() || this.isFinished())
        {
            this.makeActive();
        }

        this.initTweenData(true);

        if (toPosition > 0)
        {
            this.isSeeking = true;

            do
            {
                this.update(delta);

            } while (this.totalProgress <= toPosition);

            this.isSeeking = false;
        }

        return this;
    },
     */

    /**
     * Flags the Tween as being complete, whatever stage of progress it is at.
     *
     * If an `onComplete` callback has been defined it will automatically invoke it, unless a `delay`
     * argument is provided, in which case the Tween will delay for that period of time before calling the callback.
     *
     * If this Tween has a chained Tween, that will now be started.
     *
     * If you don't need a delay, don't have an `onComplete` callback or have a chained tween, then call `Tween.stop` instead.
     *
     * @method Phaser.Tweens.Tween#complete
     * @fires Phaser.Tweens.Events#TWEEN_COMPLETE
     * @since 3.2.0
     *
     * @param {number} [delay=0] - The time to wait before invoking the complete callback. If zero it will fire immediately.
     *
     * @return {this} This Tween instance.
     */
    complete: function (delay)
    {
        if (delay === undefined) { delay = 0; }

        if (delay)
        {
            this.setCompleteDelayState();

            this.countdown = delay;
        }
        else
        {
            this.onCompleteHandler();
        }

        return this;
    },

    /**
     * Immediately removes this Tween from the TweenManager and all of its internal arrays,
     * no matter what stage it is at. Then sets the tween state to `REMOVED`.
     *
     * You should dispose of your reference to this tween after calling this method, to
     * free it from memory.
     *
     * @method Phaser.Tweens.Tween#remove
     * @since 3.17.0
     *
     * @return {this} This Tween instance.
     */
    remove: function ()
    {
        this.parent.remove(this);

        return this;
    },

    /**
     * Stops the Tween immediately, whatever stage of progress it is at and flags it for removal by the Tween Manager.
     *
     * If an `onStop` callback has been defined it will automatically invoke it.
     *
     * The Tween will be removed during the next game frame, but should be considered 'destroyed' from this point on.
     *
     * Typically, you cannot play a Tween that has been stopped. If you just wish to pause the tween, not destroy it,
     * then call the `pause` method instead and use `resume` to continue playback. If you wish to restart the Tween,
     * use the `restart` or `seek` methods.
     *
     * @method Phaser.Tweens.Tween#stop
     * @fires Phaser.Tweens.Events#TWEEN_STOP
     * @since 3.0.0
     *
     * @return {this} This Tween instance.
     */
    stop: function ()
    {
        if (!this.isRemoved() && !this.isPendingRemove())
        {
            this.dispatchEvent(Events.TWEEN_STOP, 'onStop');

            this.setPendingRemoveState();
        }

        return this;
    },

    /**
     * Internal method that handles the processing of the loop delay countdown timer and
     * the dispatch of related events. Called automatically by `Tween.update`.
     *
     * @method Phaser.Tweens.Tween#updateLoopCountdown
     * @since 3.60.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    updateLoopCountdown: function (delta)
    {
        this.countdown -= delta;

        if (this.countdown <= 0)
        {
            this.setActiveState();

            this.dispatchEvent(Events.TWEEN_LOOP, 'onLoop');
        }
    },

    /**
     * Internal method that handles the processing of the complete delay countdown timer and
     * the dispatch of related events. Called automatically by `Tween.update`.
     *
     * @method Phaser.Tweens.Tween#updateCompleteDelay
     * @since 3.60.0
     *
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    updateCompleteDelay: function (delta)
    {
        this.countdown -= delta;

        if (this.countdown <= 0)
        {
            this.onCompleteHandler();
        }
    },

    /**
     * Internal method that will emit a Tween based Event and invoke the given callback.
     *
     * @method Phaser.Tweens.Tween#dispatchEvent
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.Event} event - The Event to be dispatched.
     * @param {Phaser.Types.Tweens.TweenCallbackTypes} [callback] - The name of the callback to be invoked. Can be `null` or `undefined` to skip invocation.
    dispatchEvent: function (event, callback)
    {
        if (!this.isSeeking)
        {
            this.emit(event, this, this.targets);

            var handler = this.callbacks[callback];

            if (handler)
            {
                handler.func.apply(handler.scope, [ this, this.targets ].concat(handler.params));
            }
        }
    },
     */

    /**
     * Sets an event based callback to be invoked during playback.
     *
     * Calling this method will replace a previously set callback for the given type, if any exists.
     *
     * The types available are:
     *
     * `onActive` - When the Tween is first created it moves to an 'active' state when added to the Tween Manager. 'Active' does not mean 'playing'.
     * `onStart` - When the Tween starts playing after a delayed or paused state. This will happen at the same time as `onActive` if the tween has no delay and isn't paused.
     * `onLoop` - When a Tween loops, if it has been set to do so. This happens _after_ the `loopDelay` expires, if set.
     * `onComplete` - When the Tween finishes playback fully. Never invoked if the Tween is set to repeat infinitely.
     * `onStop` - Invoked only if the `Tween.stop` method is called.
     * `onPause` - Invoked only if the `Tween.pause` method is called. Not invoked if the Tween Manager is paused.
     * `onResume` - Invoked only if the `Tween.resume` method is called. Not invoked if the Tween Manager is resumed.
     *
     * The following types are also available and are invoked on a TweenData level, that is per-target object, per-property, being tweened:
     *
     * `onYoyo` - When a TweenData starts a yoyo. This happens _after_ the `hold` delay expires, if set.
     * `onRepeat` - When a TweenData repeats playback. This happens _after_ the `repeatDelay` expires, if set.
     * `onUpdate` - When a TweenData updates a property on a source target during playback.
     *
     * @method Phaser.Tweens.Tween#setCallback
     * @since 3.60.0
     *
     * @param {Phaser.Types.Tweens.TweenCallbackTypes} type - The type of callback to set. One of: `onActive`, `onComplete`, `onLoop`, `onPause`, `onRepeat`, `onResume`, `onStart`, `onStop`, `onUpdate` or `onYoyo`.
     * @param {function} callback - Your callback that will be invoked.
     * @param {array} [params] - The parameters to pass to the callback. Pass an empty array if you don't want to define any, but do wish to set the scope.
     *
     * @return {this} This Tween instance.
     */
    setCallback: function (type, callback, params)
    {
        if (params === undefined) { params = []; }

        if (this.callbacks.hasOwnProperty(type))
        {
            this.callbacks[type] = { func: callback, params: params };
        }

        return this;
    },

    /**
     * Sets this Tween state to PENDING.
     *
     * @method Phaser.Tweens.Tween#setPendingState
     * @since 3.60.0
     */
    setPendingState: function ()
    {
        this.state = TWEEN_CONST.PENDING;
    },

    /**
     * Sets this Tween state to ACTIVE.
     *
     * @method Phaser.Tweens.Tween#setActiveState
     * @since 3.60.0
     */
    setActiveState: function ()
    {
        this.state = TWEEN_CONST.ACTIVE;
    },

    /**
     * Sets this Tween state to LOOP_DELAY.
     *
     * @method Phaser.Tweens.Tween#setLoopDelayState
     * @since 3.60.0
     */
    setLoopDelayState: function ()
    {
        this.state = TWEEN_CONST.LOOP_DELAY;
    },

    /**
     * Sets this Tween state to COMPLETE_DELAY.
     *
     * @method Phaser.Tweens.Tween#setCompleteDelayState
     * @since 3.60.0
     */
    setCompleteDelayState: function ()
    {
        this.state = TWEEN_CONST.COMPLETE_DELAY;
    },

    /**
     * Sets this Tween state to PENDING_REMOVE.
     *
     * @method Phaser.Tweens.Tween#setPendingRemoveState
     * @since 3.60.0
     */
    setPendingRemoveState: function ()
    {
        this.state = TWEEN_CONST.PENDING_REMOVE;
    },

    /**
     * Sets this Tween state to REMOVED.
     *
     * @method Phaser.Tweens.Tween#setRemovedState
     * @since 3.60.0
     */
    setRemovedState: function ()
    {
        this.state = TWEEN_CONST.REMOVED;
    },

    /**
     * Sets this Tween state to FINISHED.
     *
     * @method Phaser.Tweens.Tween#setFinishedState
     * @since 3.60.0
     */
    setFinishedState: function ()
    {
        this.state = TWEEN_CONST.FINISHED;
    },

    /**
     * Sets this Tween state to DESTROYED.
     *
     * @method Phaser.Tweens.Tween#setDestroyedState
     * @since 3.60.0
     */
    setDestroyedState: function ()
    {
        this.state = TWEEN_CONST.DESTROYED;
    },

    /**
     * Returns `true` if this Tween has a _current_ state of PENDING, otherwise `false`.
     *
     * @method Phaser.Tweens.Tween#isPending
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Tween has a _current_ state of PENDING, otherwise `false`.
     */
    isPending: function ()
    {
        return (this.state === TWEEN_CONST.PENDING);
    },

    /**
     * Returns `true` if this Tween has a _current_ state of ACTIVE, otherwise `false`.
     *
     * @method Phaser.Tweens.Tween#isActive
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Tween has a _current_ state of ACTIVE, otherwise `false`.
     */
    isActive: function ()
    {
        return (this.state === TWEEN_CONST.ACTIVE);
    },

    /**
     * Returns `true` if this Tween has a _current_ state of LOOP_DELAY, otherwise `false`.
     *
     * @method Phaser.Tweens.Tween#isLoopDelayed
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Tween has a _current_ state of LOOP_DELAY, otherwise `false`.
     */
    isLoopDelayed: function ()
    {
        return (this.state === TWEEN_CONST.LOOP_DELAY);
    },

    /**
     * Returns `true` if this Tween has a _current_ state of COMPLETE_DELAY, otherwise `false`.
     *
     * @method Phaser.Tweens.Tween#isCompleteDelayed
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Tween has a _current_ state of COMPLETE_DELAY, otherwise `false`.
     */
    isCompleteDelayed: function ()
    {
        return (this.state === TWEEN_CONST.COMPLETE_DELAY);
    },

    /**
     * Returns `true` if this Tween has a _current_ state of PENDING_REMOVE, otherwise `false`.
     *
     * @method Phaser.Tweens.Tween#isPendingRemove
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Tween has a _current_ state of PENDING_REMOVE, otherwise `false`.
     */
    isPendingRemove: function ()
    {
        return (this.state === TWEEN_CONST.PENDING_REMOVE);
    },

    /**
     * Returns `true` if this Tween has a _current_ state of REMOVED, otherwise `false`.
     *
     * @method Phaser.Tweens.Tween#isRemoved
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Tween has a _current_ state of REMOVED, otherwise `false`.
     */
    isRemoved: function ()
    {
        return (this.state === TWEEN_CONST.REMOVED);
    },

    /**
     * Returns `true` if this Tween has a _current_ state of FINISHED, otherwise `false`.
     *
     * @method Phaser.Tweens.Tween#isFinished
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Tween has a _current_ state of FINISHED, otherwise `false`.
     */
    isFinished: function ()
    {
        return (this.state === TWEEN_CONST.FINISHED);
    },

    /**
     * Returns `true` if this Tween has a _current_ state of DESTROYED, otherwise `false`.
     *
     * @method Phaser.Tweens.Tween#isDestroyed
     * @since 3.60.0
     *
     * @return {boolean} `true` if this Tween has a _current_ state of DESTROYED, otherwise `false`.
     */
    isDestroyed: function ()
    {
        return (this.state === TWEEN_CONST.DESTROYED);
    },

    /**
     * Handles the destroy process of this Tween, clearing out the
     * Tween Data and resetting the targets. A Tween that has been
     * destroyed cannot ever be played or used again.
     *
     * @method Phaser.Tweens.Tween#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        for (var i = 0; i < this.totalData; i++)
        {
            this.data[i].destroy();
        }

        this.removeAllListeners();

        this.callbacks = null;
        this.data = null;
        this.parent = null;

        this.setDestroyedState();
    }

});

BaseTween.TYPES = [
    'onActive',
    'onComplete',
    'onLoop',
    'onPause',
    'onRepeat',
    'onResume',
    'onStart',
    'onStop',
    'onUpdate',
    'onYoyo'
];

module.exports = BaseTween;
