/// <reference path="Game.ts" />
/**
* Phaser - Time
*
* This is the game clock and it manages elapsed time and calculation of delta values, used for game object motion.
*/
var Phaser;
(function (Phaser) {
    var Time = (function () {
        /**
        * Time constructor
        * Create a new <code>Time</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        */
        function Time(game) {
            /**
            * Time scale factor.
            * Set it to 0.5 for slow motion, to 2.0 makes game twice faster.
            * @type {number}
            */
            this.timeScale = 1.0;
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
            * Mininal duration between 2 frames.
            * @type {number}
            */
            this.msMin = 1000;
            /**
            * Maximal duration between 2 frames.
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
            this._started = 0;
            this._timeLastSecond = this._started;
            this.time = this._started;
            this._game = game;
        }
        Object.defineProperty(Time.prototype, "totalElapsedSeconds", {
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
        Time.prototype.update = /**
        * Update clock and calculate the fps.
        * This is called automatically by Game._raf
        * @method update
        * @param {number} raf The current timestamp, either performance.now or Date.now
        */
        function (raf) {
            this.now = raf// mark
            ;
            //this.now = Date.now(); // mark
            this.delta = this.now - this.time// elapsedMS
            ;
            this.msMin = Math.min(this.msMin, this.delta);
            this.msMax = Math.max(this.msMax, this.delta);
            this.frames++;
            if(this.now > this._timeLastSecond + 1000) {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = Math.min(this.fpsMin, this.fps);
                this.fpsMax = Math.max(this.fpsMax, this.fps);
                this._timeLastSecond = this.now;
                this.frames = 0;
            }
            this.time = this.now// _total
            ;
        };
        Time.prototype.elapsedSince = /**
        * How long has passed since given time.
        * @method elapsedSince
        * @param {number} since The time you want to measure.
        * @return {number} Duration between given time and now.
        */
        function (since) {
            return this.now - since;
        };
        Time.prototype.elapsedSecondsSince = /**
        * How long has passed since give time (in seconds).
        * @method elapsedSecondsSince
        * @param {number} since The time you want to measure (in seconds).
        * @return {number} Duration between given time and now (in seconds).
        */
        function (since) {
            return (this.now - since) * 0.001;
        };
        Time.prototype.reset = /**
        * Set the start time to now.
        * @method reset
        */
        function () {
            this._started = this.now;
        };
        return Time;
    })();
    Phaser.Time = Time;    
})(Phaser || (Phaser = {}));
