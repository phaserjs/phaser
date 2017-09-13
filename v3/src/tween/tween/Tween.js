var Class = require('../../utils/Class');
var TWEEN_CONST = require('./const');

var Tween = new Class({

    initialize:

    function Tween (parent, data, targets)
    {
        this.parent = parent;

        //  Is the parent of this Tween a Timeline?
        this.parentIsTimeline = parent.hasOwnProperty('isTimeline');

        //  An array of TweenData objects, each containing a unique property and target being tweened.
        this.data = data;

        //  data array doesn't change, so we can cache the length
        this.totalData = data.length;

        //  An array of references to the target/s this Tween is operating on
        this.targets = targets;

        //  Cached target total (not necessarily the same as the data total)
        this.totalTargets = targets.length;

        //  If true then duration, delay, etc values are all frame totals
        this.useFrames = false;

        //  Scales the time applied to this Tween. A value of 1 runs in real-time. A value of 0.5 runs 50% slower, and so on.
        //  Value isn't used when calculating total duration of the tween, it's a run-time delta adjustment only.
        this.timeScale = 1;

        //  Loop this tween? Can be -1 for an infinite loop, or an integer.
        //  When enabled it will play through ALL TweenDatas again (use TweenData.repeat to loop a single TD)
        this.loop = 0;

        //  Time in ms/frames before the tween loops.
        this.loopDelay = 0;

        //  How many loops are left to run?
        this.loopCounter = 0;

        //  Time in ms/frames before the 'onComplete' event fires. This never fires if loop = -1 (as it never completes)
        this.completeDelay = 0;

        //  Countdown timer (used by timeline offset, loopDelay and completeDelay)
        this.countdown = 0;

        //  Set only if this Tween is part of a Timeline.
        this.offset = 0;

        //  Set only if this Tween is part of a Timeline. The calculated offset amount.
        this.calculatedOffset = 0;

        //  The current state of the tween
        this.state = TWEEN_CONST.PENDING_ADD;

        //  The state of the tween when it was paused (used by Resume)
        this._pausedState = TWEEN_CONST.PENDING_ADD;

        //  Does the Tween start off paused? (if so it needs to be started with Tween.play)
        this.paused = false;

        //  Elapsed time in ms/frames of this run through the Tween.
        this.elapsed = 0;

        //  Total elapsed time in ms/frames of the entire Tween, including looping.
        this.totalElapsed = 0;

        //  Time in ms/frames for the whole Tween to play through once, excluding loop amounts and loop delays
        this.duration = 0;

        //  Value between 0 and 1. The amount through the Tween, excluding loops.
        this.progress = 0;

        //  Time in ms/frames for the Tween to complete (including looping)
        this.totalDuration = 0;

        //  Value between 0 and 1. The amount through the entire Tween, including looping.
        this.totalProgress = 0;

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

    setTimeScale: function (value)
    {
        this.timeScale = value;

        return this;
    },

    getTimeScale: function ()
    {
        return this.timeScale;
    },

    isPlaying: function ()
    {
        return (this.state === TWEEN_CONST.ACTIVE);
    },

    hasTarget: function (target)
    {
        return (this.targets.indexOf(target) !== -1);
    },

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

    restart: function ()
    {
        this.stop();
        this.play();
    },

    calcDuration: require('./inc/CalcDuration'),
    init: require('./inc/Init'),
    nextState: require('./inc/NextState'),
    pause: require('./inc/Pause'),
    play: require('./inc/Play'),
    resetTweenData: require('./inc/ResetTweenData'),
    resume: require('./inc/Resume'),
    seek: require('./inc/Seek'),
    setCallback: require('./inc/SetCallback'),
    stop: require('./inc/Stop'),
    update: require('./inc/Update')

});

Tween.TYPES = [
    'onComplete',
    'onLoop',
    'onRepeat',
    'onStart',
    'onUpdate',
    'onYoyo'
];

module.exports = Tween;
