/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is the core internal game clock.
*
* It manages the elapsed time and calculation of elapsed values, used for game object motion and tweens,
* and also handlers the standard Timer pool.
*
* To create a general timed event, use the master {@link Phaser.Timer} accessible through {@link Phaser.Time.events events}.
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
    * While this value is in milliseconds and can be used to compute time deltas,
    * it must must _not_ be used with `Date.now()` as it may not use the same epoch / starting reference. 
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
    * to ensure consistent game timing. Game/logic timing can drift from real-world time if the system
    * is unable to consistently maintain the desired FPS.
    *
    * With fixed-step updates this is normally equivalent to `1.0 / desiredFps`.
    *
    * @property {number} physicsElapsed
    */
    this.physicsElapsed = 0;

    /**
    * The physics update delta, in milliseconds - equivalent to `physicsElapsed * 1000`.
    *
    * @property {number} physicsElapsedMS
    */
    this.physicsElapsedMS = 0;

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
    * Scaling factor to make the game move smoothly in slow motion
    * - 1.0 = normal speed
    * - 2.0 = half speed
    * @property {number} slowMotion
    * @default
    */
    this.slowMotion = 1.0;

    /**
    * If true then advanced profiling, including the fps rate, fps min/max and msMin/msMax are updated.
    * @property {boolean} advancedTiming
    * @default
    */
    this.advancedTiming = false;

    /**
    * Advanced timing result: The number of render frames record in the last second.
    *
    * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
    * @property {integer} frames
    * @readonly
    */
    this.frames = 0;

    /**
    * Advanced timing result: Frames per second.
    *
    * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
    * @property {number} fps
    * @readonly
    */
    this.fps = 0;

    /**
    * Advanced timing result: The lowest rate the fps has dropped to.
    *
    * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
    * This value can be manually reset.
    * @property {number} fpsMin
    */
    this.fpsMin = 1000;

    /**
    * Advanced timing result: The highest rate the fps has reached (usually no higher than 60fps).
    *
    * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
    * This value can be manually reset.
    * @property {number} fpsMax
    */
    this.fpsMax = 0;

    /**
    * Advanced timing result: The minimum amount of time the game has taken between consecutive frames.
    *
    * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
    * This value can be manually reset.
    * @property {number} msMin
    * @default
    */
    this.msMin = 1000;

    /**
    * Advanced timing result: The maximum amount of time the game has taken between consecutive frames.
    *
    * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
    * This value can be manually reset.
    * @property {number} msMax
    */
    this.msMax = 0;

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
    * A {@link Phaser.Timer} object bound to the master clock (this Time object) which events can be added to.
    * @property {Phaser.Timer} events
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
    * @property {Phaser.Timer[]} _timers - Internal store of Phaser.Timer objects.
    * @private
    */
    this._timers = [];

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
    * Remove all Timer objects, regardless of their state and clears all Timers from the {@link Phaser.Time#events events} timer.
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
    * @param {number} time - The current relative timestamp; see {@link Phaser.Time#now now}.
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

        this.physicsElapsedMS = this.physicsElapsed * 1000;

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
            var i = 0;
            var len = this._timers.length;

            while (i < len)
            {
                if (this._timers[i].update(this.time))
                {
                    i++;
                }
                else
                {
                    //  Timer requests to be removed
                    this._timers.splice(i, 1);
                    len--;
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
