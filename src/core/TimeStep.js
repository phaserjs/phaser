/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var GetValue = require('../utils/object/GetValue');
var NOOP = require('../utils/NOOP');
var RequestAnimationFrame = require('../dom/RequestAnimationFrame');

// http://www.testufo.com/#test=animation-time-graph

/**
 * @classdesc
 * The core runner class that Phaser uses to handle the game loop. It can use either Request Animation Frame,
 * or SetTimeout, based on browser support and config settings, to create a continuous loop within the browser.
 * 
 * Each time the loop fires, `TimeStep.step` is called and this is then passed onto the core Game update loop,
 * it is the core heartbeat of your game. It will fire as often as Request Animation Frame is capable of handling
 * on the target device.
 * 
 * Note that there are lots of situations where a browser will stop updating your game. Such as if the player
 * switches tabs, or covers up the browser window with another application. In these cases, the 'heartbeat'
 * of your game will pause, and only resume when focus is returned to it by the player. There is no way to avoid
 * this situation, all you can do is use the visibility events the browser, and Phaser, provide to detect when
 * it has happened and then gracefully recover.
 *
 * @class TimeStep
 * @memberof Phaser.Core
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance that owns this Time Step.
 * @param {Phaser.Types.Core.FPSConfig} config
 */
var TimeStep = new Class({

    initialize:

    function TimeStep (game, config)
    {
        /**
         * A reference to the Phaser.Game instance.
         *
         * @name Phaser.Core.TimeStep#game
         * @type {Phaser.Game}
         * @readonly
         * @since 3.0.0
         */
        this.game = game;

        /**
         * The Request Animation Frame DOM Event handler.
         *
         * @name Phaser.Core.TimeStep#raf
         * @type {Phaser.DOM.RequestAnimationFrame}
         * @readonly
         * @since 3.0.0
         */
        this.raf = new RequestAnimationFrame();

        /**
         * A flag that is set once the TimeStep has started running and toggled when it stops.
         *
         * @name Phaser.Core.TimeStep#started
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.0.0
         */
        this.started = false;

        /**
         * A flag that is set once the TimeStep has started running and toggled when it stops.
         * The difference between this value and `started` is that `running` is toggled when
         * the TimeStep is sent to sleep, where-as `started` remains `true`, only changing if
         * the TimeStep is actually stopped, not just paused.
         *
         * @name Phaser.Core.TimeStep#running
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.0.0
         */
        this.running = false;

        /**
         * The minimum fps rate you want the Time Step to run at.
         *
         * @name Phaser.Core.TimeStep#minFps
         * @type {integer}
         * @default 5
         * @since 3.0.0
         */
        this.minFps = GetValue(config, 'min', 5);

        /**
         * The target fps rate for the Time Step to run at.
         *
         * Setting this value will not actually change the speed at which the browser runs, that is beyond
         * the control of Phaser. Instead, it allows you to determine performance issues and if the Time Step
         * is spiraling out of control.
         *
         * @name Phaser.Core.TimeStep#targetFps
         * @type {integer}
         * @default 60
         * @since 3.0.0
         */
        this.targetFps = GetValue(config, 'target', 60);

        /**
         * The minFps value in ms.
         * Defaults to 200ms between frames (i.e. super slow!)
         *
         * @name Phaser.Core.TimeStep#_min
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._min = 1000 / this.minFps;

        /**
         * The targetFps value in ms.
         * Defaults to 16.66ms between frames (i.e. normal)
         *
         * @name Phaser.Core.TimeStep#_target
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._target = 1000 / this.targetFps;

        /**
         * An exponential moving average of the frames per second.
         *
         * @name Phaser.Core.TimeStep#actualFps
         * @type {integer}
         * @readonly
         * @default 60
         * @since 3.0.0
         */
        this.actualFps = this.targetFps;

        /**
         * The time at which the next fps rate update will take place.
         * When an fps update happens, the `framesThisSecond` value is reset.
         *
         * @name Phaser.Core.TimeStep#nextFpsUpdate
         * @type {integer}
         * @readonly
         * @default 0
         * @since 3.0.0
         */
        this.nextFpsUpdate = 0;

        /**
         * The number of frames processed this second.
         *
         * @name Phaser.Core.TimeStep#framesThisSecond
         * @type {integer}
         * @readonly
         * @default 0
         * @since 3.0.0
         */
        this.framesThisSecond = 0;

        /**
         * A callback to be invoked each time the Time Step steps.
         *
         * @name Phaser.Core.TimeStep#callback
         * @type {Phaser.Types.Core.TimeStepCallback}
         * @default NOOP
         * @since 3.0.0
         */
        this.callback = NOOP;

        /**
         * You can force the Time Step to use Set Timeout instead of Request Animation Frame by setting
         * the `forceSetTimeOut` property to `true` in the Game Configuration object. It cannot be changed at run-time.
         *
         * @name Phaser.Core.TimeStep#forceSetTimeOut
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.0.0
         */
        this.forceSetTimeOut = GetValue(config, 'forceSetTimeOut', false);

        /**
         * The time, calculated at the start of the current step, as smoothed by the delta value.
         *
         * @name Phaser.Core.TimeStep#time
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.time = 0;

        /**
         * The time at which the game started running. This value is adjusted if the game is then
         * paused and resumes.
         *
         * @name Phaser.Core.TimeStep#startTime
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.startTime = 0;

        /**
         * The time, as returned by `performance.now` of the previous step.
         *
         * @name Phaser.Core.TimeStep#lastTime
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.lastTime = 0;

        /**
         * The current frame the game is on. This counter is incremented once every game step, regardless of how much
         * time has passed and is unaffected by delta smoothing.
         *
         * @name Phaser.Core.TimeStep#frame
         * @type {integer}
         * @readonly
         * @default 0
         * @since 3.0.0
         */
        this.frame = 0;

        /**
         * Is the browser currently considered in focus by the Page Visibility API?
         * This value is set in the `blur` method, which is called automatically by the Game instance.
         *
         * @name Phaser.Core.TimeStep#inFocus
         * @type {boolean}
         * @readonly
         * @default true
         * @since 3.0.0
         */
        this.inFocus = true;

        /**
         * The timestamp at which the game became paused, as determined by the Page Visibility API.
         *
         * @name Phaser.Core.TimeStep#_pauseTime
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._pauseTime = 0;

        /**
         * An internal counter to allow for the browser 'cooling down' after coming back into focus.
         *
         * @name Phaser.Core.TimeStep#_coolDown
         * @type {integer}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._coolDown = 0;

        /**
         * The delta time, in ms, since the last game step. This is a clamped and smoothed average value.
         *
         * @name Phaser.Core.TimeStep#delta
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.delta = 0;

        /**
         * Internal index of the delta history position.
         *
         * @name Phaser.Core.TimeStep#deltaIndex
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.deltaIndex = 0;

        /**
         * Internal array holding the previous delta values, used for delta smoothing.
         *
         * @name Phaser.Core.TimeStep#deltaHistory
         * @type {integer[]}
         * @since 3.0.0
         */
        this.deltaHistory = [];

        /**
         * The maximum number of delta values that are retained in order to calculate a smoothed moving average.
         * 
         * This can be changed in the Game Config via the `fps.deltaHistory` property. The default is 10.
         *
         * @name Phaser.Core.TimeStep#deltaSmoothingMax
         * @type {integer}
         * @default 10
         * @since 3.0.0
         */
        this.deltaSmoothingMax = GetValue(config, 'deltaHistory', 10);

        /**
         * The number of frames that the cooldown is set to after the browser panics over the FPS rate, usually
         * as a result of switching tabs and regaining focus.
         * 
         * This can be changed in the Game Config via the `fps.panicMax` property. The default is 120.
         *
         * @name Phaser.Core.TimeStep#panicMax
         * @type {integer}
         * @default 120
         * @since 3.0.0
         */
        this.panicMax = GetValue(config, 'panicMax', 120);

        /**
         * The actual elapsed time in ms between one update and the next.
         * 
         * Unlike with `delta`, no smoothing, capping, or averaging is applied to this value.
         * So please be careful when using this value in math calculations.
         *
         * @name Phaser.Core.TimeStep#rawDelta
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.rawDelta = 0;

        /**
         * The time, as returned by `performance.now` at the very start of the current step.
         * This can differ from the `time` value in that it isn't calculated based on the delta value.
         *
         * @name Phaser.Core.TimeStep#now
         * @type {number}
         * @default 0
         * @since 3.18.0
         */
        this.now = 0;

        /**
         * Apply smoothing to the delta value used within Phasers internal calculations?
         * 
         * This can be changed in the Game Config via the `fps.smoothStep` property. The default is `true`.
         * 
         * Smoothing helps settle down the delta values after browser tab switches, or other situations
         * which could cause significant delta spikes or dips. By default it has been enabled in Phaser 3
         * since the first version, but is now exposed under this property (and the corresponding game config
         * `smoothStep` value), to allow you to easily disable it, should you require.
         *
         * @name Phaser.Core.TimeStep#smoothStep
         * @type {boolean}
         * @since 3.22.0
         */
        this.smoothStep = GetValue(config, 'smoothStep', true);
    },

    /**
     * Called by the Game instance when the DOM window.onBlur event triggers.
     *
     * @method Phaser.Core.TimeStep#blur
     * @since 3.0.0
     */
    blur: function ()
    {
        this.inFocus = false;
    },

    /**
     * Called by the Game instance when the DOM window.onFocus event triggers.
     *
     * @method Phaser.Core.TimeStep#focus
     * @since 3.0.0
     */
    focus: function ()
    {
        this.inFocus = true;

        this.resetDelta();
    },

    /**
     * Called when the visibility API says the game is 'hidden' (tab switch out of view, etc)
     *
     * @method Phaser.Core.TimeStep#pause
     * @since 3.0.0
     */
    pause: function ()
    {
        this._pauseTime = window.performance.now();
    },

    /**
     * Called when the visibility API says the game is 'visible' again (tab switch back into view, etc)
     *
     * @method Phaser.Core.TimeStep#resume
     * @since 3.0.0
     */
    resume: function ()
    {
        this.resetDelta();

        this.startTime += this.time - this._pauseTime;
    },

    /**
     * Resets the time, lastTime, fps averages and delta history.
     * Called automatically when a browser sleeps them resumes.
     *
     * @method Phaser.Core.TimeStep#resetDelta
     * @since 3.0.0
     */
    resetDelta: function ()
    {
        var now = window.performance.now();

        this.time = now;
        this.lastTime = now;
        this.nextFpsUpdate = now + 1000;
        this.framesThisSecond = 0;

        //  Pre-populate smoothing array

        for (var i = 0; i < this.deltaSmoothingMax; i++)
        {
            this.deltaHistory[i] = Math.min(this._target, this.deltaHistory[i]);
        }

        this.delta = 0;
        this.deltaIndex = 0;

        this._coolDown = this.panicMax;
    },

    /**
     * Starts the Time Step running, if it is not already doing so.
     * Called automatically by the Game Boot process.
     *
     * @method Phaser.Core.TimeStep#start
     * @since 3.0.0
     *
     * @param {Phaser.Types.Core.TimeStepCallback} callback - The callback to be invoked each time the Time Step steps.
     */
    start: function (callback)
    {
        if (this.started)
        {
            return this;
        }

        this.started = true;
        this.running = true;

        for (var i = 0; i < this.deltaSmoothingMax; i++)
        {
            this.deltaHistory[i] = this._target;
        }

        this.resetDelta();

        this.startTime = window.performance.now();

        this.callback = callback;

        this.raf.start(this.step.bind(this), this.forceSetTimeOut, this._target);
    },

    /**
     * The main step method. This is called each time the browser updates, either by Request Animation Frame,
     * or by Set Timeout. It is responsible for calculating the delta values, frame totals, cool down history and more.
     * You generally should never call this method directly.
     *
     * @method Phaser.Core.TimeStep#step
     * @since 3.0.0
     */
    step: function ()
    {
        //  Because the timestamp passed in from raf represents the beginning of the main thread frame that we’re currently in,
        //  not the actual time now, and as we want to compare this time value against Event timeStamps and the like, we need a
        //  more accurate one:

        var time = window.performance.now();

        this.now = time;

        var before = time - this.lastTime;

        if (before < 0)
        {
            //  Because, Chrome.
            before = 0;
        }

        this.rawDelta = before;

        var idx = this.deltaIndex;
        var history = this.deltaHistory;
        var max = this.deltaSmoothingMax;

        //  delta time (time is in ms)
        var dt = before;

        //  Delta Average
        var avg = before;

        //  When a browser switches tab, then comes back again, it takes around 10 frames before
        //  the delta time settles down so we employ a 'cooling down' period before we start
        //  trusting the delta values again, to avoid spikes flooding through our delta average

        if (this.smoothStep)
        {
            if (this._coolDown > 0 || !this.inFocus)
            {
                this._coolDown--;
    
                dt = Math.min(dt, this._target);
            }
    
            if (dt > this._min)
            {
                //  Probably super bad start time or browser tab context loss,
                //  so use the last 'sane' dt value
    
                dt = history[idx];
    
                //  Clamp delta to min (in case history has become corrupted somehow)
                dt = Math.min(dt, this._min);
            }
    
            //  Smooth out the delta over the previous X frames
    
            //  add the delta to the smoothing array
            history[idx] = dt;
    
            //  adjusts the delta history array index based on the smoothing count
            //  this stops the array growing beyond the size of deltaSmoothingMax
            this.deltaIndex++;
    
            if (this.deltaIndex > max)
            {
                this.deltaIndex = 0;
            }
    
            //  Loop the history array, adding the delta values together
            avg = 0;
    
            for (var i = 0; i < max; i++)
            {
                avg += history[i];
            }
    
            //  Then divide by the array length to get the average delta
            avg /= max;
        }

        //  Set as the world delta value
        this.delta = avg;

        //  Real-world timer advance
        this.time += this.rawDelta;

        // Update the estimate of the frame rate, `fps`. Every second, the number
        // of frames that occurred in that second are included in an exponential
        // moving average of all frames per second, with an alpha of 0.25. This
        // means that more recent seconds affect the estimated frame rate more than
        // older seconds.
        //
        // When a browser window is NOT minimized, but is covered up (i.e. you're using
        // another app which has spawned a window over the top of the browser), then it
        // will start to throttle the raf callback time. It waits for a while, and then
        // starts to drop the frame rate at 1 frame per second until it's down to just over 1fps.
        // So if the game was running at 60fps, and the player opens a new window, then
        // after 60 seconds (+ the 'buffer time') it'll be down to 1fps, so rafin'g at 1Hz.
        //
        // When they make the game visible again, the frame rate is increased at a rate of
        // approx. 8fps, back up to 60fps (or the max it can obtain)
        //
        // There is no easy way to determine if this drop in frame rate is because the
        // browser is throttling raf, or because the game is struggling with performance
        // because you're asking it to do too much on the device.

        if (time > this.nextFpsUpdate)
        {
            //  Compute the new exponential moving average with an alpha of 0.25.
            this.actualFps = 0.25 * this.framesThisSecond + 0.75 * this.actualFps;
            this.nextFpsUpdate = time + 1000;
            this.framesThisSecond = 0;
        }

        this.framesThisSecond++;

        //  Interpolation - how far between what is expected and where we are?
        var interpolation = avg / this._target;

        this.callback(time, avg, interpolation);

        //  Shift time value over
        this.lastTime = time;

        this.frame++;
    },

    /**
     * Manually calls `TimeStep.step`.
     *
     * @method Phaser.Core.TimeStep#tick
     * @since 3.0.0
     */
    tick: function ()
    {
        this.step();
    },

    /**
     * Sends the TimeStep to sleep, stopping Request Animation Frame (or SetTimeout) and toggling the `running` flag to false.
     *
     * @method Phaser.Core.TimeStep#sleep
     * @since 3.0.0
     */
    sleep: function ()
    {
        if (this.running)
        {
            this.raf.stop();

            this.running = false;
        }
    },

    /**
     * Wakes-up the TimeStep, restarting Request Animation Frame (or SetTimeout) and toggling the `running` flag to true.
     * The `seamless` argument controls if the wake-up should adjust the start time or not.
     *
     * @method Phaser.Core.TimeStep#wake
     * @since 3.0.0
     *
     * @param {boolean} [seamless=false] - Adjust the startTime based on the lastTime values.
     */
    wake: function (seamless)
    {
        if (this.running)
        {
            this.sleep();
        }
        else if (seamless)
        {
            this.startTime += -this.lastTime + (this.lastTime + window.performance.now());
        }

        this.raf.start(this.step.bind(this), this.useRAF);

        this.running = true;

        this.step();
    },

    /**
     * Gets the duration which the game has been running, in seconds.
     *
     * @method Phaser.Core.TimeStep#getDuration
     * @since 3.17.0
     *
     * @return {number} The duration in seconds.
     */
    getDuration: function ()
    {
        return Math.round(this.lastTime - this.startTime) / 1000;
    },

    /**
     * Gets the duration which the game has been running, in ms.
     *
     * @method Phaser.Core.TimeStep#getDurationMS
     * @since 3.17.0
     *
     * @return {number} The duration in ms.
     */
    getDurationMS: function ()
    {
        return Math.round(this.lastTime - this.startTime);
    },

    /**
     * Stops the TimeStep running.
     *
     * @method Phaser.Core.TimeStep#stop
     * @since 3.0.0
     *
     * @return {this} The TimeStep object.
     */
    stop: function ()
    {
        this.running = false;
        this.started = false;

        this.raf.stop();

        return this;
    },

    /**
     * Destroys the TimeStep. This will stop Request Animation Frame, stop the step, clear the callbacks and null
     * any objects.
     *
     * @method Phaser.Core.TimeStep#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stop();

        this.callback = NOOP;

        this.raf = null;
        this.game = null;
    }

});

module.exports = TimeStep;
