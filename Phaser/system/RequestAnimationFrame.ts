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

            this._game = game;
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
         * Local private reference to game.
         */
        private _game: Game;

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
        private _isSetTimeOut: bool = false;

        /**
        * 
        * @method usingSetTimeOut
        * @return Boolean
        **/
        public isUsingSetTimeOut(): bool {

            return this._isSetTimeOut;

        }

        /**
        * 
        * @method usingRAF
        * @return Boolean
        **/
        public isUsingRAF(): bool {

            return this._isSetTimeOut === true;

        }

        /**
        * 
        * @property isRunning
        * @type Boolean
        **/
        public isRunning: bool = false;

        /**
        * Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
        * @method start
        * @param {Any} [callback] 
        **/
        public start(callback? = null) {

            if (callback)
            {
                this.callback = callback;
            }

            if (!window.requestAnimationFrame)
            {
                this._isSetTimeOut = true;
                this._timeOutID = window.setTimeout(() => this.SetTimeoutUpdate(), 0);
            }
            else
            {
                this._isSetTimeOut = false;
                window.requestAnimationFrame(() => this.RAFUpdate(0));
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

            this._game.time.update(time);

            if (this.callback)
            {
                this.callback.call(this._game);
            }

            window.requestAnimationFrame((time) => this.RAFUpdate(time));

        }

        /**
        * The update method for the setTimeout
        * @method SetTimeoutUpdate 
        **/
        public SetTimeoutUpdate() {

            this._game.time.update(Date.now());

            this._timeOutID = window.setTimeout(() => this.SetTimeoutUpdate(), 16.7);

            if (this.callback)
            {
                this.callback.call(this._game);
            }

        }

    }

}