/// <reference path="../Game.ts" />
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

            this.game = game;

        }

        /** 
        * Local reference to game.
        * @property game
        * @type Game
        **/
        public game: Game;

        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool = false;

        /**
        * A reference to the event handlers to allow removeEventListener support
        */
        public _onMSPointerDown;
        public _onMSPointerMove;
        public _onMSPointerUp;

        /** 
        * Starts the event listeners running
        * @method start 
        */
        public start() {

            if (this.game.device.mspointer == true)
            {
                this._onMSPointerDown = (event) => this.onPointerDown(event);
                this._onMSPointerMove = (event) => this.onPointerMove(event);
                this._onMSPointerUp = (event) => this.onPointerUp(event);

                this.game.stage.canvas.addEventListener('MSPointerDown', this._onMSPointerDown, false);
                this.game.stage.canvas.addEventListener('MSPointerMove', this._onMSPointerMove, false);
                this.game.stage.canvas.addEventListener('MSPointerUp', this._onMSPointerUp, false);
            }

        }

        /** 
        * 
        * @method onPointerDown
        * @param {Any} event
        **/
        private onPointerDown(event) {

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this.game.input.startPointer(event);

        }

        /** 
        * 
        * @method onPointerMove
        * @param {Any} event
        **/
        private onPointerMove(event) {

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this.game.input.updatePointer(event);

        }

        /** 
        * 
        * @method onPointerUp
        * @param {Any} event
        **/
        private onPointerUp(event) {

            if (this.game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();
            event.identifier = event.pointerId;

            this.game.input.stopPointer(event);

        }

        /** 
        * Stop the event listeners
        * @method stop 
        */
        public stop() {

            if (this.game.device.mspointer == true)
            {
                this.game.stage.canvas.removeEventListener('MSPointerDown', this._onMSPointerDown);
                this.game.stage.canvas.removeEventListener('MSPointerMove', this._onMSPointerMove);
                this.game.stage.canvas.removeEventListener('MSPointerUp', this._onMSPointerUp);
            }

        }

    }

}