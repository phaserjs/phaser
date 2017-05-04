var NOOP = require('../utils/NOOP');
var RequestAnimationFrame = require('../dom/RequestAnimationFrame');

var Ticker = function (game, framerate)
{
    this.game = game;

    this.raf = new RequestAnimationFrame();

    this.started = false;
    this.running = false;

    this.lastUpdate = 0;

    this.gap = 1 / (framerate || 60);
    this.startTime = 0;
    this.elapsed = 0;
    this.time = 0;
    this.nextTime = 0;
    this.frame = 0;
    this.overlap = 0;
    this.fps = framerate;

    this.callback = NOOP;

    this.lagThreshold = 500;
    this.adjustedLag = 33;

    this.useRAF = true;
};

Ticker.prototype.constructor = Ticker;

Ticker.prototype = {

    toString: function ()
    {
        return 'time: ' + this.time + ' elapsed: ' + this.elapsed + ' overlap: ' + this.overlap;
    },

    start: function (useRAF, callback)
    {
        if (this.started)
        {
            return this;
        }

        this.started = true;
        this.running = true;

        var now = window.performance.now();

        this.startTime = now;
        this.lastUpdate = now;

        this.useRAF = useRAF;
        this.callback = callback;

        this.raf.start(this.step.bind(this), useRAF);
    },

    step: function (time, manual)
    {
        var elapsed = time - this.lastUpdate;

        if (elapsed > this.lagThreshold)
        {
            this.startTime += elapsed - this.adjustedLag;
        }

        this.lastUpdate += elapsed;

        var dt = (this.lastUpdate - this.startTime) / 1000;

        this.elapsed = elapsed;

        var overlap = dt - this.nextTime;

        this.overlap = overlap;

        this.time = dt;

        if (overlap > 0 || manual)
        {
            this.frame++;
            this.nextTime += overlap + ((overlap >= this.gap) ? 0.004 : this.gap - overlap);
            this.callback(elapsed);
        }
    },

    tick: function ()
    {
        this.step(true);
    },

    lagSmoothing: function (threshold, adjustedLag)
    {
        this.lagThreshold = threshold || (1 / 0.0000000001); //zero should be interpreted as basically unlimited
        this.adjustedLag = Math.min(adjustedLag, this.lagThreshold, 0);
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

    stop: function ()
    {
        this.running = false;
        this.started = false;

        this.raf.stop();

        return this;
    }

};

module.exports = Ticker;
