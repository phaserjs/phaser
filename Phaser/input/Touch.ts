/// <reference path="../Game.ts" />
/// <reference path="Pointer.ts" />

/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Pointer objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/

module Phaser {

    export class Touch {

        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        constructor(game: Game) {

            this._game = game;

        }

        /**
        * Local private reference to game.
        * @property _game
        * @type {Phaser.Game}
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

            if (this._game.device.touch)
            {
                this._game.stage.canvas.addEventListener('touchstart', (event) => this.onTouchStart(event), false);
                this._game.stage.canvas.addEventListener('touchmove', (event) => this.onTouchMove(event), false);
                this._game.stage.canvas.addEventListener('touchend', (event) => this.onTouchEnd(event), false);
                this._game.stage.canvas.addEventListener('touchenter', (event) => this.onTouchEnter(event), false);
                this._game.stage.canvas.addEventListener('touchleave', (event) => this.onTouchLeave(event), false);
                this._game.stage.canvas.addEventListener('touchcancel', (event) => this.onTouchCancel(event), false);

                document.addEventListener('touchmove', (event) => this.consumeTouchMove(event), false);
            }

        }

        /**
        * Prevent iOS bounce-back (doesn't work?)
        * @method consumeTouchMove
        * @param {Any} event
        **/
        private consumeTouchMove(event) {

            event.preventDefault();

        }

        /**
        *
        * @method onTouchStart
        * @param {Any} event
        **/
        private onTouchStart(event) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();

            //  event.targetTouches = list of all touches on the TARGET ELEMENT (i.e. game dom element)
            //  event.touches = list of all touches on the ENTIRE DOCUMENT, not just the target element
            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for (var i = 0; i < event.changedTouches.length; i++)
            {
                this._game.input.startPointer(event.changedTouches[i]);
            }

        }

        /**
        * Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
        * Occurs for example on iOS when you put down 4 fingers and the app selector UI appears
        * @method onTouchCancel
        * @param {Any} event
        **/
        private onTouchCancel(event) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();

            //  Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
            //  http://www.w3.org/TR/touch-events/#dfn-touchcancel
            for (var i = 0; i < event.changedTouches.length; i++)
            {
                this._game.input.stopPointer(event.changedTouches[i]);
            }

        }

        /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchEnter
        * @param {Any} event
        **/
        private onTouchEnter(event) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++)
            {
                console.log('touch enter');
            }

        }

        /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchLeave
        * @param {Any} event
        **/
        private onTouchLeave(event) {

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++)
            {
                console.log('touch leave');
            }

        }

        /**
        *
        * @method onTouchMove
        * @param {Any} event
        **/
        private onTouchMove(event) {

            event.preventDefault();

            for (var i = 0; i < event.changedTouches.length; i++)
            {
                this._game.input.updatePointer(event.changedTouches[i]);
            }

        }

        /**
        *
        * @method onTouchEnd
        * @param {Any} event
        **/
        private onTouchEnd(event) {

            event.preventDefault();

            //  For touch end its a list of the touch points that have been removed from the surface
            //  https://developer.mozilla.org/en-US/docs/DOM/TouchList

            //  event.changedTouches = the touches that CHANGED in this event, not the total number of them
            for (var i = 0; i < event.changedTouches.length; i++)
            {
                this._game.input.stopPointer(event.changedTouches[i]);
            }

        }

        /**
        * Stop the event listeners
        * @method stop
        */
        public stop() {

            if (this._game.device.touch)
            {
                //this._domElement.addEventListener('touchstart', (event) => this.onTouchStart(event), false);
                //this._domElement.addEventListener('touchmove', (event) => this.onTouchMove(event), false);
                //this._domElement.addEventListener('touchend', (event) => this.onTouchEnd(event), false);
                //this._domElement.addEventListener('touchenter', (event) => this.onTouchEnter(event), false);
                //this._domElement.addEventListener('touchleave', (event) => this.onTouchLeave(event), false);
                //this._domElement.addEventListener('touchcancel', (event) => this.onTouchCancel(event), false);
            }

        }

    }

}