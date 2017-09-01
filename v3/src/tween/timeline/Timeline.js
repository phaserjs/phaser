var Class = require('../../utils/Class');
var TweenBuilder = require('../builder/TweenBuilder');
var TWEEN_CONST = require('../tween/const');

var Timeline = new Class({

    initialize:

    function Timeline (manager)
    {
        this.manager = manager;

        //  An array of Tween objects, each containing a unique property and target being tweened.
        this.data = [];

        //  data array doesn't usually change, so we can cache the length
        this.totalData = 0;

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

        //  Time in ms/frames for all Tweens to complete (including looping)
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

    add: function (config)
    {
        return this.queue(TweenBuilder(this, config));
    },

    queue: function (tween)
    {
        tween.timeline = this;

        this.data.push(tween);

        this.totalData = this.data.length;

        return this;
    },

    hasOffset: function (tween)
    {
        return (tween.offset !== null);
    },

    isOffsetAbsolute: function (value)
    {
        return (typeof(value) === 'number');
    },

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

    calcDuration: function ()
    {
        var prevEnd = 0;

        this.totalDuration = 0;

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

                    // console.log('Timeline.calcDuration', i, 'absolute', tween.calculatedOffset);
                }
                else if (this.isOffsetRelative(tween.offset))
                {
                    //  A relative offset (i.e. '-=1000', so starts at 'offset' ms relative to the PREVIOUS Tweens ending time)
                    tween.calculatedOffset = this.getRelativeOffset(tween.offset, prevEnd);

                    // console.log('Timeline.calcDuration', i, 'relative', tween.calculatedOffset);
                }
            }
            else
            {
                //  Sequential
                tween.calculatedOffset = this.totalDuration;
                
                // console.log('Timeline.calcDuration', i, 'sequential', tween.calculatedOffset);
            }

            prevEnd = tween.totalDuration + tween.calculatedOffset;

            // console.log('Span', i, tween.calculatedOffset, 'to', prevEnd);

            this.totalDuration += tween.totalDuration;
        }
    },

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
            //  Reset the TweenData
            // this.resetTweenData();

            for (var i = 0; i < this.totalData; i++)
            {
                var tween = this.data[i];

                tween.play();
            }

            this.state = TWEEN_CONST.ACTIVE;
        }

        var onStart = this.callbacks.onStart;

        if (onStart)
        {
            onStart.func.apply(onStart.scope, onStart.params);
        }
    },

    //  Returns 'true' if this Timeline has finished and should be removed from the Tween Manager
    //  Otherwise, returns false
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

                //  Anything still running? If not, we're done
                if (stillRunning === 0)
                {
                    // this.nextState();

                    console.log('Timeline.update nothing running');

                    this.state = TWEEN_CONST.PENDING_REMOVE;
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

                    this.state = TWEEN_CONST.PENDING_REMOVE;
                }

                break;
        }

        return (this.state === TWEEN_CONST.PENDING_REMOVE);
    },

    //  Stops the Tween immediately, whatever stage of progress it is at and flags it for removal by the TweenManager
    stop: function ()
    {
        this.state = TWEEN_CONST.PENDING_REMOVE;
    },

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

    resume: function ()
    {
        if (this.state === TWEEN_CONST.PAUSED)
        {
            this.paused = false;

            this.state = this._pausedState;
        }

        return this;
    },

    hasTarget: function ()
    {

    },

    destroy: function ()
    {

    }
});

module.exports = Timeline;
