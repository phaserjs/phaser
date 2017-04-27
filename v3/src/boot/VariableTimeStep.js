var NOOP = require('../utils/NOOP');
var RequestAnimationFrame = require('../dom/RequestAnimationFrame');

var VariableTimeStep = function (game, framerate)
{
    this.game = game;

    this.raf = new RequestAnimationFrame();

    this.started = false;
    this.running = false;

    this.fps = framerate;

    this.callback = NOOP;

    this.useRAF = true;

    this.time = 0;
    this.startTime = 0;
    this.lastTime = 0;

    this.delta = 0;
    this.deltaIndex = 0;
    this.deltaHistory = [];
    this.deltaSmoothingMax = 30;
};

VariableTimeStep.prototype.constructor = VariableTimeStep;

VariableTimeStep.prototype = {

    toString: function ()
    {
        return 'time: ' + this.time + ' delta: ' + this.delta;
    },

    start: function (useRAF, callback)
    {
        if (this.started)
        {
            return this;
        }

        this.started = true;
        this.running = true;

        this.time = Date.now();
        this.startTime = Date.now();
        this.lastTime = Date.now();

        //  Pre-populate smoothing array

        var history = [];

        for (var i = 0; i < this.deltaSmoothingMax; i++)
        {
            history[i] = 0;
        }

        this.delta = 0;
        this.deltaIndex = 0;
        this.deltaHistory = history;

        this.useRAF = useRAF;
        this.callback = callback;

        this.raf.start(this.step.bind(this), useRAF);
    },

    step: function (time)
    {
        //  delta time
        var dt = (time - this.lastTime) / 1000;

        if (dt < 0 || dt > 1)
        {
            //  Loop skip, probably super bad start time
            this.lastTime = time;
            return;
        }

        //  clamp delta to 0.0001 to 0.5 range
        dt = Math.max(Math.min(dt, 0.5), 0.0001);

        // Smooth out the delta over the previous 10 frames

        var idx = this.deltaIndex;
        var history = this.deltaHistory;
        var max = this.deltaSmoothingMax;

        //  add the delta to the smoothing array
        history[idx] = dt;

        //  adjusts the delta history array index based on the smoothing count
        //  this stops the array growing beyond the size of deltaSmoothingMax
        this.deltaIndex = (idx + 1) % max;

        //  average
        var avg = 0;

        //  Loop the array, adding the delta values together
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

        this.callback(this.time, avg * 1000);

        //  Shift time value over
        this.lastTime = time;
    },

    /*
    tick: function ()
    {
        this.step(true);
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
            this.startTime += -this.lastUpdate + (this.lastUpdate = Date.now());
        }
        else if (this.frame > 10)
        {
            this.lastUpdate = Date.now() - this.lagThreshold + 5;
        }

        this.raf.start(this.step.bind(this), this.useRAF);

        this.running = true;

        this.step(true);
    },

    setFps: function (value)
    {
        this.fps = value;
        this.gap = 1 / (value || 60);
        this.nextTime = this.time + this.gap;

        this.wake();
    },

    getFps: function ()
    {
        return this.fps;
    },
    */

    stop: function ()
    {
        this.running = false;
        this.started = false;

        this.raf.stop();

        return this;
    }

};

module.exports = VariableTimeStep;
