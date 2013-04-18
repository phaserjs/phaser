/// <reference path="Game.ts" />

/**
*   Phaser
*/

module Phaser {

    export class Time {

        constructor(game: Game) {

            this._started = Date.now();
            this._timeLastSecond = this._started;
            this.time = this._started;

        }

        private _game: Game;
        private _started: number;


        public timeScale: number = 1.0;
        public elapsed: number = 0;

        /**
        *
        * @property time
        * @type Number
        */
        public time: number = 0;

        /**
        *
        * @property now
        * @type Number
        */
        public now: number = 0;

        /**
        *
        * @property delta
        * @type Number
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

        public fps: number = 0;
        public fpsMin: number = 1000;
        public fpsMax: number = 0;
        public msMin: number = 1000;
        public msMax: number = 0;
        public frames: number = 0;

        private _timeLastSecond: number = 0;

        /**
        *
        * @method update
        */
        public update() {

            // Can we use performance.now() ?
            this.now = Date.now(); // mark
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

            ////  Lock the delta at 0.1 to minimise fps tunneling
            //if (this.delta > 0.1)
            //{
            //    this.delta = 0.1;
            //}

        }

        /**
        *
        * @method elapsedSince
        * @param {Number} since
        * @return {Number}
        */
        public elapsedSince(since: number): number {

            return this.now - since;

        }

        /**
        *
        * @method elapsedSecondsSince
        * @param {Number} since
        * @return {Number}
        */
        public elapsedSecondsSince(since: number): number {

            return (this.now - since) * 0.001;

        }

        /**
        *
        * @method reset
        */
        public reset() {

            this._started = this.now;

        }

    }

}