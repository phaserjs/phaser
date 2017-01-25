/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

// My thanks to Isaac Sukin for creating MainLoop.js, on which lots of this is based.

var MainLoop = function (framerate)
{
    /**
    * @property {number} timestep - The amount of time (in milliseconds) to simulate each time update() runs.
    */
    this.timestep = 1000 / framerate;

    /**
    * @property {number} physicsStep - 1 / framerate.
    */
    this.physicsStep = 1 / framerate;

    /**
    * @property {number} frameDelta - The cumulative amount of in-app time that hasn't been simulated yet.
    */
    this.frameDelta = 0;

    /**
    * The timestamp in milliseconds of the last time the main loop was run.
    * Used to compute the time elapsed between frames.
    * @property {number} lastFrameTimeMs
    */
    this.lastFrameTimeMs = 0;

    /**
    * @property {number} fps - An exponential moving average of the frames per second.
    */
    this.fps = 60;

    /**
    * @property {number} lastFpsUpdate - The timestamp (in milliseconds) of the last time the `fps` moving average was updated.
    */
    this.lastFpsUpdate = 0;

    /**
    * @property {number} framesThisSecond - The number of frames delivered in the current second.
    */
    this.framesThisSecond = 0;

    /**
    * @property {number} numUpdateSteps - The number of times update() is called in a given frame.
    */
    this.numUpdateSteps = 0;

    /**
    * The minimum amount of time in milliseconds that must pass since the last frame was executed
    * before another frame can be executed.
    * The multiplicative inverse caps the FPS (the default of zero means there is no cap)
    * @property {number} minFrameDelay
    */
    this.minFrameDelay = 0;

    /**
    * @property {boolean} running - Whether the main loop is running.
    */
    this.running = false;

    /**
     * `true` if `MainLoop.start()` has been called and the most recent time it
     * was called has not been followed by a call to `MainLoop.stop()`. This is
     * different than `running` because there is a delay of a few milliseconds
     * after `MainLoop.start()` is called before the application is considered
     * "running." This delay is due to waiting for the next frame.
    * @property {boolean} started
    */
    this.started = false;

    /**
     * Whether the simulation has fallen too far behind real time.
     * Specifically, `panic` will be set to `true` if too many updates occur in
     * one frame. This is only relevant inside of animate(), but a reference is
     * held externally so that this variable is not marked for garbage
     * collection every time the main loop runs.
    * @property {boolean} panic - Whether the simulation has fallen too far behind real time.
    */
    this.panic = false;
};

MainLoop.prototype.constructor = MainLoop;

MainLoop.prototype = {

    setMaxFPS: function (fps)
    {
        if (fps === 0)
        {
            this.stop();
        }
        else
        {
            this.minFrameDelay = 1000 / fps;
        }
    },

    getMaxFPS: function ()
    {
        return 1000 / this.minFrameDelay;
    },

    resetFrameDelta: function ()
    {
        var oldFrameDelta = this.frameDelta;

        this.frameDelta = 0;

        return oldFrameDelta;
    },

    start: function ()
    {
        if (this.started)
        {
            return this;
        }

        this.started = true;
        this.running = true;

        this.lastFrameTimeMs = window.performance.now();
        this.lastFpsUpdate = window.performance.now();
        this.framesThisSecond = 0;
    },

    //  timestamp = DOMHighResTimeStamp
    // active = array containing: ({ index: i, state: state })

    step: function (timestamp, active, renderer)
    {
        // Throttle the frame rate (if minFrameDelay is set to a non-zero value by
        // `MainLoop.setMaxAllowedFPS()`).
        if (active.length === 0 || timestamp < this.lastFrameTimeMs + this.minFrameDelay)
        {
            return;
        }

        // frameDelta is the cumulative amount of in-app time that hasn't been
        // simulated yet. Add the time since the last frame. We need to track total
        // not-yet-simulated time (as opposed to just the time elapsed since the
        // last frame) because not all actually elapsed time is guaranteed to be
        // simulated each frame. See the comments below for details.
        this.frameDelta += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        //  Run any updates that are not dependent on time in the simulation.
        //  Here we'll need to run things like tween.update, input.update, etc.

        for (var i = 0; i < active.length; i++)
        {
            active[i].state.sys.begin(timestamp, this.frameDelta);
        }

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
            for (var i = 0; i < active.length; i++)
            {
                active[i].state.sys.update(this.timestep, this.physicsStep);
            }

            this.frameDelta -= this.timestep;

            if (++this.numUpdateSteps >= 240)
            {
                this.panic = true;
                break;
            }
        }

        //  Render

        var interpolation = this.frameDelta / this.timestep;

        renderer.preRender();

        for (i = 0; i < active.length; i++)
        {
            active[i].state.sys.render(interpolation, renderer);
        }

        renderer.postRender();

        if (this.panic)
        {
            // This pattern introduces non-deterministic behavior, but in this case
            // it's better than the alternative (the application would look like it
            // was running very quickly until the simulation caught up to real
            // time).
            var discardedTime = Math.round(this.resetFrameDelta());

            console.warn('Main loop panicked, tab probably put in the background. Discarding ' + discardedTime + 'ms');
        }

        this.panic = false;
    },

    stop: function ()
    {
        this.running = false;
        this.started = false;

        return this;
    }

};

module.exports = MainLoop;
