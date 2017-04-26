var RequestAnimationFrame = require('../dom/RequestAnimationFrame');

var TickerLoop = function (game, framerate)
{
    this.game = game;

    this.raf = new RequestAnimationFrame();

    this.started = false;
    this.running = false;

    this.lastUpdate = 0;

    this.startTime = 0;
    this.elapsed = 0;
    this.time = 0;
    this.nextTime = 0;
    this.frame = 0;
    this.fps = false;

    this.lagThreshold = 500;
    this.adjustedLag = 33;

    this.useRAF = true;
};

TickerLoop.prototype.constructor = TickerLoop;

TickerLoop.prototype = {

    start: function (fps, useRAF)
    {
        if (this.started)
        {
            return this;
        }

        this.started = true;
        this.running = true;

        this.startTime = Date.now();
        this.lastUpdate = Date.now();

        this.useRAF = !!this.game.config.forceSetTimeOut;

        this.raf.start(this.step.bind(this), useRAF);
    },

    step: function (manual) {

        var elapsed = Date.now() - this.lastUpdate;

        if (elapsed > this.lagThreshold)
        {
            this.startTime += elapsed - this.adjustedLag;
        }

        this.lastUpdate += elapsed;

        this.time = (this.lastUpdate - this.startTime) / 1000;

        this.elapsed = elapsed;

        var overlap = this.time - this.nextTime;

        // var elapsed = _getTime() - _lastUpdate,
        //     overlap, dispatch;
        // if (elapsed > _lagThreshold) {
        //     _startTime += elapsed - _adjustedLag;
        // }
        // _lastUpdate += elapsed;
        // _self.time = (_lastUpdate - _startTime) / 1000;
        // overlap = _self.time - _nextTime;

        if (!this.fps || overlap > 0 || manual)
        {
            this.frame++;
            this.nextTime += overlap + (overlap >= this.gap ? 0.004 : this.gap - overlap);
        }

        // if (!manual)
        // {
        // }

        // if (!_fps || overlap > 0 || manual === true) {
        //     _self.frame++;
        //     _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
        //     dispatch = true;
        // }
        // if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
        //     _id = _req(_tick);
        // }
        // if (dispatch) {
        //     _self.dispatchEvent(_tickWord);
        // }


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

        this.raf.start(this.step.bind(this), useRAF);

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

module.exports = TickerLoop;
