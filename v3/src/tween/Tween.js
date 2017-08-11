var Class = require('../utils/Class');
var TWEEN_CONST = require('./const');

var Tween = new Class({

    initialize:

    function Tween (manager, data)
    {
        this.manager = manager;

        //  An array of TweenData objects, each containing a unique property and target being tweened.
        this.data = data;

        //  data array doesn't change, so we can cache the length
        this.totalData = data.length;

        //  Cached target total (not necessarily the same as the data total)
        this.totalTargets = 0;

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

        //  Time in ms/frames before the 'onComplete' event fires. This never fires if loop = true (as it never completes)
        this.completeDelay = 0;

        //  Countdown timer (used by loopDelay and completeDelay)
        this.countdown = 0;

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
        var data = this.data;

        for (var i = 0; i < this.totalData; i++)
        {
            if (data[i].target === target)
            {
                return true;
            }
        }

        return false;
    },

    calcDuration: require('./components/CalcDuration'),
    init: require('./components/Init'),
    loadValues: require('./components/LoadValues'),
    nextState: require('./components/NextState'),
    pause: require('./components/Pause'),
    play: require('./components/Play'),
    resetTweenData: require('./components/ResetTweenData'),
    resume: require('./components/Resume'),
    seek: require('./components/Seek'),
    setEventCallback: require('./components/SetEventCallback'),
    stop: require('./components/Stop'),
    update: require('./components/Update')

});

module.exports = Tween;
