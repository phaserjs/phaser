/// <reference path="../Game.ts" />

/**
* Phaser - TimeManager
*
* This is the game clock and it manages elapsed time and calculation of delta values, used for game object motion.
*/

module Phaser {

    export class TimeManager {

        /**
         * Time constructor
         * Create a new <code>Time</code>.
         *
         * @param game {Phaser.Game} Current game instance.
         */
        constructor(game: Game) {

            this.game = game;

            this._started = 0;
            this._timeLastSecond = this._started;
            this.time = this._started;

        }

        /**
         * Local reference to game.
         */
        public game: Game;

        /**
         * Time when this object created.
         * @param {number}
         */
        private _started: number;

        /**
         * Time scale factor.
         * Set it to 0.5 for slow motion, to 2.0 makes game twice faster.
         * @type {number}
         */
        public timeScale: number = 1.0;

        /**
         * Elapsed since last frame.
         * @type {number}
         */
        public elapsed: number = 0;

        /**
         * Game time counter.
         * @property time
         * @type {number}
         */
        public time: number = 0;

        /**
         * Time of current frame.
         * @property now
         * @type {number}
         */
        public now: number = 0;

        /**
         * Elapsed time since last frame.
         * @property delta
         * @type {number}
         */
        public delta: number = 0;

        /**
        *
        * @method totalElapsedSeconds
        * @return {Number}
        */
        public get totalElapsedSeconds(): number {

            return (this.now - this._started) * 0.001;

        }

        /**
         * Frames per second.
         * @type {number}
         */
        public fps: number = 0;

        /**
         * Minimal fps.
         * @type {number}
         */
        public fpsMin: number = 1000;

        /**
         * Maximal fps.
         * @type {number}
         */
        public fpsMax: number = 0;

        /**
         * Mininal duration between 2 frames.
         * @type {number}
         */
        public msMin: number = 1000;

        /**
         * Maximal duration between 2 frames.
         * @type {number}
         */
        public msMax: number = 0;

        /**
         * How many frames in last second.
         * @type {number}
         */
        public frames: number = 0;

        /**
         * Time of last second.
         * @type {number}
         */
        private _timeLastSecond: number = 0;

        /**
         * Update clock and calculate the fps.
         * This is called automatically by Game._raf
         * @method update
         * @param {number} raf The current timestamp, either performance.now or Date.now
         */
        public update(raf: number) {

            this.now = raf; // mark
            //this.now = Date.now(); // mark
            this.delta = this.now - this.time; // elapsedMS

            this.msMin = Math.min(this.msMin, this.delta);
            this.msMax = Math.max(this.msMax, this.delta);

            this.frames++;

            if (this.now > this._timeLastSecond + 1000)
            {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = Math.min(this.fpsMin, this.fps);
                this.fpsMax = Math.max(this.fpsMax, this.fps);

                this._timeLastSecond = this.now;
                this.frames = 0;
            }

            this.time = this.now; // _total

        }

        /**
         * How long has passed since given time.
         * @method elapsedSince
         * @param {number} since The time you want to measure.
         * @return {number} Duration between given time and now.
         */
        public elapsedSince(since: number): number {

            return this.now - since;

        }

        /**
         * How long has passed since give time (in seconds).
         * @method elapsedSecondsSince
         * @param {number} since The time you want to measure (in seconds).
         * @return {number} Duration between given time and now (in seconds).
         */
        public elapsedSecondsSince(since: number): number {

            return (this.now - since) * 0.001;

        }

        /**
         * Set the start time to now.
         * @method reset
         */
        public reset() {

            this._started = this.now;

        }

    }

}