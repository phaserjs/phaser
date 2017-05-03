var NOOP = require('../utils/NOOP');
var GetValue = require('../utils/object/GetValue');
var RequestAnimationFrame = require('../dom/RequestAnimationFrame');

//  Frame Rate config
//      fps: {
//          min: 10,
//          target: 60,
//          max: 120
//          forceSetTimeOut: false,
//          deltaHistory: 10
//     }

var VariableTimeStep = function (game, config)
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

    this.callback = NOOP;

    this.forceSetTimeOut = GetValue(config, 'forceSetTimeOut', false);

    this.time = 0;
    this.startTime = 0;
    this.lastTime = 0;

    this.delta = 0;
    this.deltaIndex = 0;
    this.deltaHistory = [];
    this.deltaSmoothingMax = GetValue(config, 'deltaHistory', 10);
};

VariableTimeStep.prototype.constructor = VariableTimeStep;

VariableTimeStep.prototype = {

    start: function (callback)
    {
        if (this.started)
        {
            return this;
        }

        this.started = true;
        this.running = true;

        var now = window.performance.now();

        this.time = now;
        this.startTime = now;
        this.lastTime = now;
        this.runOff = 0;

        //  Pre-populate smoothing array

        var history = [];

        for (var i = 0; i < this.deltaSmoothingMax; i++)
        {
            history[i] = this._target;
        }

        this.delta = 0;
        this.deltaIndex = 0;
        this.deltaHistory = history;

        this.callback = callback;

        this.raf.start(this.step.bind(this), this.forceSetTimeOut);
    },

    //  time comes from requestAnimationFrame and is either a high res time value,
    //  or Date.now if using setTimeout
    step: function (time)
    {
        var idx = this.deltaIndex;
        var history = this.deltaHistory;
        var max = this.deltaSmoothingMax;

        //  delta time (time is in ms)
        var dt = (time - this.lastTime);

        //  min / max range (yes, the < and > should be this way around)
        if (dt > this._min || dt < this._max)
        {
            //  Probably super bad start time or browser tab context loss,
            //  so use the last 'sane' dt value

            console.log('dt sync', dt, 'ms over', history[idx]);

            dt = history[idx];

            //  Clamp delta to min max range (in case history has become corrupted somehow)
            dt = Math.max(Math.min(dt, this._max), this._min);
        }

        //  Smooth out the delta over the previous X frames

        //  add the delta to the smoothing array
        history[idx] = dt;

        //  adjusts the delta history array index based on the smoothing count
        //  this stops the array growing beyond the size of deltaSmoothingMax
        this.deltaIndex = (idx + 1) % max;

        //  average
        var avg = 0;

        //  Loop the history array, adding the delta values together
        for (var i = 0; i < max; i++)
        {
            avg += history[i];
        }

        //  Then divide by the array length to get the average delta
        avg /= max;

        //  Set as the world delta value
        this.delta = avg;

        //  Real-world timer advance
        this.time += avg;

        this.callback(this.time, avg);

        //  Shift time value over
        this.lastTime = time;
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

module.exports = VariableTimeStep;
