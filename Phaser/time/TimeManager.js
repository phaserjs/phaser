/// <reference path="../_definitions.ts" />
/**
* Phaser - TimeManager
*
* This is the game clock and it manages elapsed time and calculation of delta values, used for game object motion.
*/
var Phaser;
(function (Phaser) {
    var TimeManager = (function () {
        /**
        * Time constructor
        * Create a new <code>Time</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        */
        function TimeManager(game) {
            /**
            * Elapsed since last frame.
            * @type {number}
            */
            this.elapsed = 0;
            /**
            * Game time counter.
            * @property time
            * @type {number}
            */
            this.time = 0;
            /**
            * How long the game has been paused for. Gets reset each time the game pauses.
            * @property pausedTime
            * @type {number}
            */
            this.pausedTime = 0;
            /**
            * Time of current frame.
            * @property now
            * @type {number}
            */
            this.now = 0;
            /**
            * Elapsed time since last frame.
            * @property delta
            * @type {number}
            */
            this.delta = 0;
            /**
            * Frames per second.
            * @type {number}
            */
            this.fps = 0;
            /**
            * Minimal fps.
            * @type {number}
            */
            this.fpsMin = 1000;
            /**
            * Maximal fps.
            * @type {number}
            */
            this.fpsMax = 0;
            /**
            * Minimum duration between 2 frames.
            * @type {number}
            */
            this.msMin = 1000;
            /**
            * Maximum duration between 2 frames.
            * @type {number}
            */
            this.msMax = 0;
            /**
            * How many frames in last second.
            * @type {number}
            */
            this.frames = 0;
            /**
            * Time of last second.
            * @type {number}
            */
            this._timeLastSecond = 0;
            this.pauseDuration = 0;
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
            *
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
        * @param {number} raf The current timestamp, either performance.now or Date.now
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

        TimeManager.prototype.gamePaused = function () {
            this._pauseStarted = this.now;
        };

        TimeManager.prototype.gameResumed = function () {
            //  Level out the delta timer to avoid spikes
            this.pauseDuration = this.pausedTime;
        };

        /**
        * How long has passed since given time.
        * @method elapsedSince
        * @param {number} since The time you want to measure.
        * @return {number} Duration between given time and now.
        */
        TimeManager.prototype.elapsedSince = function (since) {
            return this.now - since;
        };

        /**
        * How long has passed since the given time (in seconds).
        * @method elapsedSecondsSince
        * @param {number} since The time you want to measure (in seconds).
        * @return {number} Duration between given time and now (in seconds).
        */
        TimeManager.prototype.elapsedSecondsSince = function (since) {
            return (this.now - since) * 0.001;
        };

        /**
        * Set the start time to now.
        * @method reset
        */
        TimeManager.prototype.reset = function () {
            this._started = this.now;
        };
        return TimeManager;
    })();
    Phaser.TimeManager = TimeManager;
})(Phaser || (Phaser = {}));
