/// <reference path="../../Game.ts" />
/// <reference path="Pointer.ts" />

/**
* Phaser - MSPointer
*
* The MSPointer class handles touch interactions with the game and the resulting Pointer objects.
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript. 
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
*/

module Phaser {

    export class MSPointer {

        /** 
        * Constructor
        * @param {Game} game.
        * @return {MSPointer} This object.
        */
        constructor(game: Game) {

            this._game = game;

        }

        /** 
        * Local private reference to game.
        * @property _game
        * @type Game
        * @private
        **/
        private _game: Game;

        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool = false;

        /** 
        * Starts the event listeners running
        * @method start 
        */
        public start() {

            if (this._game.device.mspointer == true)
            {
                this._game.stage.canvas.addEventListener('MSPointerDown', (event) => this.onPointerDown(event), false);
                this._game.stage.canvas.addEventListener('MSPointerMove', (event) => this.onPointerMove(event), false);
                this._game.stage.canvas.addEventListener('MSPointerUp', (event) => this.onPointerUp(event), false);
            }

        }

        /** 
        * 
        * @method onPointerDown
        * @param {Any} event
        **/
        private onPointerDown(event) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this._game.input.startPointer(event);

        }

        /** 
        * 
        * @method onPointerMove
        * @param {Any} event
        **/
        private onPointerMove(event) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this._game.input.updatePointer(event);

        }

        /** 
        * 
        * @method onPointerUp
        * @param {Any} event
        **/
        private onPointerUp(event) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this._game.input.stopPointer(event);

        }

        /** 
        * Stop the event listeners
        * @method stop 
        */
        public stop() {

            if (this._game.device.mspointer == true)
            {
                //this._game.stage.canvas.addEventListener('MSPointerDown', (event) => this.onPointerDown(event), false);
                //this._game.stage.canvas.addEventListener('MSPointerMove', (event) => this.onPointerMove(event), false);
                //this._game.stage.canvas.addEventListener('MSPointerUp', (event) => this.onPointerUp(event), false);
            }

        }

    }

}