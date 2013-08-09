/// <reference path="../_definitions.ts" />
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
var Phaser;
(function (Phaser) {
    var TimeManager = (function () {
        /**
        * This is the core internal game clock. It manages the elapsed time and calculation of delta values,
        * used for game object motion and tweens.
        *
        * @class TimeManager
        * @constructor
        * @param {Phaser.Game} game A reference to the currently running game.
        */
        function TimeManager(game) {
            /**
            * Number of milliseconds elapsed since the last frame update.
            * @property elapsed
            * @public
            * @type {Number}
            */
            this.elapsed = 0;
            /**
            * Game time counter.
            * @property time
            * @public
            * @type {Number}
            */
            this.time = 0;
            /**
            * Records how long the game has been paused for. Is reset each time the game pauses.
            * @property pausedTime
            * @public
            * @type {Number}
            */
            this.pausedTime = 0;
            /**
            * The time right now.
            * @property now
            * @public
            * @type {Number}
            */
            this.now = 0;
            /**
            * Elapsed time since the last frame.
            * @property delta
            * @public
            * @type {Number}
            */
            this.delta = 0;
            /**
            * Frames per second.
            * @property fps
            * @public
            * @type {Number}
            */
            this.fps = 0;
            /**
            * The lowest rate the fps has dropped to.
            * @property fpsMin
            * @public
            * @type {Number}
            */
            this.fpsMin = 1000;
            /**
            * The highest rate the fps has reached (usually no higher than 60fps).
            * @property fpsMax
            * @public
            * @type {Number}
            */
            this.fpsMax = 0;
            /**
            * The minimum amount of time the game has taken between two frames.
            * @property msMin
            * @public
            * @type {Number}
            */
            this.msMin = 1000;
            /**
            * The maximum amount of time the game has taken between two frames.
            * @property msMax
            * @public
            * @type {Number}
            */
            this.msMax = 0;
            /**
            * The number of frames record in the last second.
            * @property frames
            * @public
            * @type {Number}
            */
            this.frames = 0;
            /**
            * The time (in ms) that the last second counter ticked over.
            * @property _timeLastSecond
            * @private
            * @type {Number}
            */
            this._timeLastSecond = 0;
            /**
            * Records how long the game was paused for in miliseconds.
            * @property pauseDuration
            * @public
            * @type {Number}
            */
            this.pauseDuration = 0;
            /**
            * The time the game started being paused.
            * @property _pauseStarted
            * @private
            * @type {Number}
            */
            this._pauseStarted = 0;
            this.game = game;

            this._started = 0;
            this._timeLastSecond = this._started;
            this.time = this._started;

            this.game.onPause.add(this.gamePaused, this);
            this.game.onResume.add(this.gameResumed, this);
        }
        Object.defineProperty(TimeManager.prototype, "totalElapsedSeconds", {
            get: /**
            * The number of seconds that have elapsed since the game was started.
            * @method totalElapsedSeconds
            * @return {Number}
            */
            function () {
                return (this.now - this._started) * 0.001;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Update clock and calculate the fps.
        * This is called automatically by Game._raf
        * @method update
        * @param {Number} raf The current timestamp, either performance.now or Date.now
        */
        TimeManager.prototype.update = function (raf) {
            this.now = raf;
            this.delta = this.now - this.time;

            this.msMin = Math.min(this.msMin, this.delta);
            this.msMax = Math.max(this.msMax, this.delta);

            this.frames++;

            if (this.now > this._timeLastSecond + 1000) {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = Math.min(this.fpsMin, this.fps);
                this.fpsMax = Math.max(this.fpsMax, this.fps);

                this._timeLastSecond = this.now;
                this.frames = 0;
            }

            this.time = this.now;

            if (this.game.paused) {
                this.pausedTime = this.now - this._pauseStarted;
            }
        };

        /**
        * Called when the game enters a paused state.
        * @method gamePaused
        * @private
        */
        TimeManager.prototype.gamePaused = function () {
            this._pauseStarted = this.now;
        };

        /**
        * Called when the game resumes from a paused state.
        * @method gameResumed
        * @private
        */
        TimeManager.prototype.gameResumed = function () {
            //  Level out the delta timer to avoid spikes
            this.pauseDuration = this.pausedTime;
        };

        /**
        * How long has passed since the given time.
        * @method elapsedSince
        * @param {Number} since The time you want to measure against.
        * @return {Number} The difference between the given time and now.
        */
        TimeManager.prototype.elapsedSince = function (since) {
            return this.now - since;
        };

        /**
        * How long has passed since the given time (in seconds).
        * @method elapsedSecondsSince
        * @param {Number} since The time you want to measure (in seconds).
        * @return {Number} Duration between given time and now (in seconds).
        */
        TimeManager.prototype.elapsedSecondsSince = function (since) {
            return (this.now - since) * 0.001;
        };

        /**
        * Resets the private _started value to now.
        * @method reset
        */
        TimeManager.prototype.reset = function () {
            this._started = this.now;
        };
        return TimeManager;
    })();
    Phaser.TimeManager = TimeManager;
})(Phaser || (Phaser = {}));
