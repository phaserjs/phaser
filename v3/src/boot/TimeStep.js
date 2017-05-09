var NOOP = require('../utils/NOOP');
var GetValue = require('../utils/object/GetValue');
var RequestAnimationFrame = require('../dom/RequestAnimationFrame');

//  Frame Rate config
//      fps: {
//          min: 10,
//          target: 60,
//          max: 120
//          forceSetTimeOut: false,
//          deltaHistory: 10,
//          panicMax: 120
//     }

var TimeStep = function (game, config)
{
    this.game = game;

    this.raf = new RequestAnimationFrame();

    this.started = false;
    this.running = false;
    
    this.minFps = GetValue(config, 'min', 5);
    this.maxFps = GetValue(config, 'max', 120);
    this.targetFps = GetValue(config, 'target', 60);

    this._min = 1000 / this.minFps;         //  200ms between frames (i.e. super slow!)
    this._max = 1000 / this.maxFps;         //  8.333ms between frames (i.e. super fast, 120Hz displays)
    this._target = 1000 / this.targetFps;   //  16.666ms between frames (i.e. normal)

    //  200 / 1000 = 0.2 (5fps)
    //  8.333 / 1000 = 0.008333 (120fps)
    //  16.666 / 1000 = 0.01666 (60fps)

    /**
    * @property {number} fps - An exponential moving average of the frames per second.
    * @readOnly
    */
    this.actualFps = this.targetFps;

    this.nextFpsUpdate = 0;
    this.framesThisSecond = 0;

    this.callback = NOOP;

    this.forceSetTimeOut = GetValue(config, 'forceSetTimeOut', false);

    this.time = 0;
    this.startTime = 0;
    this.lastTime = 0;
    this.frame = 0;

    this.inFocus = true;

    this._pauseTime = 0;
    this._coolDown = 0;

    this.delta = 0;
    this.deltaIndex = 0;
    this.deltaHistory = [];
    this.deltaSmoothingMax = GetValue(config, 'deltaHistory', 10);
    this.panicMax = GetValue(config, 'panicMax', 120);
};

TimeStep.prototype.constructor = TimeStep;

TimeStep.prototype = {

    //  Called when the DOM window.onBlur event triggers
    blur: function ()
    {
        this.inFocus = false;

        console.log('TimeStep.blur');
    },

    //  Called when the DOM window.onFocus event triggers
    focus: function ()
    {
        this.inFocus = true;

        console.log('TimeStep.focus');

        this.resetDelta();
    },

    //  Called when the visibility API says the game is 'hidden' (tab switch, etc)
    pause: function ()
    {
        console.log('TimeStep.pause');

        this._pauseTime = window.performance.now();
    },

    //  Called when the visibility API says the game is 'visible' again (tab switch, etc)
    resume: function ()
    {
        this.resetDelta();

        this.startTime += this.time - this._pauseTime;

        console.log('TimeStep.resume - paused for', (this.time - this._pauseTime));
    },

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
            this.deltaHistory[i] = this._target;
        }

        this.delta = 0;
        this.deltaIndex = 0;

        this._coolDown = this.panicMax;
    },

    start: function (callback)
    {
        if (this.started)
        {
            return this;
        }

        this.started = true;
        this.running = true;

        this.deltaHistory = [];

        this.resetDelta();

        this.startTime = window.performance.now();

        this.callback = callback;

        this.raf.start(this.step.bind(this), this.forceSetTimeOut);
    },

    //  time comes from requestAnimationFrame and is either a high res time value,
    //  or Date.now if using setTimeout
    step: function (time)
    {
        //  Debug only
        // var debug = 0;
        // var dump = [];

        this.frame++;

        var idx = this.deltaIndex;
        var history = this.deltaHistory;
        var max = this.deltaSmoothingMax;

        //  delta time (time is in ms)
        var dt;

        //  When a browser switches tab, then comes back again, it takes around 10 frames before
        //  the delta time settles down so we employ a 'cooling down' period before we start
        //  trusting the delta values again, to avoid spikes flooding through our delta average

        if (this._coolDown > 0 || !this.inFocus)
        {
            this._coolDown--;

            dt = this._target;
            // debug = (time - this.lastTime);
        }
        else
        {
            dt = (time - this.lastTime);
        }

        //  min / max range (yes, the < and > should be this way around)
        if (dt > this._min || dt < this._max)
        {
            //  Probably super bad start time or browser tab context loss,
            //  so use the last 'sane' dt value

            // debug = dt;

            dt = history[idx];

            //  Clamp delta to min max range (in case history has become corrupted somehow)
            dt = Math.max(Math.min(dt, this._max), this._min);
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
        this.time += avg;

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

        this.callback(this.time, avg, interpolation);

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

    tick: function ()
    {
        this.step(window.performance.now());
    },

    sleep: function ()
    {
        if (this.running)
        {
            this.raf.stop();
            
            this.running = false;
        }
    },

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

    setFps: function (value)
    {
        this.fps = value;

        this.wake();
    },

    getFps: function ()
    {
        return this.fps;
    },

    stop: function ()
    {
        this.running = false;
        this.started = false;

        this.raf.stop();

        return this;
    }
};

module.exports = TimeStep;
