/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var TweenBuilder = require('./builders/TweenBuilder');
var TWEEN_CONST = require('./tween/const');

/**
 * @classdesc
 * [description]
 *
 * @class Timeline
 * @memberOf Phaser.Tweens
 * @extends EventEmitter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} manager - [description]
 */
var Timeline = new Class({

    Extends: EventEmitter,

    initialize:

    function Timeline (manager)
    {
        EventEmitter.call(this);

        /**
         * [description]
         *
         * @name Phaser.Tweens.Timeline#manager
         * @type {Phaser.Tweens.TweenManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * [description]
         *
         * @name Phaser.Tweens.Timeline#isTimeline
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.isTimeline = true;

        /**
         * An array of Tween objects, each containing a unique property and target being tweened.
         *
         * @name Phaser.Tweens.Timeline#data
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.data = [];

        /**
         * data array doesn't usually change, so we can cache the length
         *
         * @name Phaser.Tweens.Timeline#totalData
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalData = 0;

        /**
         * If true then duration, delay, etc values are all frame totals.
         *
         * @name Phaser.Tweens.Timeline#useFrames
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.useFrames = false;

        /**
         * Scales the time applied to this Tween. A value of 1 runs in real-time. A value of 0.5 runs 50% slower, and so on.
         * Value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
         *
         * @name Phaser.Tweens.Timeline#timeScale
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.timeScale = 1;

        /**
         * Loop this tween? Can be -1 for an infinite loop, or an integer.
         * When enabled it will play through ALL TweenDatas again (use TweenData.repeat to loop a single TD)
         *
         * @name Phaser.Tweens.Timeline#loop
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loop = 0;

        /**
         * Time in ms/frames before the tween loops.
         *
         * @name Phaser.Tweens.Timeline#loopDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopDelay = 0;

        /**
         * How many loops are left to run?
         *
         * @name Phaser.Tweens.Timeline#loopCounter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopCounter = 0;

        /**
         * Time in ms/frames before the 'onComplete' event fires. This never fires if loop = true (as it never completes)
         *
         * @name Phaser.Tweens.Timeline#completeDelay
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.completeDelay = 0;

        /**
         * Countdown timer (used by loopDelay and completeDelay)
         *
         * @name Phaser.Tweens.Timeline#countdown
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.countdown = 0;

        /**
         * The current state of the tween
         *
         * @name Phaser.Tweens.Timeline#state
         * @type {integer}
         * @since 3.0.0
         */
        this.state = TWEEN_CONST.PENDING_ADD;

        /**
         * The state of the tween when it was paused (used by Resume)
         *
         * @name Phaser.Tweens.Timeline#_pausedState
         * @type {integer}
         * @private
         * @since 3.0.0
         */
        this._pausedState = TWEEN_CONST.PENDING_ADD;

        /**
         * Does the Tween start off paused? (if so it needs to be started with Tween.play)
         *
         * @name Phaser.Tweens.Timeline#paused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.paused = false;

        /**
         * Elapsed time in ms/frames of this run through the Tween.
         *
         * @name Phaser.Tweens.Timeline#elapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.elapsed = 0;

        /**
         * Total elapsed time in ms/frames of the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Timeline#totalElapsed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalElapsed = 0;

        /**
         * Time in ms/frames for the whole Tween to play through once, excluding loop amounts and loop delays.
         *
         * @name Phaser.Tweens.Timeline#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * Value between 0 and 1. The amount through the Tween, excluding loops.
         *
         * @name Phaser.Tweens.Timeline#progress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * Time in ms/frames for all Tweens to complete (including looping)
         *
         * @name Phaser.Tweens.Timeline#totalDuration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalDuration = 0;

        /**
         * Value between 0 and 1. The amount through the entire Tween, including looping.
         *
         * @name Phaser.Tweens.Timeline#totalProgress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalProgress = 0;

        this.callbacks = {
            onComplete: null,
            onLoop: null,
            onStart: null,
            onUpdate: null,
            onYoyo: null
        };

        this.callbackScope;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#setTimeScale
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Tweens.Timeline} This Timeline object.
     */
    setTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#getTimeScale
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
     * @method Phaser.Tweens.Timeline#isPlaying
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
     * @method Phaser.Tweens.Timeline#add
     * @since 3.0.0
     *
     * @param {object} config - [description]
     *
     * @return {Phaser.Tweens.Timeline} This Timeline object.
     */
    add: function (config)
    {
        return this.queue(TweenBuilder(this, config));
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#queue
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - [description]
     *
     * @return {Phaser.Tweens.Timeline} This Timeline object.
     */
    queue: function (tween)
    {
        if (!this.isPlaying())
        {
            tween.parent = this;
            tween.parentIsTimeline = true;

            this.data.push(tween);

            this.totalData = this.data.length;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#hasOffset
     * @since 3.0.0
     *
     * @param {Phaser.Tweens.Tween} tween - [description]
     *
     * @return {boolean} [description]
     */
    hasOffset: function (tween)
    {
        return (tween.offset !== null);
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#isOffsetAbsolute
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {boolean} [description]
     */
    isOffsetAbsolute: function (value)
    {
        return (typeof(value) === 'number');
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#isOffsetRelative
     * @since 3.0.0
     *
     * @param {string} value - [description]
     *
     * @return {boolean} [description]
     */
    isOffsetRelative: function (value)
    {
        var t = typeof(value);

        if (t === 'string')
        {
            var op = value[0];

            if (op === '-' || op === '+')
            {
                return true;
            }
        }

        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#getRelativeOffset
     * @since 3.0.0
     *
     * @param {string} value - [description]
     * @param {number} base - [description]
     *
     * @return {number} [description]
     */
    getRelativeOffset: function (value, base)
    {
        var op = value[0];
        var num = parseFloat(value.substr(2));
        var result = base;

        switch (op)
        {
            case '+':
                result += num;
                break;

            case '-':
                result -= num;
                break;
        }

        //  Cannot ever be < 0
        return Math.max(0, result);
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#calcDuration
     * @since 3.0.0
     */
    calcDuration: function ()
    {
        var prevEnd = 0;
        var totalDuration = 0;
        var offsetDuration = 0;

        for (var i = 0; i < this.totalData; i++)
        {
            var tween = this.data[i];

            tween.init();

            if (this.hasOffset(tween))
            {
                if (this.isOffsetAbsolute(tween.offset))
                {
                    //  An actual number, so it defines the start point from the beginning of the timeline
                    tween.calculatedOffset = tween.offset;

                    if (tween.offset === 0)
                    {
                        offsetDuration = 0;
                    }
                }
                else if (this.isOffsetRelative(tween.offset))
                {
                    //  A relative offset (i.e. '-=1000', so starts at 'offset' ms relative to the PREVIOUS Tweens ending time)
                    tween.calculatedOffset = this.getRelativeOffset(tween.offset, prevEnd);
                }
            }
            else
            {
                //  Sequential
                tween.calculatedOffset = offsetDuration;
            }

            prevEnd = tween.totalDuration + tween.calculatedOffset;

            totalDuration += tween.totalDuration;
            offsetDuration += tween.totalDuration;
        }

        //  Excludes loop values
        this.duration = totalDuration;

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
     * @method Phaser.Tweens.Timeline#init
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    init: function ()
    {
        this.calcDuration();

        this.progress = 0;
        this.totalProgress = 0;

        if (this.paused)
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
     * @method Phaser.Tweens.Timeline#resetTweens
     * @since 3.0.0
     *
     * @param {boolean} resetFromLoop - [description]
     */
    resetTweens: function (resetFromLoop)
    {
        for (var i = 0; i < this.totalData; i++)
        {
            var tween = this.data[i];

            tween.play(resetFromLoop);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#setCallback
     * @since 3.0.0
     *
     * @param {string} type - [description]
     * @param {function} callback - [description]
     * @param {array} [params] - [description]
     * @param {object} [scope] - [description]
     *
     * @return {Phaser.Tweens.Timeline} This Timeline object.
     */
    setCallback: function (type, callback, params, scope)
    {
        if (Timeline.TYPES.indexOf(type) !== -1)
        {
            this.callbacks[type] = { func: callback, scope: scope, params: params };
        }

        return this;
    },

    /**
     * Delegates #makeActive to the Tween manager.
     *
     * @method Phaser.Tweens.Timeline#makeActive
     * @since 3.3.0
     *
     * @param {Phaser.Tweens.Tween} tween - The tween object to make active.
     *
     * @return {Phaser.Tweens.TweenManager} The Timeline's Tween Manager object.
     */
    makeActive: function (tween)
    {
        return this.manager.makeActive(tween);
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#play
     * @since 3.0.0
     */
    play: function ()
    {
        if (this.state === TWEEN_CONST.ACTIVE)
        {
            return;
        }

        if (this.paused)
        {
            this.paused = false;

            this.manager.makeActive(this);

            return;
        }
        else
        {
            this.resetTweens(false);

            this.state = TWEEN_CONST.ACTIVE;
        }

        var onStart = this.callbacks.onStart;

        if (onStart)
        {
            onStart.func.apply(onStart.scope, onStart.params);
        }

        this.emit('start', this);
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#nextState
     * @since 3.0.0
     */
    nextState: function ()
    {
        if (this.loopCounter > 0)
        {
            //  Reset the elapsed time
            //  TODO: Probably ought to be set to the remainder from elapsed - duration
            //  as the tweens nearly always over-run by a few ms due to rAf

            this.elapsed = 0;
            this.progress = 0;

            this.loopCounter--;

            var onLoop = this.callbacks.onLoop;

            if (onLoop)
            {
                onLoop.func.apply(onLoop.scope, onLoop.params);
            }

            this.emit('loop', this, this.loopCounter);

            this.resetTweens(true);

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
                onComplete.func.apply(onComplete.scope, onComplete.params);
            }

            this.emit('complete', this);

            this.state = TWEEN_CONST.PENDING_REMOVE;
        }
    },

    /**
     * Returns 'true' if this Timeline has finished and should be removed from the Tween Manager.
     * Otherwise, returns false.
     *
     * @method Phaser.Tweens.Timeline#update
     * @since 3.0.0
     *
     * @param {number} timestamp - [description]
     * @param {number} delta - [description]
     *
     * @return {boolean} Returns `true` if this Timeline has finished and should be removed from the Tween Manager.
     */
    update: function (timestamp, delta)
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            return;
        }

        var rawDelta = delta;

        if (this.useFrames)
        {
            delta = 1 * this.manager.timeScale;
        }

        delta *= this.timeScale;

        this.elapsed += delta;
        this.progress = Math.min(this.elapsed / this.duration, 1);

        this.totalElapsed += delta;
        this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

        switch (this.state)
        {
            case TWEEN_CONST.ACTIVE:

                var stillRunning = this.totalData;

                for (var i = 0; i < this.totalData; i++)
                {
                    var tween = this.data[i];

                    if (tween.update(timestamp, rawDelta))
                    {
                        stillRunning--;
                    }
                }

                var onUpdate = this.callbacks.onUpdate;

                if (onUpdate)
                {
                    onUpdate.func.apply(onUpdate.scope, onUpdate.params);
                }

                this.emit('update', this);

                //  Anything still running? If not, we're done
                if (stillRunning === 0)
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

            case TWEEN_CONST.COMPLETE_DELAY:

                this.countdown -= delta;

                if (this.countdown <= 0)
                {
                    var onComplete = this.callbacks.onComplete;

                    if (onComplete)
                    {
                        onComplete.func.apply(onComplete.scope, onComplete.params);
                    }

                    this.emit('complete', this);

                    this.state = TWEEN_CONST.PENDING_REMOVE;
                }

                break;
        }

        return (this.state === TWEEN_CONST.PENDING_REMOVE);
    },

    /**
     * Stops the Tween immediately, whatever stage of progress it is at and flags it for removal by the TweenManager.
     *
     * @method Phaser.Tweens.Timeline#stop
     * @since 3.0.0
     */
    stop: function ()
    {
        this.state = TWEEN_CONST.PENDING_REMOVE;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#pause
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.Timeline} This Timeline object.
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

        this.emit('pause', this);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#resume
     * @since 3.0.0
     *
     * @return {Phaser.Tweens.Timeline} This Timeline object.
     */
    resume: function ()
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            this.paused = false;

            this.state = this._pausedState;
        }

        this.emit('resume', this);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#hasTarget
     * @since 3.0.0
     *
     * @param {object} target - [description]
     *
     * @return {boolean} [description]
     */
    hasTarget: function (target)
    {
        for (var i = 0; i < this.data.length; i++)
        {
            if (this.data[i].hasTarget(target))
            {
                return true;
            }
        }

        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Tweens.Timeline#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        for (var i = 0; i < this.data.length; i++)
        {
            this.data[i].destroy();
        }

    }
});

Timeline.TYPES = [ 'onStart', 'onUpdate', 'onLoop', 'onComplete', 'onYoyo' ];

module.exports = Timeline;
