/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Time constructor.
*
* @class Phaser.Time
* @classdesc This is the core internal game clock. It manages the elapsed time and calculation of elapsed values, used for game object motion and tweens.
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
*/
Phaser.Time = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {number} time - Game time counter. If you need a value for in-game calculation please use Phaser.Time.now instead.
    * @protected
    */
    this.time = 0;

    /**
    * @property {number} now - The time right now.
    * @protected
    */
    this.now = 0;

    /**
    * @property {number} elapsed - Elapsed time since the last frame (in ms).
    * @protected
    */
    this.elapsed = 0;

    /**
    * @property {number} pausedTime - Records how long the game has been paused for. Is reset each time the game pauses.
    * @protected
    */
    this.pausedTime = 0;

    /**
    * @property {boolean} advancedTiming - If true Phaser.Time will perform advanced profiling including the fps rate, fps min/max and msMin and msMax.
    * @default
    */
    this.advancedTiming = false;

    /**
    * @property {number} fps - Frames per second. Only calculated if Time.advancedTiming is true.
    * @protected
    */
    this.fps = 0;

    /**
    * @property {number} fpsMin - The lowest rate the fps has dropped to. Only calculated if Time.advancedTiming is true.
    */
    this.fpsMin = 1000;

    /**
    * @property {number} fpsMax - The highest rate the fps has reached (usually no higher than 60fps). Only calculated if Time.advancedTiming is true.
    */
    this.fpsMax = 0;

    /**
    * @property {number} msMin - The minimum amount of time the game has taken between two frames. Only calculated if Time.advancedTiming is true.
    * @default
    */
    this.msMin = 1000;

    /**
    * @property {number} msMax - The maximum amount of time the game has taken between two frames. Only calculated if Time.advancedTiming is true.
    */
    this.msMax = 0;

    /**
    * @property {number} physicsElapsed - The elapsed time calculated for the physics motion updates. In a stable 60fps system this will be 0.016 every frame.
    */
    this.physicsElapsed = 0;

    /**
    * @property {number} deltaCap - If you need to cap the delta timer, set the value here. For 60fps the delta should be 0.016, so try variances just above this.
    */
    this.deltaCap = 0;

    /**
    * @property {number} timeCap - If the difference in time between two frame updates exceeds this value, the frame time is reset to avoid huge elapsed counts.
    */
    this.timeCap = 1000;

    /**
    * @property {number} frames - The number of frames record in the last second. Only calculated if Time.advancedTiming is true.
    */
    this.frames = 0;

    /**
    * @property {number} pauseDuration - Records how long the game was paused for in miliseconds.
    */
    this.pauseDuration = 0;

    /**
    * @property {number} timeToCall - The value that setTimeout needs to work out when to next update
    */
    this.timeToCall = 0;

    /**
    * @property {number} lastTime - Internal value used by timeToCall as part of the setTimeout loop
    */
    this.lastTime = 0;

    /**
    * @property {Phaser.Timer} events - This is a Phaser.Timer object bound to the master clock to which you can add timed events.
    */
    this.events = new Phaser.Timer(this.game, false);

    /**
    * @property {number} _started - The time at which the Game instance started.
    * @private
    */
    this._started = 0;

    /**
    * @property {number} _timeLastSecond - The time (in ms) that the last second counter ticked over.
    * @private
    */
    this._timeLastSecond = 0;

    /**
    * @property {number} _pauseStarted - The time the game started being paused.
    * @private
    */
    this._pauseStarted = 0;

    /**
    * @property {boolean} _justResumed - Internal value used to recover from the game pause state.
    * @private
    */
    this._justResumed = false;

    /**
    * @property {array} _timers - Internal store of Phaser.Timer objects.
    * @private
    */
    this._timers = [];

    /**
    * @property {number} _len - Temp. array length variable.
    * @private
    */
    this._len = 0;

    /**
    * @property {number} _i - Temp. array counter variable.
    * @private
    */
    this._i = 0;

};

Phaser.Time.prototype = {

    /**
    * Called automatically by Phaser.Game after boot. Should not be called directly.
    *
    * @method Phaser.Time#boot
    * @protected
    */
    boot: function () {

        this._started = Date.now();
        this.events.start();

    },

    /**
    * Adds an existing Phaser.Timer object to the Timer pool.
    *
    * @method Phaser.Time#add
    * @param {Phaser.Timer} timer - An existing Phaser.Timer object.
    * @return {Phaser.Timer} The given Phaser.Timer object.
    */
    add: function (timer) {

        this._timers.push(timer);

        return timer;

    },

    /**
    * Creates a new stand-alone Phaser.Timer object.
    *
    * @method Phaser.Time#create
    * @param {boolean} [autoDestroy=true] - A Timer that is set to automatically destroy itself will do so after all of its events have been dispatched (assuming no looping events).
    * @return {Phaser.Timer} The Timer object that was created.
    */
    create: function (autoDestroy) {

        if (typeof autoDestroy === 'undefined') { autoDestroy = true; }

        var timer = new Phaser.Timer(this.game, autoDestroy);

        this._timers.push(timer);

        return timer;

    },

    /**
    * Remove all Timer objects, regardless of their state. Also clears all Timers from the Time.events timer.
    *
    * @method Phaser.Time#removeAll
    */
    removeAll: function () {

        for (var i = 0; i < this._timers.length; i++)
        {
            this._timers[i].destroy();
        }

        this._timers = [];

        this.events.removeAll();

    },

    /**
    * Updates the game clock and if enabled the advanced timing data. This is called automatically by Phaser.Game.
    *
    * @method Phaser.Time#update
    * @protected
    * @param {number} time - The current timestamp.
    */
    update: function (time) {

        this.now = time;

        this.timeToCall = this.game.math.max(0, 16 - (time - this.lastTime));

        this.elapsed = this.now - this.time;

        //  spike-dislike
        if (this.elapsed > this.timeCap)
        {
            //  For some reason the time between now and the last time the game was updated was larger than our timeCap
            //  This can happen if the Stage.disableVisibilityChange is true and you swap tabs, which makes the raf pause.
            //  In this case we'll drop to some default values to stop the game timers going nuts.
            this.elapsed = 1 / 60;
        }

        //  Calculate physics elapsed, ensure it's > 0, use 1/60 as a fallback
        this.physicsElapsed = this.elapsed / 1000 || 1 / 60;

        if (this.deltaCap > 0 && this.physicsElapsed > this.deltaCap)
        {
            this.physicsElapsed = this.deltaCap;
        }

        if (this.advancedTiming)
        {
            this.msMin = this.game.math.min(this.msMin, this.elapsed);
            this.msMax = this.game.math.max(this.msMax, this.elapsed);

            this.frames++;

            if (this.now > this._timeLastSecond + 1000)
            {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = this.game.math.min(this.fpsMin, this.fps);
                this.fpsMax = this.game.math.max(this.fpsMax, this.fps);
                this._timeLastSecond = this.now;
                this.frames = 0;
            }
        }

        this.time = this.now;
        this.lastTime = time + this.timeToCall;

        //  Paused but still running?
        if (!this.game.paused)
        {
            //  Our internal Phaser.Timer
            this.events.update(this.now);

            //  Any game level timers
            this._i = 0;
            this._len = this._timers.length;

            while (this._i < this._len)
            {
                if (this._timers[this._i].update(this.now))
                {
                    this._i++;
                }
                else
                {
                    this._timers.splice(this._i, 1);

                    this._len--;
                }
            }
        }

    },

    /**
    * Called when the game enters a paused state.
    *
    * @method Phaser.Time#gamePaused
    * @private
    */
    gamePaused: function () {

        this._pauseStarted = this.now;

        this.events.pause();

        var i = this._timers.length;

        while (i--)
        {
            this._timers[i]._pause();
        }

    },

    /**
    * Called when the game resumes from a paused state.
    *
    * @method Phaser.Time#gameResumed
    * @private
    */
    gameResumed: function () {

        //  Level out the elapsed timer to avoid spikes
        this.time = this.now = Date.now();

        this.pauseDuration = this.time - this._pauseStarted;

        this.events.resume();

        var i = this._timers.length;

        while (i--)
        {
            this._timers[i]._resume();
        }

    },

    /**
    * The number of seconds that have elapsed since the game was started.
    *
    * @method Phaser.Time#totalElapsedSeconds
    * @return {number} The number of seconds that have elapsed since the game was started.
    */
    totalElapsedSeconds: function() {
        return (this.now - this._started) * 0.001;
    },

    /**
    * How long has passed since the given time.
    *
    * @method Phaser.Time#elapsedSince
    * @param {number} since - The time you want to measure against.
    * @return {number} The difference between the given time and now.
    */
    elapsedSince: function (since) {
        return this.now - since;
    },

    /**
    * How long has passed since the given time (in seconds).
    *
    * @method Phaser.Time#elapsedSecondsSince
    * @param {number} since - The time you want to measure (in seconds).
    * @return {number} Duration between given time and now (in seconds).
    */
    elapsedSecondsSince: function (since) {
        return (this.now - since) * 0.001;
    },

    /**
    * Resets the private _started value to now and removes all currently running Timers.
    *
    * @method Phaser.Time#reset
    */
    reset: function () {

        this._started = this.now;
        this.removeAll();

    }

};

Phaser.Time.prototype.constructor = Phaser.Time;
