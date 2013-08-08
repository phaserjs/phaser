/// <reference path="../Game.ts" />

/**
* Phaser - RequestAnimationFrame
*
* Abstracts away the use of RAF or setTimeOut for the core game update loop. The callback can be re-mapped on the fly.
*/

module Phaser {

    export class RequestAnimationFrame {

        /** 
        * Constructor
        * @param {Any} callback
        * @return {RequestAnimationFrame} This object.
        */
        constructor(game: Game, callback) {

            this.game = game;
            this.callback = callback;

            var vendors = ['ms', 'moz', 'webkit', 'o'];

            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
            {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
            }

            this.start();

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        /**
        * The function to be called each frame. Will be called in the context of _game
        * @property callback
        * @type Any
        **/
        public callback;

        /**
        * 
        * @property _timeOutID
        * @type Any
        * @private
        **/
        private _timeOutID;

        /**
        * 
        * @property _isSetTimeOut
        * @type Boolean
        * @private
        **/
        private _isSetTimeOut: boolean = false;

        /**
        * 
        * @method usingSetTimeOut
        * @return Boolean
        **/
        public isUsingSetTimeOut(): boolean {

            return this._isSetTimeOut;

        }

        /**
        * 
        * @method usingRAF
        * @return Boolean
        **/
        public isUsingRAF(): boolean {

            return this._isSetTimeOut === true;

        }

        /**
        * 
        * @property isRunning
        * @type Boolean
        **/
        public isRunning: boolean = false;

        /**
        * A reference to the RAF/setTimeout to avoid constant anonymous function creation
        */
        public _onLoop;

        /**
        * Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
        * @method start
        * @param {Any} [callback] 
        **/
        public start(callback = null) {

            if (callback)
            {
                this.callback = callback;
            }

            if (!window.requestAnimationFrame)
            {
                this._isSetTimeOut = true;
                this._onLoop = () => this.SetTimeoutUpdate();
                this._timeOutID = window.setTimeout(this._onLoop, 0);
            }
            else
            {
                this._isSetTimeOut = false;
                this._onLoop = () => this.RAFUpdate(0);
                window.requestAnimationFrame(this._onLoop);
            }

            this.isRunning = true;

        }

        /**
        * Stops the requestAnimationFrame from running
        * @method stop 
        **/
        public stop() {

            if (this._isSetTimeOut)
            {
                clearTimeout(this._timeOutID);
            }
            else
            {
                window.cancelAnimationFrame;
            }

            this.isRunning = false;

        }

        /**
        * The update method for the requestAnimationFrame
        * @method RAFUpdate
        **/
        public RAFUpdate(time: number) {

            this.game.time.update(time);

            if (this.callback)
            {
                this.callback.call(this.game);
            }

            this._onLoop = (time) => this.RAFUpdate(time);

            window.requestAnimationFrame(this._onLoop);

        }

        /**
        * The update method for the setTimeout
        * @method SetTimeoutUpdate 
        **/
        public SetTimeoutUpdate() {

            this.game.time.update(Date.now());

            this._onLoop = () => this.SetTimeoutUpdate();

            this._timeOutID = window.setTimeout(this._onLoop, 16);

            if (this.callback)
            {
                this.callback.call(this.game);
            }

        }

    }

}