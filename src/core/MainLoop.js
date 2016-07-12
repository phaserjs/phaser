Phaser.MainLoop = function (game, framerate, forceSetTimeOut) {

    if (framerate === undefined) { framerate = 60; }
    if (forceSetTimeOut === undefined) { forceSetTimeOut = false; }

    this.game = game;

    //  Move to external file once tested
    /*
    this.getTime = function () { return Date.now; };

    if (window.performance)
    {
        if (window.performance.now)
        {
            this.getTime = window.performance.now;
        }
        else if (window.performance.webkitNow)
        {
            this.getTime = window.performance.webkitNow;
        }
    }
    */

    this.timestep = 1000 / framerate;
    this.physicsStep = 1 / framerate;

    // The cumulative amount of in-app time that hasn't been simulated yet.
    this.frameDelta = 0;

    // The timestamp in milliseconds of the last time the main loop was run.
    // Used to compute the time elapsed between frames.
    this.lastFrameTimeMs = 0;

    // An exponential moving average of the frames per second.
    this.framerate = framerate;
    this.fps = framerate;

    // The timestamp (in milliseconds) of the last time the `fps` moving
    // average was updated.
    this.lastFpsUpdate = 0;

    // The number of frames delivered in the current second.
    this.framesThisSecond = 0;

    // The number of times update() is called in a given frame. This is only
    // relevant inside of animate(), but a reference is held externally so that
    // this variable is not marked for garbage collection every time the main
    // loop runs.
    this.numUpdateSteps = 0;

    // The minimum amount of time in milliseconds that must pass since the last
    // frame was executed before another frame can be executed. The
    // multiplicative inverse caps the FPS (the default of zero means there is
    // no cap).
    this.minFrameDelay = 0;

    // Whether the main loop is running.
    this.running = false;

    // `true` if `MainLoop.start()` has been called and the most recent time it
    // was called has not been followed by a call to `MainLoop.stop()`. This is
    // different than `running` because there is a delay of a few milliseconds
    // after `MainLoop.start()` is called before the application is considered
    // "running." This delay is due to waiting for the next frame.
    this.started = false;

    // Whether the simulation has fallen too far behind real time.
    // Specifically, `panic` will be set to `true` if too many updates occur in
    // one frame. This is only relevant inside of animate(), but a reference is
    // held externally so that this variable is not marked for garbage
    // collection every time the main loop runs.
    this.panic = false;

    /**
    * @property {boolean} _isSetTimeOut  - true if the browser is using setTimeout instead of raf.
    * @private
    */
    this._isSetTimeOut = false;

    /**
    * @property {number} _handleID - The callback ID used when calling cancel.
    * @private
    */
    this._handleID = null;

};

Phaser.MainLoop.prototype = {

    start: function () {

        if (this.started)
        {
            return this;
        }

        this.started = true;
        this.running = true;

        //  draw once?

        this.lastFrameTimeMs = window.performance.now();
        this.lastFpsUpdate = window.performance.now();
        this.framesThisSecond = 0;

        if (!window.requestAnimationFrame || this.forceSetTimeOut)
        {
            // var _this = this;

            // The function that runs the main loop. The unprefixed version of
            // `window.requestAnimationFrame()` is available in all modern browsers
            // now, but node.js doesn't have it, so fall back to timers. The polyfill
            // is adapted from the MIT-licensed
            // https://github.com/underscorediscovery/realtime-multiplayer-in-html5


            /*
            this.raf = window.requestAnimationFrame || (function() {
                var lastTimestamp = Date.now(),
                    now,
                    timeout;
                return function(callback) {
                    now = Date.now();
                    // The next frame should run no sooner than the simulation allows,
                    // but as soon as possible if the current frame has already taken
                    // more time to run than is simulated in one timestep.
                    timeout = Math.max(0, _this.timestep - (now - lastTimestamp));
                    lastTimestamp = now + timeout;
                    return setTimeout(function() {
                        callback(now + timeout);
                    }, timeout);
                };
            })();
            */
            this._isSetTimeOut = true;

            this._handleID = window.setTimeout(this.step.bind(this), 0);
        }
        else
        {
            this._isSetTimeOut = false;

            this._handleID = window.requestAnimationFrame(this.step.bind(this));
        }

    },

    step: function (timestamp) {

        // console.log(timestamp);
        // debugger;

        // Throttle the frame rate (if minFrameDelay is set to a non-zero value by
        // `MainLoop.setMaxAllowedFPS()`).
        // if (timestamp < this.lastFrameTimeMs + this.minFrameDelay)
        // {
            // Run the loop again the next time the browser is ready to render.
            // this._handleID = window.requestAnimationFrame(this.step.bind(this));
            // return;
        // }

        // frameDelta is the cumulative amount of in-app time that hasn't been
        // simulated yet. Add the time since the last frame. We need to track total
        // not-yet-simulated time (as opposed to just the time elapsed since the
        // last frame) because not all actually elapsed time is guaranteed to be
        // simulated each frame. See the comments below for details.
        this.frameDelta += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        // Run any updates that are not dependent on time in the simulation. See
        // `MainLoop.setBegin()` for additional details on how to use this.

        //  BEGIN ---------------------------------------------------------------

        this.begin(timestamp);

        //  UPDATE ---------------------------------------------------------------

        // Update the estimate of the frame rate, `fps`. Every second, the number
        // of frames that occurred in that second are included in an exponential
        // moving average of all frames per second, with an alpha of 0.25. This
        // means that more recent seconds affect the estimated frame rate more than
        // older seconds.
        if (timestamp > this.lastFpsUpdate + 1000)
        {
            // Compute the new exponential moving average with an alpha of 0.25.
            // Using constants inline is okay here.
            this.fps = 0.25 * this.framesThisSecond + 0.75 * this.fps;

            this.lastFpsUpdate = timestamp;
            this.framesThisSecond = 0;
        }

        this.framesThisSecond++;

        this.numUpdateSteps = 0;

        while (this.frameDelta >= this.timestep)
        {
            this.update(this.timestep);

            this.frameDelta -= this.timestep;

            if (++this.numUpdateSteps >= 240)
            {
                this.panic = true;
                break;
            }
        }

        //  RENDER ---------------------------------------------------------------

        this.render(this.frameDelta / this.timestep);

        //  END ---------------------------------------------------------------

        // Run any updates that are not dependent on time in the simulation.
        // this.end(this.fps, this.panic);

        this.panic = false;

        this._handleID = window.requestAnimationFrame(this.step.bind(this));

    },

    begin: function (timestamp) {

        this.game.time.update(timestamp);

        this.game.scale.preUpdate(timestamp, this.frameDelta);
        this.game.debug.preUpdate(timestamp, this.frameDelta);
        this.game.camera.preUpdate(timestamp, this.frameDelta);
        this.game.physics.preUpdate(timestamp, this.frameDelta);
        this.game.state.preUpdate(timestamp, this.frameDelta);
        this.game.plugins.preUpdate(timestamp, this.frameDelta);
        this.game.stage.preUpdate(timestamp, this.frameDelta);

    },

    update: function (timestep) {

        this.game.state.update(timestep);
        this.game.stage.update(timestep);
        this.game.tweens.update(timestep);
        this.game.sound.update(timestep);
        this.game.input.update(timestep);
        this.game.physics.update(timestep);
        this.game.particles.update(timestep);
        this.game.plugins.update(timestep);

        this.game.stage.postUpdate(timestep);
        this.game.plugins.postUpdate(timestep);

        this.game.stage.updateTransform();
        // this.game.time.update(timestamp);

    },

    render: function (dt) {

        this.game.renderer.renderSession.interpolation = dt;

        // this.game.stage.updateTransform();

        this.game.state.preRender(dt);

        if (this.game.renderType !== Phaser.HEADLESS)
        {
            this.game.renderer.render(this.game.stage);

            this.game.plugins.render(dt);

            this.game.state.render(dt);
        }

        this.game.plugins.postRender(dt);

    },

    stop: function () {

        this.running = false;
        this.started = false;

        if (this._isSetTimeOut)
        {
            clearTimeout(this._handleID);
        }
        else
        {
            window.cancelAnimationFrame(this._handleID);
        }

        return this;

    },

    resetFrameDelta: function () {

        var oldFrameDelta = this.frameDelta;

        this.frameDelta = 0;

        return oldFrameDelta;

    }

};

/**
* @name Phaser.MainLoop#maxFPS
* @property {number} maxFPS - The maximum frame rate.
*/
Object.defineProperty(Phaser.MainLoop.prototype, 'maxFPS', {

    get: function() {

        return 1000 / this.minFrameDelay;

    },

    set: function (value) {

        if (fps === 0)
        {
            this.stop();
        }
        else
        {
            this.minFrameDelay = 1000 / value;
        }

    }

});

Phaser.MainLoop.prototype.constructor = Phaser.MainLoop;

Phaser.NOOP = function () {
    //  No-operation
};
