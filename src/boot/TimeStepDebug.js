/**
 * @ignore
 */

var Class = require('../utils/Class');
var GetValue = require('../utils/object/GetValue');
var NOOP = require('../utils/NOOP');
var RequestAnimationFrame = require('../dom/RequestAnimationFrame');

//  Frame Rate config
//      fps: {
//          min: 10,
//          target: 60,
//          forceSetTimeOut: false,
//          deltaHistory: 10,
//          panicMax: 120
//     }

// http://www.testufo.com/#test=animation-time-graph

var TimeStep = new Class({

    initialize:

    /**
     * [description]
     *
     * @class TimeStep
     * @memberOf Phaser.Boot
     * @constructor
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - [description]
     * @param {FPSConfig]} config - [description]
     */
    function TimeStep (game, config)
    {
        /**
         * A reference to the Phaser.Game instance.
         *
         * @property {Phaser.Game} game
         * @readOnly
         */
        this.game = game;

        /**
         * [description]
         *
         * @property {Phaser.DOM.RequestAnimationFrame} raf
         * @readOnly
         */
        this.raf = new RequestAnimationFrame();

        /**
         * [description]
         *
         * @property {boolean} started
         * @readOnly
         */
        this.started = false;

        /**
         * [description]
         *
         * @property {boolean} running
         * @readOnly
         */
        this.running = false;
        
        /**
         * [description]
         *
         * @property {integer} minFps
         */
        this.minFps = GetValue(config, 'min', 5);

        /**
         * [description]
         *
         * @property {integer} targetFps
         */
        this.targetFps = GetValue(config, 'target', 60);

        /**
         * [description]
         *
         * @property {number} _min
         * @private
         */
        this._min = 1000 / this.minFps;         //  200ms between frames (i.e. super slow!)

        /**
         * [description]
         *
         * @property {number} _target
         * @private
         */
        this._target = 1000 / this.targetFps;   //  16.666ms between frames (i.e. normal)

        //  200 / 1000 = 0.2 (5fps)
        //  8.333 / 1000 = 0.008333 (120fps)
        //  16.666 / 1000 = 0.01666 (60fps)

        /**
         * An exponential moving average of the frames per second.
         *
         * @property {integer} actualFps
         * @readOnly
         */
        this.actualFps = this.targetFps;

        /**
         * [description]
         *
         * @property {integer} nextFpsUpdate
         * @readOnly
         */
        this.nextFpsUpdate = 0;

        /**
         * [description]
         *
         * @property {integer} framesThisSecond
         * @readOnly
         */
        this.framesThisSecond = 0;

        /**
         * [description]
         *
         * @property {function} callback
         */
        this.callback = NOOP;

        /**
         * [description]
         *
         * @property {boolean} forceSetTimeOut
         * @readOnly
         */
        this.forceSetTimeOut = GetValue(config, 'forceSetTimeOut', false);

        /**
         * [description]
         *
         * @property {integer} time
         */
        this.time = 0;

        /**
         * [description]
         *
         * @property {integer} startTime
         */
        this.startTime = 0;

        /**
         * [description]
         *
         * @property {integer} lastTime
         */
        this.lastTime = 0;

        /**
         * [description]
         *
         * @property {integer} frame
         * @readOnly
         */
        this.frame = 0;

        /**
         * [description]
         *
         * @property {boolean} inFocus
         * @readOnly
         */
        this.inFocus = true;

        /**
         * [description]
         *
         * @property {integer} _pauseTime
         * @private
         */
        this._pauseTime = 0;

        /**
         * [description]
         *
         * @property {integer} _coolDown
         * @private
         */
        this._coolDown = 0;

        /**
         * [description]
         *
         * @property {integer} delta
         */
        this.delta = 0;

        /**
         * [description]
         *
         * @property {integer} deltaIndex
         */
        this.deltaIndex = 0;

        /**
         * [description]
         *
         * @property {array} deltaHistory
         */
        this.deltaHistory = [];

        /**
         * [description]
         *
         * @property {integer} deltaSmoothingMax
         * @default 10
         */
        this.deltaSmoothingMax = GetValue(config, 'deltaHistory', 10);

        /**
         * [description]
         *
         * @property {integer} panicMax
         * @default 120
         */
        this.panicMax = GetValue(config, 'panicMax', 120);

        /**
         * The actual elapsed time in ms between one update and the next.
         * Unlike with `delta` no smoothing, capping, or averaging is applied to this value.
         * So please be careful when using this value in calculations.
         *
         * @property {number} rawDelta
         */
        this.rawDelta = 0;
    },

    /**
     * Called when the DOM window.onBlur event triggers.
     *
     * @method Phaser.Boot.TimeStep#blur
     * @since 3.0.0
     */
    blur: function ()
    {
        this.inFocus = false;
    },

    /**
     * Called when the DOM window.onFocus event triggers.
     *
     * @method Phaser.Boot.TimeStep#focus
     * @since 3.0.0
     */
    focus: function ()
    {
        this.inFocus = true;

        this.resetDelta();
    },

    /**
     * Called when the visibility API says the game is 'hidden' (tab switch, etc)
     *
     * @method Phaser.Boot.TimeStep#pause
     * @since 3.0.0
     */
    pause: function ()
    {
        this._pauseTime = window.performance.now();
    },

    /**
     * Called when the visibility API says the game is 'visible' again (tab switch, etc)
     *
     * @method Phaser.Boot.TimeStep#resume
     * @since 3.0.0
     */
    resume: function ()
    {
        this.resetDelta();

        this.startTime += this.time - this._pauseTime;
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.TimeStep#resetDelta
     * @since 3.0.0
     */
    resetDelta: function ()
    {
        var now = window.performance.now();

        this.time = now;
        this.lastTime = now;
        this.nextFpsUpdate = now + 1000;
        this.framesThisSecond = 0;
        this.frame = 0;

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
     * [description]
     *
     * @method Phaser.Boot.TimeStep#start
     * @since 3.0.0
     *
     * @param {function} callback - [description]
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

        this.raf.start(this.step.bind(this), this.forceSetTimeOut);
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.TimeStep#step
     * @since 3.0.0
     *
     * @param {integer} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     */
    step: function (time)
    {
        //  Debug only
        // var debug = 0;
        // var dump = [];

        this.frame++;

        this.rawDelta = time - this.lastTime;

        var idx = this.deltaIndex;
        var history = this.deltaHistory;
        var max = this.deltaSmoothingMax;

        //  delta time (time is in ms)
        var dt = (time - this.lastTime);

        //  When a browser switches tab, then comes back again, it takes around 10 frames before
        //  the delta time settles down so we employ a 'cooling down' period before we start
        //  trusting the delta values again, to avoid spikes flooding through our delta average

        if (this._coolDown > 0 || !this.inFocus)
        {
            this._coolDown--;

            dt = Math.min(dt, this._target);

            // debug = (time - this.lastTime);
        }

        if (dt > this._min)
        {
            //  Probably super bad start time or browser tab context loss,
            //  so use the last 'sane' dt value

            // debug = dt;

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

        //  Delta Average
        var avg = 0;

        //  Loop the history array, adding the delta values together

        for (var i = 0; i < max; i++)
        {
            //   Debug
            // if (history[i] < 16 || history[i] > 17)
            // {
            //     dump.push({ i: i, dt: history[i] });
            // }

            avg += history[i];
        }

        //  Then divide by the array length to get the average delta
        avg /= max;

        //  Set as the world delta value
        this.delta = avg;

        //  Real-world timer advance
        // this.time += avg;
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

            // if (this.actualFps < 56)
            // {
            //     console.log(this.actualFps);
            //     console.log('F', this.frame, 'Avg', avg, 'Dt', debug, 'Panic', this._coolDown);
            // }
        }

        this.framesThisSecond++;

        //  Interpolation - how far between what is expected and where we are?
        var interpolation = avg / this._target;

        this.callback(time, avg, interpolation);

        //  Shift time value over
        this.lastTime = time;

        // if (debug !== 0)
        // {
        //     console.log('F', this.frame, 'Avg', avg, 'Dt', debug, 'Panic', this._coolDown);
        // }

        /*
        if (debug !== 0 || dump.length)
        {
            console.group('Frame ' + this.frame);
            console.log('Interpolation', interpolation, '%');

            if (debug)
            {
                console.log('Elapsed', debug, 'ms');
            }

            // console.log('Frame', this.frame, 'Delta', avg, '(average)', debug, '(now)');

            console.log('Delta', avg, '(average)');

            if (dump.length)
            {
                console.table(dump);
            }

            console.groupEnd();
        }
        */
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.TimeStep#tick
     * @since 3.0.0
     */
    tick: function ()
    {
        this.step(window.performance.now());
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.TimeStep#sleep
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
     * [description]
     *
     * @method Phaser.Boot.TimeStep#wake
     * @since 3.0.0
     *
     * @param {boolean} [seamless=false] - [description]
     */
    wake: function (seamless)
    {
        if (this.running)
        {
            this.sleep();
        }
        else if (seamless)
        {
            this.startTime += -this.lastTime + (this.lastTime = window.performance.now());
        }

        this.raf.start(this.step.bind(this), this.useRAF);

        this.running = true;

        this.step(window.performance.now());
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.TimeStep#setFps
     * @since 3.0.0
     *
     * @param {integer} value - [description]
     */
    setFps: function (value)
    {
        this.sleep();

        this.fps = value;

        this.wake();
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.TimeStep#getFps
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    getFps: function ()
    {
        return this.fps;
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.TimeStep#stop
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    stop: function ()
    {
        this.running = false;
        this.started = false;

        this.raf.stop();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Boot.TimeStep#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stop();
    }

});

module.exports = TimeStep;
