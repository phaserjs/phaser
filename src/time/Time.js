/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is the core internal game clock.
* It manages the elapsed time and calculation of elapsed values, used for game object motion and tweens.
*
* @class Phaser.Time
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
*/
Phaser.Time = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    * @protected
    */
    this.game = game;

    /**
    * The `Date.now()` value when the time was last updated.
    * @property {integer} time
    * @protected
    */
    this.time = 0;

    /**
    * The `now` when the previous update occurred.
    * @property {number} prevTime
    * @protected
    */
    this.prevTime = 0;

    /**
    * An increasing value representing cumulative milliseconds since an undisclosed epoch.
    *
    * This value must _not_ be used with `Date.now()`.
    *
    * The source may either be from a high-res source (eg. if RAF is available) or the standard Date.now;
    * the value can only be relied upon within a particular game instance.
    *
    * @property {number} now
    * @protected
    */
    this.now = 0;

    /**
    * Elapsed time since the last time update, in milliseconds, based on `now`.
    *
    * This value _may_ include time that the game is paused/inactive.
    *
    * _Note:_ This is updated only once per game loop - even if multiple logic update steps are done.
    * Use {@link Phaser.Timer#physicsTime physicsTime} as a basis of game/logic calculations instead.
    *
    * @property {number} elapsed
    * @see Phaser.Time.time
    * @protected
    */
    this.elapsed = 0;

    /**
    * The time in ms since the last time update, in milliseconds, based on `time`.
    *
    * This value is corrected for game pauses and will be "about zero" after a game is resumed.
    *
    * _Note:_ This is updated once per game loop - even if multiple logic update steps are done.
    * Use {@link Phaser.Timer#physicsTime physicsTime} as a basis of game/logic calculations instead.
    *
    * @property {integer} elapsedMS 
    * @protected
    */
    this.elapsedMS = 0;

    /**
    * The physics update delta, in fractional seconds.
    *    
    * This should be used as an applicable multiplier by all logic update steps (eg. `preUpdate/postUpdate/update`)
    * to ensure consistent game timing.
    *
    * With fixed-step updates this normally equivalent to `1.0 / desiredFps`.
    *
    * @property {number} physicsElapsed
    */
    this.physicsElapsed = 0;

    /**
    * The desired frame rate of the game.
    *
    * This is used is used to calculate the physic/logic multiplier and how to apply catch-up logic updates.
    *
    * @property {number} desiredFps
    * @default
    */
    this.desiredFps = 60;

    /**
    * The suggested frame rate for your game, based on an averaged real frame rate.
    *
    * _Note:_ This is not available until after a few frames have passed; use it after a few seconds (eg. after the menus)
    *
    * @property {number} suggestedFps
    * @default
    */
    this.suggestedFps = null;

    /**
    * @property {number} slowMotion = 1.0 - Scaling factor to make the game move smoothly in slow motion (1.0 = normal speed, 2.0 = half speed)
    * @default
    */
    this.slowMotion = 1.0;

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
    * The number of render frames record in the last second. Only calculated if Time.advancedTiming is true.
    * @property {integer} frames
    */
    this.frames = 0;

    /**
    * The `time` when the game was last paused.
    * @property {number} pausedTime
    * @protected
    */
    this.pausedTime = 0;

    /**
    * Records how long the game was last paused, in miliseconds.
    * (This is not updated until the game is resumed.)
    * @property {number} pauseDuration
    */
    this.pauseDuration = 0;

    /**
    * @property {number} timeToCall - The value that setTimeout needs to work out when to next update
    * @protected
    */
    this.timeToCall = 0;

    /**
    * @property {number} timeExpected - The time when the next call is expected when using setTimer to control the update loop
    * @protected
    */
    this.timeExpected = 0;

    /**
    * @property {Phaser.Timer} events - This is a Phaser.Timer object bound to the master clock to which you can add timed events.
    */
    this.events = new Phaser.Timer(this.game, false);

    /**
     * @property {number} _frameCount - count the number of calls to time.update since the last suggestedFps was calculated
     * @private
     */
    this._frameCount = 0;

    /**
     * @property {number} _elapsedAcumulator - sum of the elapsed time since the last suggestedFps was calculated
     * @private
     */
    this._elapsedAccumulator = 0;

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
        this.time = Date.now();
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

        //  Set to the old Date.now value
        var previousDateNow = this.time;

        // this.time always holds Date.now, this.now may hold the RAF high resolution time value if RAF is available (otherwise it also holds Date.now)
        this.time = Date.now();

        //  Adjust accorindlgy.
        this.elapsedMS = this.time - previousDateNow;

        // 'now' is currently still holding the time of the last call, move it into prevTime
        this.prevTime = this.now;

        // update 'now' to hold the current time
        this.now = time;

        // elapsed time between previous call and now
        this.elapsed = this.now - this.prevTime;

        // time to call this function again in ms in case we're using timers instead of RequestAnimationFrame to update the game
        this.timeToCall = Math.floor(Math.max(0, (1000.0 / this.desiredFps) - (this.timeCallExpected - time)));

        // time when the next call is expected if using timers
        this.timeCallExpected = time + this.timeToCall;

        // count the number of time.update calls
        this._frameCount++;
        this._elapsedAccumulator += this.elapsed;

        // occasionally recalculate the suggestedFps based on the accumulated elapsed time
        if (this._frameCount >= this.desiredFps * 2)
        {
            // this formula calculates suggestedFps in multiples of 5 fps
            this.suggestedFps = Math.floor(200 / (this._elapsedAccumulator / this._frameCount)) * 5;
            this._frameCount = 0;
            this._elapsedAccumulator = 0;
        }

        //  Set the physics elapsed time... this will always be 1 / this.desiredFps because we're using fixed time steps in game.update now
        this.physicsElapsed = 1 / this.desiredFps;

        if (this.advancedTiming)
        {
            this.msMin = Math.min(this.msMin, this.elapsed);
            this.msMax = Math.max(this.msMax, this.elapsed);

            this.frames++;

            if (this.now > this._timeLastSecond + 1000)
            {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = Math.min(this.fpsMin, this.fps);
                this.fpsMax = Math.max(this.fpsMax, this.fps);
                this._timeLastSecond = this.now;
                this.frames = 0;
            }
        }

        //  Paused but still running?
        if (!this.game.paused)
        {
            //  Our internal Phaser.Timer
            this.events.update(this.time);

            //  Any game level timers
            this._i = 0;
            this._len = this._timers.length;

            while (this._i < this._len)
            {
                if (this._timers[this._i].update(this.time))
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

        this._pauseStarted = Date.now();

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

        // Set the parameter which stores Date.now() to make sure it's correct on resume
        this.time = Date.now();

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
        return (this.time - this._started) * 0.001;
    },

    /**
    * How long has passed since the given time.
    *
    * @method Phaser.Time#elapsedSince
    * @param {number} since - The time you want to measure against.
    * @return {number} The difference between the given time and now.
    */
    elapsedSince: function (since) {
        return this.time - since;
    },

    /**
    * How long has passed since the given time (in seconds).
    *
    * @method Phaser.Time#elapsedSecondsSince
    * @param {number} since - The time you want to measure (in seconds).
    * @return {number} Duration between given time and now (in seconds).
    */
    elapsedSecondsSince: function (since) {
        return (this.time - since) * 0.001;
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
