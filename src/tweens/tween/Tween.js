/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var GameObjectCreator = require('../../gameobjects/GameObjectCreator');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');
var TWEEN_CONST = require('./const');

/**
 * @classdesc
 * [description]
 *
 * @class Tween
 * @memberOf Phaser.Tweens
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager|Phaser.Tweens.Timeline} parent - [description]
 * @param {Phaser.Tweens.TweenData[]} data - [description]
 * @param {array} targets - [description]
 */
var Tween = new Class({

    initialize:

    function Tween (parent, data, targets)
    {
        /**
         * [description]
         *
         * @name Phaser.Tweens.Tween#parent
         * @type {Phaser.Tweens.TweenManager|Phaser.Tweens.Timeline}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * Is the parent of this Tween a Timeline?
         *
         * @name Phaser.Tweens.Tween#parentIsTimeline
         * @type {boolean}
         * @since 3.0.0
         */
        this.parentIsTimeline = parent.hasOwnProperty('isTimeline');

        /**
         * An array of TweenData objects, each containing a unique property and target being tweened.
         *
         * @name Phaser.Tweens.Tween#data
         * @type {Phaser.Tweens.TweenData[]}
         * @since 3.0.0
         */
        this.data = data;

        /**
         * data array doesn't change, so we can cache the length
         *
         * @name Phaser.Tweens.Tween#totalData
         * @type {integer}
         * @since 3.0.0
         */
        this.totalData = data.length;

        /**
         * An array of references to the target/s this Tween is operating on
         *
         * @name Phaser.Tweens.Tween#targets
         * @type {object[]}
         * @since 3.0.0
         */
        this.targets = targets;

        /**
         * Cached target total (not necessarily the same as the data total)
         *
         * @name Phaser.Tweens.Tween#totalTargets
         * @type {integer}
         * @since 3.0.0
         */
        this.totalTargets = targets.length;

        /**
         * If true then duration, delay, etc values are all frame totals.
         *
         * @name Phaser.Tweens.Tween#useFrames
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.useFrames = false;

        /**
         * Scales the time applied to this Tween. A value of 1 runs in real-time. A value of 0.5 runs 50% slower, and so on.
         * Value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
         *
         * @name Phaser.Tweens.Tween#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * Loop this tween? Can be -1 for an infinite loop, or an integer.
         * When enabled it will play through ALL TweenDatas again (use TweenData.repeat to loop a single TD)
         *
         * @name Phaser.Tweens.Tween#loop
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loop = 0;

        /**
         * Time in ms/frames before the tween loops.
         *
         * @name Phaser.Tweens.Tween#loopDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopDelay = 0;

        /**
         * How many loops are left to run?
         *
         * @name Phaser.Tweens.Tween#loopCounter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopCounter = 0;

        /**
         * Time in ms/frames before the 'onComplete' event fires. This never fires if loop = -1 (as it never completes)
         *
         * @name Phaser.Tweens.Tween#completeDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.completeDelay = 0;

        /**
         * Countdown timer (used by timeline offset, loopDelay and completeDelay)
         *
         * @name Phaser.Tweens.Tween#countdown
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.countdown = 0;

        /**
         * Set only if this Tween is part of a Timeline.
         *
         * @name Phaser.Tweens.Tween#offset
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.offset = 0;

        /**
         * Set only if this Tween is part of a Timeline. The calculated offset amount.
         *
         * @name Phaser.Tweens.Tween#calculatedOffset
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.calculatedOffset = 0;

        /**
         * The current state of the tween
         *
         * @name Phaser.Tweens.Tween#state
         * @type {integer}
         * @since 3.0.0
         */
        this.state = TWEEN_CONST.PENDING_ADD;

        /**
         * The state of the tween when it was paused (used by Resume)
         *
         * @name Phaser.Tweens.Tween#_pausedState
         * @type {integer}
         * @private
         * @since 3.0.0
         */
        this._pausedState = TWEEN_CONST.PENDING_ADD;

        /**
         * Does the Tween start off paused? (if so it needs to be started with Tween.play)
         *
         * @name Phaser.Tweens.Tween#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        /**
         * Elapsed time in ms/frames of this run through the Tween.
         *
         * @name Phaser.Tweens.Tween#elapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.elapsed = 0;

        /**
         * Total elapsed time in ms/frames of the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Tween#totalElapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalElapsed = 0;

        /**
         * Time in ms/frames for the whole Tween to play through once, excluding loop amounts and loop delays.
         *
         * @name Phaser.Tweens.Tween#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * Value between 0 and 1. The amount through the Tween, excluding loops.
         *
         * @name Phaser.Tweens.Tween#progress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * Time in ms/frames for the Tween to complete (including looping)
         *
         * @name Phaser.Tweens.Tween#totalDuration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalDuration = 0;

        /**
         * Value between 0 and 1. The amount through the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Tween#totalProgress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalProgress = 0;

        /**
         * An object containing the various Tween callback references.
         *
         * @name Phaser.Tweens.Tween#callbacks
         * @type {object}
         * @default 0
         * @since 3.0.0
         */
        this.callbacks = {
            onComplete: null,
            onLoop: null,
            onRepeat: null,
            onStart: null,
            onUpdate: null,
            onYoyo: null
        };

        this.callbackScope;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#getValue
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getValue: function ()
    {
        return this.data[0].current;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#setTimeScale
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Tweens.Tween} This Tween object.
     */
    setTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#getTimeScale
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    getTimeScale: function ()
    {
        return this.timeScale;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#isPlaying
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isPlaying: function ()
    {
        return (this.state === TWEEN_CONST.ACTIVE);
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#isPaused
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isPaused: function ()
    {
        return (this.state === TWEEN_CONST.PAUSED);
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#hasTarget
     * @since 3.0.0
     *
     * @param {object} target - [description]
     *
     * @return {boolean} [description]
     */
    hasTarget: function (target)
    {
        return (this.targets.indexOf(target) !== -1);
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#updateTo
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {any} value - [description]
     * @param {boolean} startToCurrent - [description]
     *
     * @return {Phaser.Tweens.Tween} This Tween object.
     */
    updateTo: function (key, value, startToCurrent)
    {
        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = this.data[i];

            if (tweenData.key === key)
            {
                tweenData.end = value;

                if (startToCurrent)
                {
                    tweenData.start = tweenData.current;
                }

                break;
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#restart
     * @since 3.0.0
     */
    restart: function ()
    {
        this.stop();
        this.play();
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#calcDuration
     * @since 3.0.0
     */
    calcDuration: function ()
    {
        var max = 0;

        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = data[i];

            //  Set t1 (duration + hold + yoyo)
            tweenData.t1 = tweenData.duration + tweenData.hold;

            if (tweenData.yoyo)
            {
                tweenData.t1 += tweenData.duration;
            }

            //  Set t2 (repeatDelay + duration + hold + yoyo)
            tweenData.t2 = tweenData.t1 + tweenData.repeatDelay;

            //  Total Duration
            tweenData.totalDuration = tweenData.delay + tweenData.t1;

            if (tweenData.repeat === -1)
            {
                tweenData.totalDuration += (tweenData.t2 * 999999999999);
            }
            else if (tweenData.repeat > 0)
            {
                tweenData.totalDuration += (tweenData.t2 * tweenData.repeat);
            }

            if (tweenData.totalDuration > max)
            {
                //  Get the longest TweenData from the Tween, used to calculate the Tween TD
                max = tweenData.totalDuration;
            }
        }

        //  Excludes loop values
        this.duration = max;

        this.loopCounter = (this.loop === -1) ? 999999999999 : this.loop;

        if (this.loopCounter > 0)
        {
            this.totalDuration = this.duration + this.completeDelay + ((this.duration + this.loopDelay) * this.loopCounter);
        }
        else
        {
            this.totalDuration = this.duration + this.completeDelay;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#init
     * @since 3.0.0
     *
     * @return {boolean} Returns `true` if this Tween should be moved from the pending list to the active list by the Tween Manager.
     */
    init: function ()
    {
        var data = this.data;
        var totalTargets = this.totalTargets;

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = data[i];
            var target = tweenData.target;
            var gen = tweenData.gen;

            tweenData.delay = gen.delay(i, totalTargets, target);
            tweenData.duration = gen.duration(i, totalTargets, target);
            tweenData.hold = gen.hold(i, totalTargets, target);
            tweenData.repeat = gen.repeat(i, totalTargets, target);
            tweenData.repeatDelay = gen.repeatDelay(i, totalTargets, target);
        }

        this.calcDuration();

        this.progress = 0;
        this.totalProgress = 0;
        this.elapsed = 0;
        this.totalElapsed = 0;

        //  You can't have a paused Tween if it's part of a Timeline
        if (this.paused && !this.parentIsTimeline)
        {
            this.state = TWEEN_CONST.PAUSED;

            return false;
        }
        else
        {
            return true;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#nextState
     * @since 3.0.0
     */
    nextState: function ()
    {
        if (this.loopCounter > 0)
        {
            this.elapsed = 0;
            this.progress = 0;
            this.loopCounter--;

            var onLoop = this.callbacks.onLoop;

            if (onLoop)
            {
                onLoop.params[1] = this.targets;

                onLoop.func.apply(onLoop.scope, onLoop.params);
            }

            this.resetTweenData(true);

            if (this.loopDelay > 0)
            {
                this.countdown = this.loopDelay;
                this.state = TWEEN_CONST.LOOP_DELAY;
            }
            else
            {
                this.state = TWEEN_CONST.ACTIVE;
            }
        }
        else if (this.completeDelay > 0)
        {
            this.countdown = this.completeDelay;
            this.state = TWEEN_CONST.COMPLETE_DELAY;
        }
        else
        {
            var onComplete = this.callbacks.onComplete;

            if (onComplete)
            {
                onComplete.params[1] = this.targets;

                onComplete.func.apply(onComplete.scope, onComplete.params);
            }

            this.state = TWEEN_CONST.PENDING_REMOVE;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#pause
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.Tween} This Tween object.
     */
    pause: function ()
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            return;
        }

        this.paused = true;

        this._pausedState = this.state;

        this.state = TWEEN_CONST.PAUSED;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#play
     * @since 3.0.0
     *
     * @param {boolean} resetFromTimeline - [description]
     */
    play: function (resetFromTimeline)
    {
        if (this.state === TWEEN_CONST.ACTIVE)
        {
            return;
        }
        else if (this.state === TWEEN_CONST.PENDING_REMOVE || this.state === TWEEN_CONST.REMOVED)
        {
            this.init();
            this.parent.makeActive(this);
            resetFromTimeline = true;
        }

        var onStart = this.callbacks.onStart;

        if (this.parentIsTimeline)
        {
            this.resetTweenData(resetFromTimeline);

            if (this.calculatedOffset === 0)
            {
                if (onStart)
                {
                    onStart.params[1] = this.targets;

                    onStart.func.apply(onStart.scope, onStart.params);
                }

                this.state = TWEEN_CONST.ACTIVE;
            }
            else
            {
                this.countdown = this.calculatedOffset;

                this.state = TWEEN_CONST.OFFSET_DELAY;
            }
        }
        else if (this.paused)
        {
            this.paused = false;

            this.parent.makeActive(this);
        }
        else
        {
            this.resetTweenData(resetFromTimeline);

            this.state = TWEEN_CONST.ACTIVE;

            if (onStart)
            {
                onStart.params[1] = this.targets;

                onStart.func.apply(onStart.scope, onStart.params);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#resetTweenData
     * @since 3.0.0
     *
     * @param {boolean} resetFromLoop - [description]
     */
    resetTweenData: function (resetFromLoop)
    {
        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            var tweenData = data[i];

            tweenData.progress = 0;
            tweenData.elapsed = 0;

            tweenData.repeatCounter = (tweenData.repeat === -1) ? 999999999999 : tweenData.repeat;

            if (resetFromLoop)
            {
                tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.start);

                tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.end);

                tweenData.current = tweenData.start;

                tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
            }
            else if (tweenData.delay > 0)
            {
                tweenData.elapsed = tweenData.delay;
                tweenData.state = TWEEN_CONST.DELAY;
            }
            else
            {
                tweenData.state = TWEEN_CONST.PENDING_RENDER;
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#resume
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.Tween} This Tween object.
     */
    resume: function ()
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            this.paused = false;

            this.state = this._pausedState;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#seek
     * @since 3.0.0
     *
     * @param {float} toPosition - A value between 0 and 1.
     */
    seek: function (toPosition)
    {
        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            //  This won't work with loop > 0 yet
            var ms = this.totalDuration * toPosition;

            var tweenData = data[i];
            var progress = 0;
            var elapsed = 0;

            if (ms <= tweenData.delay)
            {
                progress = 0;
                elapsed = 0;
            }
            else if (ms >= tweenData.totalDuration)
            {
                progress = 1;
                elapsed = tweenData.duration;
            }
            else if (ms > tweenData.delay && ms <= tweenData.t1)
            {
                //  Keep it zero bound
                ms = Math.max(0, ms - tweenData.delay);

                //  Somewhere in the first playthru range
                progress = ms / tweenData.t1;
                elapsed = tweenData.duration * progress;
            }
            else if (ms > tweenData.t1 && ms < tweenData.totalDuration)
            {
                //  Somewhere in repeat land
                ms -= tweenData.delay;
                ms -= tweenData.t1;

                // var repeats = Math.floor(ms / tweenData.t2);

                //  remainder
                ms = ((ms / tweenData.t2) % 1) * tweenData.t2;

                if (ms > tweenData.repeatDelay)
                {
                    progress = ms / tweenData.t1;
                    elapsed = tweenData.duration * progress;
                }
            }

            tweenData.progress = progress;
            tweenData.elapsed = elapsed;

            var v = tweenData.ease(tweenData.progress);

            tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);

            // console.log(tweenData.key, 'Seek', tweenData.target[tweenData.key], 'to', tweenData.current, 'pro', tweenData.progress, 'marker', toPosition, progress);

            // if (tweenData.current === 0)
            // {
            //     console.log('zero', tweenData.start, tweenData.end, v, 'progress', progress);
            // }

            tweenData.target[tweenData.key] = tweenData.current;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#setCallback
     * @since 3.0.0
     *
     * @param {string} type - [description]
     * @param {function} callback - [description]
     * @param {array} [params] - [description]
     * @param {object} [scope] - [description]
     *
     * @return {Phaser.Tweens.Tween} This Tween object.
     */
    setCallback: function (type, callback, params, scope)
    {
        this.callbacks[type] = { func: callback, scope: scope, params: params };

        return this;
    },

    /**
     * Stops the Tween immediately, whatever stage of progress it is at and flags it for removal by the TweenManager.
     *
     * @method Phaser.Tweens.Tween#stop
     * @since 3.0.0
     *
     * @param {float} [resetTo] - A value between 0 and 1.
     */
    stop: function (resetTo)
    {
        if (resetTo !== undefined)
        {
            this.seek(resetTo);
        }

        this.state = TWEEN_CONST.PENDING_REMOVE;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#update
     * @since 3.0.0
     *
     * @param {number} timestamp - [description]
     * @param {number} delta - [description]
     *
     * @return {boolean} Returns `true` if this Tween has finished and should be removed from the Tween Manager, otherwise returns `false`.
     */
    update: function (timestamp, delta)
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            return false;
        }

        if (this.useFrames)
        {
            delta = 1 * this.parent.timeScale;
        }

        delta *= this.timeScale;

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        switch (this.state)
        {
            case TWEEN_CONST.ACTIVE:

                var stillRunning = false;

                for (var i = 0; i < this.totalData; i++)
                {
                    if (this.updateTweenData(this, this.data[i], delta))
                    {
                        stillRunning = true;
                    }
                }

                //  Anything still running? If not, we're done
                if (!stillRunning)
                {
                    this.nextState();
                }

                break;

            case TWEEN_CONST.LOOP_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    this.state = TWEEN_CONST.ACTIVE;
                }

                break;

            case TWEEN_CONST.OFFSET_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    var onStart = this.callbacks.onStart;

                    if (onStart)
                    {
                        onStart.params[1] = this.targets;

                        onStart.func.apply(onStart.scope, onStart.params);
                    }

                    this.state = TWEEN_CONST.ACTIVE;
                }

                break;

            case TWEEN_CONST.COMPLETE_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    var onComplete = this.callbacks.onComplete;

                    if (onComplete)
                    {
                        onComplete.func.apply(onComplete.scope, onComplete.params);
                    }

                    this.state = TWEEN_CONST.PENDING_REMOVE;
                }

                break;
        }

        return (this.state === TWEEN_CONST.PENDING_REMOVE);
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#setStateFromEnd
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - [description]
     * @param {Phaser.Tweens.TweenData} tweenData - [description]
     * @param {number} diff - [description]
     *
     * @return {integer} The state of this Tween.
     */
    setStateFromEnd: function (tween, tweenData, diff)
    {
        if (tweenData.yoyo)
        {
            //  We've hit the end of a Playing Forward TweenData and we have a yoyo

            //  Account for any extra time we got from the previous frame
            tweenData.elapsed = diff;
            tweenData.progress = diff / tweenData.duration;

            if (tweenData.flipX)
            {
                tweenData.target.toggleFlipX();
            }

            //  Problem: The flip and callback and so on gets called for every TweenData that triggers it at the same time.
            //  If you're tweening several properties it can fire for all of them, at once.

            if (tweenData.flipY)
            {
                tweenData.target.toggleFlipY();
            }

            var onYoyo = tween.callbacks.onYoyo;

            if (onYoyo)
            {
                //  Element 1 is reserved for the target of the yoyo (and needs setting here)
                onYoyo.params[1] = tweenData.target;

                onYoyo.func.apply(onYoyo.scope, onYoyo.params);
            }

            tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.start);

            return TWEEN_CONST.PLAYING_BACKWARD;
        }
        else if (tweenData.repeatCounter > 0)
        {
            //  We've hit the end of a Playing Forward TweenData and we have a Repeat.
            //  So we're going to go right back to the start to repeat it again.

            tweenData.repeatCounter--;

            //  Account for any extra time we got from the previous frame
            tweenData.elapsed = diff;
            tweenData.progress = diff / tweenData.duration;

            if (tweenData.flipX)
            {
                tweenData.target.toggleFlipX();
            }

            if (tweenData.flipY)
            {
                tweenData.target.toggleFlipY();
            }

            var onRepeat = tween.callbacks.onRepeat;

            if (onRepeat)
            {
                //  Element 1 is reserved for the target of the repeat (and needs setting here)
                onRepeat.params[1] = tweenData.target;

                onRepeat.func.apply(onRepeat.scope, onRepeat.params);
            }

            tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.start);

            tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.start);

            //  Delay?
            if (tweenData.repeatDelay > 0)
            {
                tweenData.elapsed = tweenData.repeatDelay - diff;

                tweenData.current = tweenData.start;

                tweenData.target[tweenData.key] = tweenData.current;

                return TWEEN_CONST.REPEAT_DELAY;
            }
            else
            {
                return TWEEN_CONST.PLAYING_FORWARD;
            }
        }

        return TWEEN_CONST.COMPLETE;
    },

    /**
     * Was PLAYING_BACKWARD and has hit the start.
     *
     * @method Phaser.Tweens.Tween#setStateFromStart
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - [description]
     * @param {Phaser.Tweens.TweenData} tweenData - [description]
     * @param {number} diff - [description]
     *
     * @return {integer} The state of this Tween.
     */
    setStateFromStart: function (tween, tweenData, diff)
    {
        if (tweenData.repeatCounter > 0)
        {
            tweenData.repeatCounter--;

            //  Account for any extra time we got from the previous frame
            tweenData.elapsed = diff;
            tweenData.progress = diff / tweenData.duration;

            if (tweenData.flipX)
            {
                tweenData.target.toggleFlipX();
            }

            if (tweenData.flipY)
            {
                tweenData.target.toggleFlipY();
            }

            var onRepeat = tween.callbacks.onRepeat;

            if (onRepeat)
            {
                //  Element 1 is reserved for the target of the repeat (and needs setting here)
                onRepeat.params[1] = tweenData.target;

                onRepeat.func.apply(onRepeat.scope, onRepeat.params);
            }

            tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.start);

            //  Delay?
            if (tweenData.repeatDelay > 0)
            {
                tweenData.elapsed = tweenData.repeatDelay - diff;

                tweenData.current = tweenData.start;

                tweenData.target[tweenData.key] = tweenData.current;

                return TWEEN_CONST.REPEAT_DELAY;
            }
            else
            {
                return TWEEN_CONST.PLAYING_FORWARD;
            }
        }

        return TWEEN_CONST.COMPLETE;
    },

    //  
    /**
     * [description]
     *
     * @method Phaser.Tweens.Tween#updateTweenData
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - [description]
     * @param {Phaser.Tweens.TweenData} tweenData - [description]
     * @param {number} delta - Either a value in ms, or 1 if Tween.useFrames is true
     *
     * @return {boolean} [description]
     */
    updateTweenData: function (tween, tweenData, delta)
    {
        switch (tweenData.state)
        {
            case TWEEN_CONST.PLAYING_FORWARD:
            case TWEEN_CONST.PLAYING_BACKWARD:

                if (!tweenData.target)
                {
                    tweenData.state = TWEEN_CONST.COMPLETE;
                    break;
                }

                var elapsed = tweenData.elapsed;
                var duration = tweenData.duration;
                var diff = 0;

                elapsed += delta;

                if (elapsed > duration)
                {
                    diff = elapsed - duration;
                    elapsed = duration;
                }

                var forward = (tweenData.state === TWEEN_CONST.PLAYING_FORWARD);
                var progress = elapsed / duration;

                var v;

                if (forward)
                {
                    v = tweenData.ease(progress);
                }
                else
                {
                    v = tweenData.ease(1 - progress);
                }

                tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);

                tweenData.target[tweenData.key] = tweenData.current;

                tweenData.elapsed = elapsed;
                tweenData.progress = progress;

                var onUpdate = tween.callbacks.onUpdate;

                if (onUpdate)
                {
                    onUpdate.params[1] = tweenData.target;

                    onUpdate.func.apply(onUpdate.scope, onUpdate.params);
                }

                if (progress === 1)
                {
                    if (forward)
                    {
                        if (tweenData.hold > 0)
                        {
                            tweenData.elapsed = tweenData.hold - diff;

                            tweenData.state = TWEEN_CONST.HOLD_DELAY;
                        }
                        else
                        {
                            tweenData.state = this.setStateFromEnd(tween, tweenData, diff);
                        }
                    }
                    else
                    {
                        tweenData.state = this.setStateFromStart(tween, tweenData, diff);
                    }
                }

                break;

            case TWEEN_CONST.DELAY:

                tweenData.elapsed -= delta;

                if (tweenData.elapsed <= 0)
                {
                    tweenData.elapsed = Math.abs(tweenData.elapsed);

                    tweenData.state = TWEEN_CONST.PENDING_RENDER;
                }

                break;

            case TWEEN_CONST.REPEAT_DELAY:

                tweenData.elapsed -= delta;

                if (tweenData.elapsed <= 0)
                {
                    tweenData.elapsed = Math.abs(tweenData.elapsed);

                    tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
                }

                break;

            case TWEEN_CONST.HOLD_DELAY:

                tweenData.elapsed -= delta;

                if (tweenData.elapsed <= 0)
                {
                    tweenData.state = this.setStateFromEnd(tween, tweenData, Math.abs(tweenData.elapsed));
                }

                break;

            case TWEEN_CONST.PENDING_RENDER:

                if (tweenData.target)
                {
                    tweenData.start = tweenData.getStartValue(tweenData.target, tweenData.key, tweenData.target[tweenData.key]);

                    tweenData.end = tweenData.getEndValue(tweenData.target, tweenData.key, tweenData.start);

                    tweenData.current = tweenData.start;

                    tweenData.target[tweenData.key] = tweenData.start;

                    tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
                }
                else
                {
                    tweenData.state = TWEEN_CONST.COMPLETE;
                }

                break;
        }

        //  Return TRUE if this TweenData still playing, otherwise return FALSE
        return (tweenData.state !== TWEEN_CONST.COMPLETE);
    }

});

Tween.TYPES = [
    'onComplete',
    'onLoop',
    'onRepeat',
    'onStart',
    'onUpdate',
    'onYoyo'
];

/**
 * Creates a new Tween object.
 *
 * Note: This method will only be available Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#tween
 * @since 3.0.0
 *
 * @param {object} config - The Tween configuration.
 * 
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectFactory.register('tween', function (config)
{
    return this.scene.sys.tweens.add(config);
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

/**
 * Creates a new Tween object and returns it.
 *
 * Note: This method will only be available if Tweens have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#tween
 * @since 3.0.0
 *
 * @param {object} config - The Tween configuration.
 * 
 * @return {Phaser.Tweens.Tween} The Tween that was created.
 */
GameObjectCreator.register('tween', function (config)
{
    return this.scene.sys.tweens.create(config);
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.

module.exports = Tween;
